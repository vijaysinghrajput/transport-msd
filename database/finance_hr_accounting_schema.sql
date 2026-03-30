-- =====================================================
-- COMPLETE FINANCE, HR & ACCOUNTING SYSTEM SCHEMA
-- Integrates with existing: users, branches, attendance_logs, commission_structure
-- =====================================================

-- =====================================================
-- ANALYSIS OF EXISTING TABLES
-- =====================================================
-- ✓ users (68 records) - Has: employee_id, bank details, KYC, territory
-- ✓ branches (8 records) - Has: manager, location, operating hours
-- ✓ attendance_logs (323 records) - Has: check-in/out with GPS
-- ✓ commission_structure - Has: role-based commission rules
-- ✓ commission_payments - Has: payment tracking
-- ✓ quotations (13 records) - Sales quotations

-- =====================================================
-- 1. HR & EMPLOYEE MANAGEMENT (Extending users table)
-- =====================================================

-- Departments
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES departments(id),
    manager_id UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Designations
CREATE TABLE IF NOT EXISTS designations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    level INTEGER NOT NULL,
    department_id UUID REFERENCES departments(id),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employee Details (extends users table - users already has bank, KYC, employee_id)
-- This table adds additional HR-specific fields
CREATE TABLE IF NOT EXISTS employee_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) UNIQUE NOT NULL,
    department_id UUID REFERENCES departments(id),
    designation_id UUID REFERENCES designations(id),
    reporting_manager_id UUID REFERENCES users(id),
    
    -- Personal Information (users table has name, phone, email already)
    date_of_birth DATE,
    gender VARCHAR(20),
    blood_group VARCHAR(5),
    marital_status VARCHAR(20),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    
    -- Address (users may have some address info in branches)
    current_address TEXT,
    permanent_address TEXT,
    
    -- Employment Details
    date_of_joining DATE NOT NULL,
    employment_type VARCHAR(50) DEFAULT 'permanent', -- permanent, contract, intern, consultant
    probation_period INTEGER DEFAULT 6, -- in months
    probation_end_date DATE,
    confirmation_date DATE,
    
    -- Status (users table has is_active already)
    employment_status VARCHAR(50) DEFAULT 'active', -- active, on_probation, confirmed, resigned, terminated
    date_of_exit DATE,
    exit_reason TEXT,
    notice_period_days INTEGER DEFAULT 30,
    
    -- Additional IDs (users has PAN, Aadhar already)
    uan_number VARCHAR(20), -- PF UAN
    esic_number VARCHAR(20),
    pf_account_number VARCHAR(50),
    
    -- Salary Account (users has bank details already, this is for salary-specific account if different)
    salary_account_number VARCHAR(50),
    salary_bank_name VARCHAR(100),
    salary_ifsc_code VARCHAR(20),
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employee Documents (Additional docs beyond KYC in users table)
CREATE TABLE IF NOT EXISTS employee_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- Resume, Education Certificate, Experience Letter, etc.
    document_name VARCHAR(255) NOT NULL,
    document_url TEXT NOT NULL,
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    expiry_date DATE,
    notes TEXT,
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ
);

-- Leave Types
CREATE TABLE IF NOT EXISTS leave_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    max_days_per_year INTEGER,
    carry_forward BOOLEAN DEFAULT false,
    max_carry_forward INTEGER,
    encashable BOOLEAN DEFAULT false,
    paid BOOLEAN DEFAULT true,
    requires_approval BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leave Balances (Links to users table)
CREATE TABLE IF NOT EXISTS leave_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    leave_type_id UUID REFERENCES leave_types(id),
    year INTEGER NOT NULL,
    opening_balance DECIMAL(5,1) DEFAULT 0,
    earned DECIMAL(5,1) DEFAULT 0,
    used DECIMAL(5,1) DEFAULT 0,
    balance DECIMAL(5,1) DEFAULT 0,
    carried_forward DECIMAL(5,1) DEFAULT 0,
    UNIQUE(user_id, leave_type_id, year)
);

