-- Bank Quotation Margin Money System
-- Create table for storing margin money information for bank quotations only

CREATE TABLE bank_quotation_margins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bank_quotation_id UUID NOT NULL REFERENCES bank_quotations(id) ON DELETE CASCADE,
    
    -- Margin configuration
    margin_percentage DECIMAL(5,2) NOT NULL CHECK (margin_percentage >= 0 AND margin_percentage <= 50),
    margin_amount DECIMAL(12,2) NOT NULL CHECK (margin_amount >= 0),
    distribution_strategy TEXT NOT NULL CHECK (distribution_strategy IN ('products_installation', 'installation_heavy', 'products_heavy', 'equal_split')),
    
    -- Original pricing (before margin)
    original_subtotal DECIMAL(12,2) NOT NULL CHECK (original_subtotal > 0),
    original_installation_cost DECIMAL(12,2) NOT NULL CHECK (original_installation_cost >= 0),
    original_total DECIMAL(12,2) NOT NULL CHECK (original_total > 0),
    
    -- Adjusted pricing (with margin seamlessly distributed)
    adjusted_subtotal DECIMAL(12,2) NOT NULL CHECK (adjusted_subtotal > 0),
    adjusted_installation_cost DECIMAL(12,2) NOT NULL CHECK (adjusted_installation_cost >= 0),
    adjusted_total DECIMAL(12,2) NOT NULL CHECK (adjusted_total > 0),
    
    -- Distribution breakdown
    margin_for_products DECIMAL(12,2) NOT NULL CHECK (margin_for_products >= 0),
    margin_for_installation DECIMAL(12,2) NOT NULL CHECK (margin_for_installation >= 0),
    
    -- Business justifications
    pricing_justifications JSONB,
    enhanced_services JSONB,
    
    -- Validation and audit
    is_validated BOOLEAN DEFAULT false,
    validation_warnings JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    
    -- Constraints
    CONSTRAINT margin_amount_matches_calculation CHECK (margin_amount = adjusted_total - original_total),
    CONSTRAINT margin_distribution_sum CHECK (margin_for_products + margin_for_installation = margin_amount),
    CONSTRAINT adjusted_total_matches_components CHECK (adjusted_total = adjusted_subtotal + adjusted_installation_cost)
);

-- Create table for storing individual product margin adjustments
CREATE TABLE bank_quotation_item_margins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bank_quotation_margin_id UUID NOT NULL REFERENCES bank_quotation_margins(id) ON DELETE CASCADE,
    bank_quotation_item_id UUID NOT NULL REFERENCES bank_quotation_items(id) ON DELETE CASCADE,
    
    -- Original item pricing
    original_unit_price DECIMAL(10,2) NOT NULL CHECK (original_unit_price > 0),
    original_total_price DECIMAL(12,2) NOT NULL CHECK (original_total_price > 0),
    
    -- Margin-adjusted pricing
    adjusted_unit_price DECIMAL(10,2) NOT NULL CHECK (adjusted_unit_price > 0),
    adjusted_total_price DECIMAL(12,2) NOT NULL CHECK (adjusted_total_price > 0),
    
    -- Margin calculation details
    margin_amount DECIMAL(12,2) NOT NULL CHECK (margin_amount >= 0),
    margin_percentage DECIMAL(5,2) NOT NULL CHECK (margin_percentage >= 0),
    
    -- Pricing strategy notes
    pricing_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT margin_calculation_matches CHECK (margin_amount = adjusted_total_price - original_total_price),
    CONSTRAINT margin_percentage_matches CHECK (margin_percentage = (margin_amount / original_total_price) * 100),
    
    -- Unique constraint to prevent duplicate entries
    UNIQUE(bank_quotation_margin_id, bank_quotation_item_id)
);

-- Create indexes for performance
CREATE INDEX idx_bank_quotation_margins_quotation_id ON bank_quotation_margins(bank_quotation_id);
CREATE INDEX idx_bank_quotation_margins_margin_percentage ON bank_quotation_margins(margin_percentage);
CREATE INDEX idx_bank_quotation_margins_created_at ON bank_quotation_margins(created_at);
CREATE INDEX idx_bank_quotation_margins_created_by ON bank_quotation_margins(created_by);

CREATE INDEX idx_bank_quotation_item_margins_margin_id ON bank_quotation_item_margins(bank_quotation_margin_id);
CREATE INDEX idx_bank_quotation_item_margins_item_id ON bank_quotation_item_margins(bank_quotation_item_id);

-- Create RLS policies for security
ALTER TABLE bank_quotation_margins ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_quotation_item_margins ENABLE ROW LEVEL SECURITY;

-- Policy for bank_quotation_margins: Users can only access margins for quotations they created or are assigned to
CREATE POLICY bank_quotation_margins_policy ON bank_quotation_margins
FOR ALL USING (
    auth.uid() = created_by OR 
    EXISTS (
        SELECT 1 FROM bank_quotations bq 
        WHERE bq.id = bank_quotation_id 
        AND (bq.created_by = auth.uid() OR bq.assigned_to = auth.uid())
    )
);

-- Policy for bank_quotation_item_margins: Users can only access item margins for quotations they have access to
CREATE POLICY bank_quotation_item_margins_policy ON bank_quotation_item_margins
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM bank_quotation_margins bqm
        JOIN bank_quotations bq ON bq.id = bqm.bank_quotation_id
        WHERE bqm.id = bank_quotation_margin_id
        AND (bq.created_by = auth.uid() OR bq.assigned_to = auth.uid())
    )
);

