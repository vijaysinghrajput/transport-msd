-- ================================================
-- Solar CRM - Comprehensive 42 Status Workflow Migration
-- ================================================
-- This migration creates tables for the complete lead workflow
-- from initial contact to project completion with subsidy tracking
-- ================================================

-- Drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS public.lead_status_history CASCADE;
DROP TABLE IF EXISTS public.lead_payments CASCADE;
DROP TABLE IF EXISTS public.lead_pm_suryaghar CASCADE;
DROP TABLE IF EXISTS public.lead_net_meter CASCADE;

-- ================================================
-- 1. LEAD STATUS HISTORY TABLE
-- ================================================
-- Tracks every status change with complete audit trail
-- ================================================

CREATE TABLE public.lead_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    changed_by_name TEXT,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lead_status_history
CREATE INDEX idx_lead_status_history_lead_id ON public.lead_status_history(lead_id);
CREATE INDEX idx_lead_status_history_changed_at ON public.lead_status_history(changed_at DESC);
CREATE INDEX idx_lead_status_history_new_status ON public.lead_status_history(new_status);

-- ================================================
-- 2. LEAD PAYMENTS TABLE
-- ================================================
-- Supports BOTH finance and cash payments
-- Multiple bank applications per lead allowed
-- ================================================

CREATE TABLE public.lead_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    payment_type TEXT NOT NULL CHECK (payment_type IN ('cash', 'finance')),
    
    -- Finance Payment Fields
    finance_application_id TEXT,
    bank_name TEXT,
    ifsc_code TEXT,
    sanctioned_amount DECIMAL(12,2),
    disbursed_amount DECIMAL(12,2),
    disbursement_date DATE,
    pending_amount DECIMAL(12,2),
    account_number TEXT,
    vendor_name TEXT,
    approval_status TEXT CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    
    -- Cash Payment Fields
    total_amount DECIMAL(12,2),
    paid_amount DECIMAL(12,2),
    pending_cash_amount DECIMAL(12,2),
    payment_mode TEXT CHECK (payment_mode IN ('cash', 'cheque', 'online', 'upi')),
    payment_date DATE,
    payment_reference TEXT,
    
    -- Common Fields
    notes TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_by_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lead_payments
CREATE INDEX idx_lead_payments_lead_id ON public.lead_payments(lead_id);
CREATE INDEX idx_lead_payments_payment_type ON public.lead_payments(payment_type);
CREATE INDEX idx_lead_payments_bank_name ON public.lead_payments(bank_name) WHERE payment_type = 'finance';
CREATE INDEX idx_lead_payments_approval_status ON public.lead_payments(approval_status) WHERE payment_type = 'finance';

-- ================================================
-- 3. LEAD PM SURYAGHAR TABLE
-- ================================================
-- PM Surya Ghar portal tracking (Subsidy eligible only)
-- One record per lead
-- ================================================

CREATE TABLE public.lead_pm_suryaghar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL UNIQUE REFERENCES public.leads(id) ON DELETE CASCADE,
    
    -- Portal Login Details
    portal_login_id TEXT,
    portal_password_hint TEXT,
    registration_date DATE,
    
    -- Application Details
    application_number TEXT,
    consumer_number TEXT,
    discom_name TEXT,
    sanction_load_kw DECIMAL(10,2),
    
    -- Feasibility Details
    feasibility_status TEXT CHECK (feasibility_status IN ('pending', 'approved', 'rejected')),
    feasibility_approval_date DATE,
    rejection_reason TEXT,
    
    -- Portal Status
    portal_status TEXT,
    
    -- Metadata
    notes TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_by_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lead_pm_suryaghar
CREATE INDEX idx_lead_pm_suryaghar_lead_id ON public.lead_pm_suryaghar(lead_id);
CREATE INDEX idx_lead_pm_suryaghar_application_number ON public.lead_pm_suryaghar(application_number);
CREATE INDEX idx_lead_pm_suryaghar_feasibility_status ON public.lead_pm_suryaghar(feasibility_status);

-- ================================================
-- 4. LEAD NET METER TABLE
-- ================================================
-- Net meter application and installation tracking
-- Required for subsidy eligible leads only
-- ================================================

CREATE TABLE public.lead_net_meter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL UNIQUE REFERENCES public.leads(id) ON DELETE CASCADE,
    
    -- Application Details
    application_number TEXT,
    application_date DATE,
    approval_date DATE,
    
    -- Installation Details
    installation_date DATE,
    meter_number TEXT,
    meter_type TEXT,
    discom_name TEXT,
    
    -- Agreement Details
    agreement_signed BOOLEAN DEFAULT FALSE,
    agreement_date DATE,
    
    -- Commissioning Details
    commissioning_date DATE,
    first_generation_date DATE,
    monthly_generation_kwh DECIMAL(10,2),
    
    -- Metadata
    notes TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_by_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lead_net_meter
CREATE INDEX idx_lead_net_meter_lead_id ON public.lead_net_meter(lead_id);
CREATE INDEX idx_lead_net_meter_application_number ON public.lead_net_meter(application_number);
CREATE INDEX idx_lead_net_meter_meter_number ON public.lead_net_meter(meter_number);
CREATE INDEX idx_lead_net_meter_installation_date ON public.lead_net_meter(installation_date);

-- ================================================
-- TRIGGERS FOR UPDATED_AT
-- ================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lead_payments_updated_at
    BEFORE UPDATE ON public.lead_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lead_pm_suryaghar_updated_at
    BEFORE UPDATE ON public.lead_pm_suryaghar
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lead_net_meter_updated_at
    BEFORE UPDATE ON public.lead_net_meter
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