-- Leave Applications (Links to users table)
CREATE TABLE IF NOT EXISTS leave_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    leave_type_id UUID REFERENCES leave_types(id),
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    total_days DECIMAL(5,1) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, cancelled
    applied_on TIMESTAMPTZ DEFAULT NOW(),
    approved_by UUID REFERENCES users(id),
    approved_on TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. PAYROLL & SALARY MANAGEMENT
-- =====================================================

-- Salary Components
CREATE TABLE IF NOT EXISTS salary_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- earning, deduction
    category VARCHAR(50), -- basic, allowance, bonus, statutory, loan
    description TEXT,
    calculation_type VARCHAR(50), -- fixed, percentage, formula
    is_taxable BOOLEAN DEFAULT true,
    is_pf_applicable BOOLEAN DEFAULT false,
    is_esi_applicable BOOLEAN DEFAULT false,
    display_order INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employee Salary Structure (Links to users table)
CREATE TABLE IF NOT EXISTS employee_salary_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    effective_from DATE NOT NULL,
    effective_to DATE,
    ctc_annual DECIMAL(15,2) NOT NULL,
    gross_monthly DECIMAL(15,2) NOT NULL,
    net_monthly DECIMAL(15,2) NOT NULL,
    basic_salary DECIMAL(15,2) NOT NULL,
    
    -- Status
    is_current BOOLEAN DEFAULT true,
    revision_reason TEXT,
    remarks TEXT,
    
    created_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Salary Structure Components
CREATE TABLE IF NOT EXISTS salary_structure_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    salary_structure_id UUID REFERENCES employee_salary_structures(id) ON DELETE CASCADE,
    component_id UUID REFERENCES salary_components(id),
    amount DECIMAL(15,2) NOT NULL,
    percentage DECIMAL(5,2),
    calculation_formula TEXT
);

-- Payroll Runs
CREATE TABLE IF NOT EXISTS payroll_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- draft, processed, approved, paid
    total_employees INTEGER,
    total_gross DECIMAL(15,2),
    total_deductions DECIMAL(15,2),
    total_net DECIMAL(15,2),
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMPTZ,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(month, year)
);

-- Payroll Details (Salary Slips)
CREATE TABLE IF NOT EXISTS payroll_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_run_id UUID REFERENCES payroll_runs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    salary_structure_id UUID REFERENCES employee_salary_structures(id),
    
    -- Attendance
    working_days INTEGER,
    present_days DECIMAL(5,1),
    leaves DECIMAL(5,1),
    loss_of_pay_days DECIMAL(5,1),
    
    -- Amounts
    gross_salary DECIMAL(15,2),
    total_earnings DECIMAL(15,2),
    total_deductions DECIMAL(15,2),
    net_salary DECIMAL(15,2),
    
    -- Tax
    tds DECIMAL(15,2),
    professional_tax DECIMAL(15,2),
    
    -- Remarks
    remarks TEXT,
    
    -- Payment
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed
    payment_date DATE,
    payment_mode VARCHAR(50),
    payment_reference VARCHAR(100),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payroll Component Details (Breakdown)
CREATE TABLE IF NOT EXISTS payroll_component_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_detail_id UUID REFERENCES payroll_details(id) ON DELETE CASCADE,
    component_id UUID REFERENCES salary_components(id),
    amount DECIMAL(15,2) NOT NULL
);

-- Employee Loans
CREATE TABLE IF NOT EXISTS employee_loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    loan_type VARCHAR(100) NOT NULL, -- Advance, Personal Loan, etc.
    amount DECIMAL(15,2) NOT NULL,
    sanctioned_amount DECIMAL(15,2),
    interest_rate DECIMAL(5,2) DEFAULT 0,
    tenure_months INTEGER,
    emi_amount DECIMAL(15,2),
    
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, active, closed
    applied_date DATE NOT NULL,
    approved_by UUID REFERENCES users(id),
    approved_date DATE,
    disbursement_date DATE,
    
    total_paid DECIMAL(15,2) DEFAULT 0,
    outstanding DECIMAL(15,2),
    
    reason TEXT,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Loan Repayments