-- Function to automatically update bank_quotation_items with margin-adjusted pricing
CREATE OR REPLACE FUNCTION update_bank_quotation_items_with_margin()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the bank_quotation_items table with margin-adjusted prices
    UPDATE bank_quotation_items 
    SET 
        unit_price = bqim.adjusted_unit_price,
        total_price = bqim.adjusted_total_price,
        updated_at = NOW()
    FROM bank_quotation_item_margins bqim
    WHERE bank_quotation_item_margins.bank_quotation_margin_id = NEW.id
    AND bank_quotation_items.id = bqim.bank_quotation_item_id;
    
    -- Update the main bank_quotation with adjusted totals
    UPDATE bank_quotations
    SET 
        subtotal_amount = NEW.adjusted_subtotal,
        installation_cost = NEW.adjusted_installation_cost,
        total_amount = NEW.adjusted_total,
        margin_applied = true,
        margin_percentage = NEW.margin_percentage,
        updated_at = NOW()
    WHERE id = NEW.bank_quotation_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update quotation items when margin is applied
CREATE TRIGGER trigger_update_bank_quotation_items_with_margin
    AFTER INSERT OR UPDATE ON bank_quotation_margins
    FOR EACH ROW
    EXECUTE FUNCTION update_bank_quotation_items_with_margin();

-- Function to calculate and validate margin distribution
CREATE OR REPLACE FUNCTION validate_margin_distribution(
    p_bank_quotation_id UUID,
    p_margin_percentage DECIMAL
) RETURNS JSONB AS $$
DECLARE
    v_original_total DECIMAL;
    v_calculated_margin DECIMAL;
    v_max_item_margin DECIMAL;
    v_warnings JSONB := '[]'::JSONB;
BEGIN
    -- Get original total
    SELECT subtotal_amount + installation_cost INTO v_original_total
    FROM bank_quotations 
    WHERE id = p_bank_quotation_id;
    
    -- Calculate expected margin
    v_calculated_margin := v_original_total * (p_margin_percentage / 100);
    
    -- Check for excessive individual item margins
    SELECT MAX((adjusted_total_price - original_total_price) / original_total_price * 100) 
    INTO v_max_item_margin
    FROM bank_quotation_item_margins bqim
    JOIN bank_quotation_margins bqm ON bqm.id = bqim.bank_quotation_margin_id
    WHERE bqm.bank_quotation_id = p_bank_quotation_id;
    
    -- Add warnings if needed
    IF v_max_item_margin > 40 THEN
        v_warnings := v_warnings || jsonb_build_object(
            'type', 'high_item_margin',
            'message', 'Some items have margin over 40% - may appear suspicious',
            'max_margin', v_max_item_margin
        );
    END IF;
    
    IF p_margin_percentage > 25 THEN
        v_warnings := v_warnings || jsonb_build_object(
            'type', 'high_total_margin',
            'message', 'Total margin over 25% - ensure business justification',
            'margin', p_margin_percentage
        );
    END IF;
    
    RETURN jsonb_build_object(
        'is_valid', jsonb_array_length(v_warnings) = 0,
        'warnings', v_warnings,
        'calculated_margin', v_calculated_margin,
        'max_item_margin', v_max_item_margin
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add margin fields to bank_quotations table if they don't exist
DO $$
BEGIN
    -- Check and add margin_applied column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bank_quotations' AND column_name = 'margin_applied'
    ) THEN
        ALTER TABLE bank_quotations ADD COLUMN margin_applied BOOLEAN DEFAULT false;
    END IF;
    
    -- Check and add margin_percentage column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bank_quotations' AND column_name = 'margin_percentage'
    ) THEN
        ALTER TABLE bank_quotations ADD COLUMN margin_percentage DECIMAL(5,2);
    END IF;
    
    -- Check and add margin_amount column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bank_quotations' AND column_name = 'margin_amount'
    ) THEN
        ALTER TABLE bank_quotations ADD COLUMN margin_amount DECIMAL(12,2);
    END IF;
END $$;

-- Create view for easy access to bank quotations with margin information
CREATE OR REPLACE VIEW bank_quotations_with_margin AS
SELECT 
    bq.*,
    bqm.margin_percentage as applied_margin_percentage,
    bqm.margin_amount as applied_margin_amount,
    bqm.distribution_strategy,
    bqm.original_total as original_amount,
    bqm.adjusted_total as final_amount,
    bqm.pricing_justifications,
    bqm.enhanced_services,
    bqm.is_validated as margin_validated,
    bqm.validation_warnings
FROM bank_quotations bq
LEFT JOIN bank_quotation_margins bqm ON bq.id = bqm.bank_quotation_id;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON bank_quotation_margins TO authenticated;
GRANT SELECT, INSERT, UPDATE ON bank_quotation_item_margins TO authenticated;
GRANT SELECT ON bank_quotations_with_margin TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE bank_quotation_margins IS 'Stores margin money configuration and distribution for bank quotations';
COMMENT ON TABLE bank_quotation_item_margins IS 'Stores individual product margin adjustments for seamless integration';
COMMENT ON COLUMN bank_quotation_margins.distribution_strategy IS 'Strategy for distributing margin across products and installation costs';
COMMENT ON COLUMN bank_quotation_margins.pricing_justifications IS 'Business justifications for the adjusted pricing';
COMMENT ON COLUMN bank_quotation_margins.enhanced_services IS 'List of enhanced services to justify higher pricing';

-- Sample data for testing (optional)
-- This would be inserted via the application, not directly in migration