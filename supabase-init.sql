-- Supabase Database Initialization Script
-- Run this in your Supabase SQL Editor to set up the complete database

-- 1. Create user role enum
CREATE TYPE user_role AS ENUM ('admin', 'branch_manager', 'staff');

-- 2. Create branches table
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    manager_name VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'staff',
    branch_id UUID REFERENCES branches(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    lead_source VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new',
    system_size_kw DECIMAL(8,2),
    estimated_cost DECIMAL(12,2),
    branch_id UUID REFERENCES branches(id) NOT NULL,
    assigned_to UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Create lead activities table
CREATE TABLE lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Create subsidy claims table
CREATE TABLE subsidy_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
    scheme_name VARCHAR(255) NOT NULL DEFAULT 'PM Surya Ghar Muft Bijli Yojana',
    application_number VARCHAR(100),
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    submitted_date DATE,
    approved_date DATE,
    documents JSONB,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW') NOT NULL
);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE subsidy_claims ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS Policies

-- Branches policies
CREATE POLICY "Admin can view all branches" ON branches
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Users can view their own branch" ON branches
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.branch_id = branches.id
        )
    );

-- Users policies
CREATE POLICY "Admin can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'admin'
        )
    );

CREATE POLICY "Users can view users in their branch" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.branch_id = users.branch_id
        )
    );

CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Leads policies
CREATE POLICY "Admin can view all leads" ON leads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Users can view leads in their branch" ON leads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.branch_id = leads.branch_id
        )
    );

-- Lead activities policies
CREATE POLICY "Users can view activities for accessible leads" ON lead_activities
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM leads l
            JOIN users u ON u.id = auth.uid()
            WHERE l.id = lead_activities.lead_id
            AND (u.role = 'admin' OR u.branch_id = l.branch_id)
        )
    );

-- Subsidy claims policies
CREATE POLICY "Users can view subsidy claims for accessible leads" ON subsidy_claims
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM leads l
            JOIN users u ON u.id = auth.uid()
            WHERE l.id = subsidy_claims.lead_id
            AND (u.role = 'admin' OR u.branch_id = l.branch_id)
        )
    );

-- 9. Insert sample branches
INSERT INTO branches (name, address, phone, email, manager_name, city, state, pincode) VALUES
('Delhi Central Branch', 'Shop No. 123, Connaught Place, New Delhi', '+91-11-2334-5678', 'delhi@sarkarsolarseva.com', 'Rajesh Kumar', 'New Delhi', 'Delhi', '110001'),
('Mumbai West Branch', 'Office 456, Andheri West, Mumbai', '+91-22-2667-8901', 'mumbai@sarkarsolarseva.com', 'Priya Sharma', 'Mumbai', 'Maharashtra', '400058'),
('Bangalore Tech Branch', 'Unit 789, Electronic City, Bangalore', '+91-80-4123-4567', 'bangalore@sarkarsolarseva.com', 'Karthik Reddy', 'Bangalore', 'Karnataka', '560100');

-- 10. Create function to get dashboard statistics
CREATE OR REPLACE FUNCTION get_dashboard_stats(user_id UUID)
RETURNS JSON AS $$
DECLARE
    user_data RECORD;
    result JSON;
BEGIN
    -- Get user information
    SELECT role, branch_id INTO user_data
    FROM users WHERE id = user_id;
    
    IF user_data.role = 'admin' THEN
        -- Admin gets system-wide stats
        SELECT json_build_object(
            'total_leads', (SELECT COUNT(*) FROM leads),
            'total_branches', (SELECT COUNT(*) FROM branches WHERE is_active = true),
            'total_users', (SELECT COUNT(*) FROM users WHERE is_active = true),
            'approved_subsidies', (SELECT COUNT(*) FROM subsidy_claims WHERE status = 'approved'),
            'total_subsidy_amount', (SELECT COALESCE(SUM(amount), 0) FROM subsidy_claims WHERE status = 'approved')
        ) INTO result;
    ELSE
        -- Branch-level stats
        SELECT json_build_object(
            'branch_leads', (SELECT COUNT(*) FROM leads WHERE branch_id = user_data.branch_id),
            'branch_users', (SELECT COUNT(*) FROM users WHERE branch_id = user_data.branch_id AND is_active = true),
            'branch_pending_subsidies', (
                SELECT COUNT(*) FROM subsidy_claims sc
                JOIN leads l ON l.id = sc.lead_id
                WHERE l.branch_id = user_data.branch_id AND sc.status = 'pending'
            ),
            'branch_approved_subsidies', (
                SELECT COUNT(*) FROM subsidy_claims sc
                JOIN leads l ON l.id = sc.lead_id
                WHERE l.branch_id = user_data.branch_id AND sc.status = 'approved'
            ),
            'branch_subsidy_amount', (
                SELECT COALESCE(SUM(sc.amount), 0) FROM subsidy_claims sc
                JOIN leads l ON l.id = sc.lead_id
                WHERE l.branch_id = user_data.branch_id AND sc.status = 'approved'
            )
        ) INTO result;
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Create trigger to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subsidy_claims_updated_at BEFORE UPDATE ON subsidy_claims
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Note: After running this script, you need to:
-- 1. Create users in Supabase Auth Dashboard or via API
-- 2. Insert corresponding records in the users table
-- 3. Add sample leads and activities for testing

-- Example user creation (run after creating auth users):
-- INSERT INTO users (id, name, email, role, branch_id) VALUES
-- ('<auth_user_id_1>', 'Admin User', 'admin@sarkarsolarseva.com', 'admin', NULL),
-- ('<auth_user_id_2>', 'Branch Manager', 'manager@sarkarsolarseva.com', 'branch_manager', '<branch_id>'),
-- ('<auth_user_id_3>', 'Staff Member', 'staff@sarkarsolarseva.com', 'staff', '<branch_id>');