CREATE TABLE IF NOT EXISTS loan_repayments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID REFERENCES employee_loans(id) ON DELETE CASCADE,
    payroll_detail_id UUID REFERENCES payroll_details(id),
    payment_date DATE NOT NULL,
    principal DECIMAL(15,2),
    interest DECIMAL(15,2),
    amount DECIMAL(15,2) NOT NULL,
    balance DECIMAL(15,2),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. EXPENSE MANAGEMENT
-- =====================================================

-- Expense Categories
CREATE TABLE IF NOT EXISTS expense_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    parent_id UUID REFERENCES expense_categories(id),
    description TEXT,
    budget_limit DECIMAL(15,2),
    requires_approval BOOLEAN DEFAULT true,
    approver_role VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expense Claims
CREATE TABLE IF NOT EXISTS expense_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    claim_date DATE NOT NULL,
    category_id UUID REFERENCES expense_categories(id),
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(15,2) NOT NULL,
    
    -- Approval Workflow
    status VARCHAR(50) DEFAULT 'draft', -- draft, submitted, approved, rejected, paid
    submitted_at TIMESTAMPTZ,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    -- Payment
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_date DATE,
    payment_mode VARCHAR(50),
    payment_reference VARCHAR(100),
    
    -- Documents
    has_attachments BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expense Items (Line items for claims)
CREATE TABLE IF NOT EXISTS expense_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_claim_id UUID REFERENCES expense_claims(id) ON DELETE CASCADE,
    expense_date DATE NOT NULL,
    category_id UUID REFERENCES expense_categories(id),
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    quantity DECIMAL(10,2) DEFAULT 1,
    unit_price DECIMAL(15,2),
    tax_amount DECIMAL(15,2) DEFAULT 0,
    billable BOOLEAN DEFAULT false,
    client_id UUID,
    remarks TEXT
);

-- Expense Attachments
CREATE TABLE IF NOT EXISTS expense_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_claim_id UUID REFERENCES expense_claims(id) ON DELETE CASCADE,
    expense_item_id UUID REFERENCES expense_items(id),
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Petty Cash Transactions
CREATE TABLE IF NOT EXISTS petty_cash_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_date DATE NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- received, paid
    category_id UUID REFERENCES expense_categories(id),
    amount DECIMAL(15,2) NOT NULL,
    description TEXT NOT NULL,
    voucher_number VARCHAR(50),
    received_from VARCHAR(255),
    paid_to VARCHAR(255),
    approved_by UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. BILLING & INVOICING
-- =====================================================

