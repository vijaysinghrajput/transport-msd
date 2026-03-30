-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'branch_manager', 'staff');

-- Create branches table first
CREATE TABLE IF NOT EXISTS public.branches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    manager_id UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'staff',
    branch_id UUID REFERENCES public.branches(id),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    system_capacity DECIMAL(10,2),
    system_type VARCHAR(50),
    property_type VARCHAR(50),
    monthly_bill DECIMAL(10,2),
    source VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new',
    assigned_to UUID REFERENCES public.users(id),
    branch_id UUID REFERENCES public.branches(id),
    notes TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create lead activities table
CREATE TABLE IF NOT EXISTS public.lead_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create subsidy claims table
CREATE TABLE IF NOT EXISTS public.subsidy_claims (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES public.leads(id),
    customer_name VARCHAR(255) NOT NULL,
    system_capacity DECIMAL(10,2) NOT NULL,
    installation_cost DECIMAL(12,2) NOT NULL,
    subsidy_amount DECIMAL(12,2) NOT NULL,
    subsidy_percentage DECIMAL(5,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    application_number VARCHAR(255),
    submitted_date DATE,
    approval_date DATE,
    disbursement_date DATE,
    rejection_reason TEXT,
    documents_required TEXT[],
    documents_submitted TEXT[],
    branch_id UUID REFERENCES public.branches(id),
    created_by UUID REFERENCES public.users(id),
    updated_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add foreign key constraint to branches table for manager_id
ALTER TABLE public.branches 
ADD CONSTRAINT fk_branch_manager 
FOREIGN KEY (manager_id) REFERENCES public.users(id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_branches_updated_at
    BEFORE UPDATE ON public.branches
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_subsidy_claims_updated_at
    BEFORE UPDATE ON public.subsidy_claims
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Enable Row Level Security
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subsidy_claims ENABLE ROW LEVEL SECURITY;

-- Create policies for branches
CREATE POLICY "Branches are viewable by authenticated users" ON public.branches
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage all branches" ON public.branches
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create policies for users
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Branch managers can view users in their branch" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users current_user
            WHERE current_user.id = auth.uid() 
            AND current_user.role = 'branch_manager'
            AND current_user.branch_id = users.branch_id
        )
    );

-- Create policies for leads
CREATE POLICY "Users can view leads in their branch" ON public.leads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND (
                role = 'admin' 
                OR branch_id = leads.branch_id
                OR id = leads.assigned_to
            )
        )
    );

CREATE POLICY "Users can insert leads in their branch" ON public.leads
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND (role = 'admin' OR branch_id = leads.branch_id)
        )
    );

CREATE POLICY "Users can update leads in their branch" ON public.leads
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND (
                role = 'admin' 
                OR branch_id = leads.branch_id
                OR id = leads.assigned_to
            )
        )
    );

-- Create policies for lead activities
CREATE POLICY "Users can view lead activities for accessible leads" ON public.lead_activities
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.leads 
            WHERE id = lead_activities.lead_id
            AND EXISTS (
                SELECT 1 FROM public.users 
                WHERE users.id = auth.uid() 
                AND (
                    users.role = 'admin' 
                    OR users.branch_id = leads.branch_id
                    OR users.id = leads.assigned_to
                )
            )
        )
    );

-- Create policies for subsidy claims
CREATE POLICY "Users can view subsidy claims in their branch" ON public.subsidy_claims
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND (role = 'admin' OR branch_id = subsidy_claims.branch_id)
        )
    );