-- Enable RLS
ALTER TABLE public.lead_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_pm_suryaghar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_net_meter ENABLE ROW LEVEL SECURITY;

-- Policies for lead_status_history
CREATE POLICY "Users can view status history for leads in their branch"
    ON public.lead_status_history FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.leads l
            INNER JOIN public.users u ON u.id = auth.uid()
            WHERE l.id = lead_status_history.lead_id
            AND (u.role = 'admin' OR u.branch_id = l.branch_id)
        )
    );

CREATE POLICY "Users can insert status history for leads in their branch"
    ON public.lead_status_history FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.leads l
            INNER JOIN public.users u ON u.id = auth.uid()
            WHERE l.id = lead_status_history.lead_id
            AND (u.role = 'admin' OR u.branch_id = l.branch_id)
        )
    );

-- Policies for lead_payments
CREATE POLICY "Users can view payments for leads in their branch"
    ON public.lead_payments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.leads l
            INNER JOIN public.users u ON u.id = auth.uid()
            WHERE l.id = lead_payments.lead_id
            AND (u.role = 'admin' OR u.branch_id = l.branch_id)
        )
    );

CREATE POLICY "Users can insert payments for leads in their branch"
    ON public.lead_payments FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.leads l
            INNER JOIN public.users u ON u.id = auth.uid()
            WHERE l.id = lead_payments.lead_id
            AND (u.role = 'admin' OR u.branch_id = l.branch_id)
        )
    );

CREATE POLICY "Users can update payments for leads in their branch"
    ON public.lead_payments FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.leads l
            INNER JOIN public.users u ON u.id = auth.uid()
            WHERE l.id = lead_payments.lead_id
            AND (u.role = 'admin' OR u.branch_id = l.branch_id)
        )
    );

-- Policies for lead_pm_suryaghar
CREATE POLICY "Users can view PM Surya data for leads in their branch"
    ON public.lead_pm_suryaghar FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.leads l
            INNER JOIN public.users u ON u.id = auth.uid()
            WHERE l.id = lead_pm_suryaghar.lead_id
            AND (u.role = 'admin' OR u.branch_id = l.branch_id)
        )
    );

CREATE POLICY "Users can insert PM Surya data for leads in their branch"
    ON public.lead_pm_suryaghar FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.leads l
            INNER JOIN public.users u ON u.id = auth.uid()
            WHERE l.id = lead_pm_suryaghar.lead_id
            AND (u.role = 'admin' OR u.branch_id = l.branch_id)
        )
    );

CREATE POLICY "Users can update PM Surya data for leads in their branch"
    ON public.lead_pm_suryaghar FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.leads l
            INNER JOIN public.users u ON u.id = auth.uid()
            WHERE l.id = lead_pm_suryaghar.lead_id
            AND (u.role = 'admin' OR u.branch_id = l.branch_id)
        )
    );

-- Policies for lead_net_meter
CREATE POLICY "Users can view net meter data for leads in their branch"
    ON public.lead_net_meter FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.leads l
            INNER JOIN public.users u ON u.id = auth.uid()
            WHERE l.id = lead_net_meter.lead_id
            AND (u.role = 'admin' OR u.branch_id = l.branch_id)
        )
    );

CREATE POLICY "Users can insert net meter data for leads in their branch"
    ON public.lead_net_meter FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.leads l
            INNER JOIN public.users u ON u.id = auth.uid()
            WHERE l.id = lead_net_meter.lead_id
            AND (u.role = 'admin' OR u.branch_id = l.branch_id)
        )
    );

CREATE POLICY "Users can update net meter data for leads in their branch"
    ON public.lead_net_meter FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.leads l
            INNER JOIN public.users u ON u.id = auth.uid()
            WHERE l.id = lead_net_meter.lead_id
            AND (u.role = 'admin' OR u.branch_id = l.branch_id)
        )
    );

-- ================================================
-- COMMENTS FOR DOCUMENTATION
-- ================================================

COMMENT ON TABLE public.lead_status_history IS 'Tracks all status changes for leads with complete audit trail';
COMMENT ON TABLE public.lead_payments IS 'Manages both finance and cash payments. Supports multiple bank applications per lead';
COMMENT ON TABLE public.lead_pm_suryaghar IS 'PM Surya Ghar portal tracking for subsidy eligible leads';
COMMENT ON TABLE public.lead_net_meter IS 'Net meter application and installation tracking for subsidy eligible leads';

COMMENT ON COLUMN public.lead_payments.payment_type IS 'Type of payment: cash or finance';
COMMENT ON COLUMN public.lead_payments.approval_status IS 'For finance: pending, approved, rejected';
COMMENT ON COLUMN public.lead_pm_suryaghar.feasibility_status IS 'PM Surya feasibility status: pending, approved, rejected';
COMMENT ON COLUMN public.lead_net_meter.agreement_signed IS 'Whether net metering agreement is signed with DISCOM';

-- ================================================
-- MIGRATION COMPLETE
-- ================================================
-- The following tables are now available:
-- 1. lead_status_history - Status change tracking
-- 2. lead_payments - Finance & cash payment tracking
-- 3. lead_pm_suryaghar - PM Surya portal details
-- 4. lead_net_meter - Net meter tracking
--
-- These tables integrate with the existing 'leads' table
-- and support the 42-status workflow system
-- ================================================