-- Invoice Master
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE,
    
    -- Customer/Lead
    customer_type VARCHAR(50), -- lead, customer, other
    lead_id UUID REFERENCES leads(id),
    customer_id UUID REFERENCES customers(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_address TEXT,
    customer_gstin VARCHAR(20),
    
    -- Billing Details
    subtotal DECIMAL(15,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    taxable_amount DECIMAL(15,2),
    
    -- GST
    cgst_percentage DECIMAL(5,2) DEFAULT 0,
    cgst_amount DECIMAL(15,2) DEFAULT 0,
    sgst_percentage DECIMAL(5,2) DEFAULT 0,
    sgst_amount DECIMAL(15,2) DEFAULT 0,
    igst_percentage DECIMAL(5,2) DEFAULT 0,
    igst_amount DECIMAL(15,2) DEFAULT 0,
    
    total_amount DECIMAL(15,2) NOT NULL,
    amount_paid DECIMAL(15,2) DEFAULT 0,
    balance_due DECIMAL(15,2),
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- draft, sent, paid, partially_paid, overdue, cancelled
    payment_status VARCHAR(50) DEFAULT 'unpaid',
    
    -- Additional
    quotation_id UUID REFERENCES quotations(id),
    terms_and_conditions TEXT,
    notes TEXT,
    
    -- Created by
    branch_id UUID REFERENCES branches(id),
    created_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoice Items
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    item_type VARCHAR(50), -- product, service, installation
    product_id UUID REFERENCES products(id),
    
    description TEXT NOT NULL,
    hsn_sac_code VARCHAR(20),
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50),
    unit_price DECIMAL(15,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    taxable_amount DECIMAL(15,2),
    tax_percentage DECIMAL(5,2),
    tax_amount DECIMAL(15,2),
    total_amount DECIMAL(15,2) NOT NULL,
    
    display_order INTEGER
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_number VARCHAR(50) UNIQUE NOT NULL,
    payment_date DATE NOT NULL,
    
    invoice_id UUID REFERENCES invoices(id),
    customer_name VARCHAR(255),
    amount DECIMAL(15,2) NOT NULL,
    
    payment_mode VARCHAR(50) NOT NULL, -- cash, cheque, online, upi, card
    payment_reference VARCHAR(100),
    bank_name VARCHAR(100),
    transaction_id VARCHAR(100),
    
    status VARCHAR(50) DEFAULT 'completed', -- pending, completed, failed, refunded
    notes TEXT,
    
    branch_id UUID REFERENCES branches(id),
    received_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credit Notes
CREATE TABLE IF NOT EXISTS credit_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credit_note_number VARCHAR(50) UNIQUE NOT NULL,
    credit_note_date DATE NOT NULL,
    invoice_id UUID REFERENCES invoices(id),
    
    customer_name VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    
    status VARCHAR(50) DEFAULT 'issued', -- issued, applied, cancelled
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. ACCOUNTING & LEDGER
-- =====================================================

-- Chart of Accounts
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_code VARCHAR(20) UNIQUE NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL, -- asset, liability, equity, income, expense
    account_category VARCHAR(100), -- current_asset, fixed_asset, bank, etc.
    parent_account_id UUID REFERENCES accounts(id),
    
    description TEXT,
    opening_balance DECIMAL(15,2) DEFAULT 0,
    current_balance DECIMAL(15,2) DEFAULT 0,
    
    is_system_account BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journal Entries
CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_number VARCHAR(50) UNIQUE NOT NULL,
    entry_date DATE NOT NULL,
    entry_type VARCHAR(50), -- journal, payment, receipt, contra
    reference_type VARCHAR(50), -- invoice, payment, expense, salary
    reference_id UUID,
    reference_number VARCHAR(100),
    
    description TEXT NOT NULL,
    total_debit DECIMAL(15,2) NOT NULL,
    total_credit DECIMAL(15,2) NOT NULL,
    
    status VARCHAR(50) DEFAULT 'draft', -- draft, posted, approved, reversed
    posted_by UUID REFERENCES users(id),
    posted_at TIMESTAMPTZ,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journal Entry Lines
CREATE TABLE IF NOT EXISTS journal_entry_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
    account_id UUID REFERENCES accounts(id) NOT NULL,
    
    debit DECIMAL(15,2) DEFAULT 0,
    credit DECIMAL(15,2) DEFAULT 0,
    description TEXT,
    
    line_order INTEGER
);

-- Bank Accounts
CREATE TABLE IF NOT EXISTS bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES accounts(id) UNIQUE,
    bank_name VARCHAR(100) NOT NULL,
    branch_name VARCHAR(100),
    account_number VARCHAR(50) UNIQUE NOT NULL,
    account_holder_name VARCHAR(255) NOT NULL,
    ifsc_code VARCHAR(20),
    account_type VARCHAR(50), -- current, savings
    opening_balance DECIMAL(15,2) DEFAULT 0,
    current_balance DECIMAL(15,2) DEFAULT 0,
    
    is_primary BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bank Reconciliation
CREATE TABLE IF NOT EXISTS bank_reconciliations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_account_id UUID REFERENCES bank_accounts(id),
    reconciliation_date DATE NOT NULL,
    statement_balance DECIMAL(15,2) NOT NULL,
    book_balance DECIMAL(15,2) NOT NULL,
    difference DECIMAL(15,2),
    status VARCHAR(50) DEFAULT 'pending', -- pending, reconciled
    reconciled_by UUID REFERENCES users(id),
    reconciled_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assets
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_code VARCHAR(50) UNIQUE NOT NULL,
    asset_name VARCHAR(255) NOT NULL,
    asset_category VARCHAR(100), -- furniture, equipment, vehicle, etc.
    account_id UUID REFERENCES accounts(id),
    
    purchase_date DATE NOT NULL,
    purchase_cost DECIMAL(15,2) NOT NULL,
    useful_life_years INTEGER,
    salvage_value DECIMAL(15,2) DEFAULT 0,
    depreciation_method VARCHAR(50), -- straight_line, declining_balance
    
    accumulated_depreciation DECIMAL(15,2) DEFAULT 0,
    book_value DECIMAL(15,2),
    
    location VARCHAR(255),
    assigned_to UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'active', -- active, disposed, under_maintenance
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asset Depreciation
CREATE TABLE IF NOT EXISTS asset_depreciation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    depreciation_date DATE NOT NULL,
    depreciation_amount DECIMAL(15,2) NOT NULL,
    accumulated_depreciation DECIMAL(15,2),
    book_value DECIMAL(15,2),
    journal_entry_id UUID REFERENCES journal_entries(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. BUDGETS & FORECASTING
-- =====================================================

-- Budgets
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    budget_name VARCHAR(255) NOT NULL,
    budget_type VARCHAR(50), -- department, project, category
    department_id UUID REFERENCES departments(id),
    category_id UUID REFERENCES expense_categories(id),
    
    fiscal_year INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    total_budget DECIMAL(15,2) NOT NULL,
    total_spent DECIMAL(15,2) DEFAULT 0,
    total_remaining DECIMAL(15,2),
    
    status VARCHAR(50) DEFAULT 'active',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budget Allocations (Monthly breakdown)
CREATE TABLE IF NOT EXISTS budget_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
    month INTEGER NOT NULL,
    allocated_amount DECIMAL(15,2) NOT NULL,
    spent_amount DECIMAL(15,2) DEFAULT 0,
    remaining_amount DECIMAL(15,2)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_employee_details_user_id ON employee_details(user_id);
CREATE INDEX idx_employee_details_department ON employee_details(department_id);
CREATE INDEX idx_employee_details_status ON employee_details(employment_status);

CREATE INDEX idx_leave_applications_user ON leave_applications(user_id);
CREATE INDEX idx_leave_applications_status ON leave_applications(status);

CREATE INDEX idx_payroll_details_user ON payroll_details(user_id);
CREATE INDEX idx_payroll_details_run ON payroll_details(payroll_run_id);

CREATE INDEX idx_expense_claims_user ON expense_claims(user_id);
CREATE INDEX idx_expense_claims_status ON expense_claims(status);

CREATE INDEX idx_invoices_customer ON invoices(customer_name);
CREATE INDEX idx_invoices_date ON invoices(invoice_date);
CREATE INDEX idx_invoices_status ON invoices(status);

CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payments_date ON payments(payment_date);

CREATE INDEX idx_journal_entries_date ON journal_entries(entry_date);
CREATE INDEX idx_journal_entries_status ON journal_entries(status);

-- =====================================================
-- TRIGGERS FOR AUTO-UPDATE
-- =====================================================

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_employee_details_updated_at BEFORE UPDATE ON employee_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leave_applications_updated_at BEFORE UPDATE ON leave_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expense_claims_updated_at BEFORE UPDATE ON expense_claims FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INITIAL DATA - SALARY COMPONENTS
-- =====================================================

INSERT INTO salary_components (name, code, type, category, is_taxable, is_pf_applicable, is_esi_applicable, display_order) VALUES
('Basic Salary', 'BASIC', 'earning', 'basic', true, true, true, 1),
('HRA', 'HRA', 'earning', 'allowance', true, false, true, 2),
('Conveyance Allowance', 'CONV', 'earning', 'allowance', false, false, false, 3),
('Medical Allowance', 'MEDICAL', 'earning', 'allowance', false, false, false, 4),
('Special Allowance', 'SPECIAL', 'earning', 'allowance', true, true, true, 5),
('Performance Bonus', 'BONUS', 'earning', 'bonus', true, false, false, 6),
('Provident Fund', 'PF', 'deduction', 'statutory', false, true, false, 7),
('ESI', 'ESI', 'deduction', 'statutory', false, false, true, 8),
('Professional Tax', 'PT', 'deduction', 'statutory', false, false, false, 9),
('TDS', 'TDS', 'deduction', 'statutory', false, false, false, 10),
('Loan Repayment', 'LOAN', 'deduction', 'loan', false, false, false, 11)
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- INITIAL DATA - LEAVE TYPES
-- =====================================================

INSERT INTO leave_types (name, code, max_days_per_year, carry_forward, max_carry_forward, encashable, paid) VALUES
('Casual Leave', 'CL', 12, true, 5, false, true),
('Sick Leave', 'SL', 12, false, 0, false, true),
('Earned Leave', 'EL', 15, true, 15, true, true),
('Compensatory Off', 'COMP_OFF', 12, false, 0, false, true),
('Maternity Leave', 'ML', 180, false, 0, false, true),
('Paternity Leave', 'PL', 7, false, 0, false, true),
('Loss of Pay', 'LOP', 0, false, 0, false, false)
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- INITIAL DATA - EXPENSE CATEGORIES
-- =====================================================

INSERT INTO expense_categories (name, code, requires_approval) VALUES
('Office Rent', 'RENT', true),
('Utilities', 'UTILITIES', true),
('Office Supplies', 'SUPPLIES', true),
('Travel', 'TRAVEL', true),
('Food & Entertainment', 'FOOD', true),
('Marketing', 'MARKETING', true),
('Software & Subscriptions', 'SOFTWARE', true),
('Vehicle & Fuel', 'VEHICLE', true),
('Maintenance', 'MAINTENANCE', true),
('Miscellaneous', 'MISC', true)
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- INITIAL DATA - CHART OF ACCOUNTS
-- =====================================================

INSERT INTO accounts (account_code, account_name, account_type, account_category, is_system_account) VALUES
-- Assets
('1000', 'Assets', 'asset', 'root', true),
('1100', 'Current Assets', 'asset', 'current_asset', true),
('1110', 'Cash in Hand', 'asset', 'cash', true),
('1120', 'Bank Accounts', 'asset', 'bank', true),
('1130', 'Accounts Receivable', 'asset', 'receivable', true),
('1200', 'Fixed Assets', 'asset', 'fixed_asset', true),

-- Liabilities
('2000', 'Liabilities', 'liability', 'root', true),
('2100', 'Current Liabilities', 'liability', 'current_liability', true),
('2110', 'Accounts Payable', 'liability', 'payable', true),
('2120', 'Tax Payable', 'liability', 'tax', true),

-- Equity
('3000', 'Equity', 'equity', 'root', true),
('3100', 'Owner Equity', 'equity', 'equity', true),

-- Income
('4000', 'Income', 'income', 'root', true),
('4100', 'Sales Revenue', 'income', 'revenue', true),
('4200', 'Other Income', 'income', 'other', true),

-- Expenses
('5000', 'Expenses', 'expense', 'root', true),
('5100', 'Operating Expenses', 'expense', 'operating', true),
('5200', 'Salary & Wages', 'expense', 'payroll', true),
('5300', 'Administrative Expenses', 'expense', 'administrative', true)
ON CONFLICT (account_code) DO NOTHING;

COMMENT ON TABLE employee_details IS 'Additional HR details extending the existing users table';
COMMENT ON TABLE employee_documents IS 'Employee documents beyond KYC documents in users table';
COMMENT ON TABLE employee_salary_structures IS 'Salary structure history for users';
COMMENT ON TABLE payroll_runs IS 'Monthly payroll processing batches';
COMMENT ON TABLE expense_claims IS 'Employee expense claims and reimbursements';
COMMENT ON TABLE invoices IS 'Customer invoicing with GST compliance';
COMMENT ON TABLE accounts IS 'Chart of accounts for double-entry accounting';
COMMENT ON TABLE journal_entries IS 'All accounting journal entries';

-- =====================================================
-- VIEWS FOR EASY ACCESS
-- =====================================================

-- Complete employee view combining users + employee_details
CREATE OR REPLACE VIEW vw_employees AS
SELECT 
    u.id,
    u.email,
    u.name,
    u.role,
    u.branch_id,
    b.name as branch_name,
    u.phone,
    u.employee_id,
    u.is_active,
    
    -- From employee_details
    ed.department_id,
    d.name as department_name,
    ed.designation_id,
    des.title as designation_title,
    ed.reporting_manager_id,
    rm.name as reporting_manager_name,
    ed.date_of_birth,
    ed.gender,
    ed.date_of_joining,
    ed.employment_type,
    ed.employment_status,
    
    -- Bank details from users
    u.bank_name,
    u.bank_account_number,
    u.bank_ifsc_code,
    u.upi_id,
    
    -- KYC from users
    u.pan_number,
    u.aadhar_number,
    u.kyc_status,
    
    -- Additional from employee_details
    ed.uan_number,
    ed.esic_number,
    
    u.created_at,
    u.updated_at
FROM users u
LEFT JOIN employee_details ed ON u.id = ed.user_id
LEFT JOIN branches b ON u.branch_id = b.id
LEFT JOIN departments d ON ed.department_id = d.id
LEFT JOIN designations des ON ed.designation_id = des.id
LEFT JOIN users rm ON ed.reporting_manager_id = rm.id
WHERE u.is_active = true;

-- Monthly attendance summary view
CREATE OR REPLACE VIEW vw_monthly_attendance AS
SELECT 
    u.id as user_id,
    u.name as employee_name,
    u.employee_id,
    EXTRACT(MONTH FROM al.log_date) as month,
    EXTRACT(YEAR FROM al.log_date) as year,
    COUNT(DISTINCT al.log_date) as working_days,
    COUNT(DISTINCT CASE WHEN al.log_type = 'check_in' THEN al.log_date END) as present_days,
    COUNT(DISTINCT CASE WHEN al.status = 'late' THEN al.log_date END) as late_days
FROM users u
LEFT JOIN attendance_logs al ON u.id = al.user_id
WHERE u.is_active = true
GROUP BY u.id, u.name, u.employee_id, EXTRACT(MONTH FROM al.log_date), EXTRACT(YEAR FROM al.log_date);

-- Commission summary view
CREATE OR REPLACE VIEW vw_commission_summary AS
SELECT 
    u.id as user_id,
    u.name as employee_name,
    u.role,
    COUNT(cp.id) as total_commissions,
    SUM(cp.commission_amount) as total_earned,
    SUM(CASE WHEN cp.payment_status = 'paid' THEN cp.commission_amount ELSE 0 END) as total_paid,
    SUM(CASE WHEN cp.payment_status = 'pending' THEN cp.commission_amount ELSE 0 END) as total_pending
FROM users u
LEFT JOIN commission_payments cp ON u.id = cp.user_id
WHERE u.is_active = true
GROUP BY u.id, u.name, u.role;

