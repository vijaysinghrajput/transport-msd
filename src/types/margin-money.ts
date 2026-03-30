/**
 * Margin Money System Types
 * Handles bank margin money requirements by integrating into quotation pricing
 */

export interface MarginMoneyConfig {
  id: string
  bank_name: string
  partner_id?: string // Link to finance_partners table
  margin_percentage: number // 10%, 15%, 20% etc.
  min_loan_amount?: number
  max_loan_amount?: number
  applies_to_system_types?: ('residential' | 'commercial' | 'industrial')[]
  is_active: boolean
  description?: string
  created_at: string
  updated_at: string
}

export interface MarginMoneyCalculation {
  base_quotation_amount: number
  margin_percentage: number
  margin_amount: number
  adjusted_quotation_amount: number
  bank_name: string
  calculation_breakdown: {
    system_cost: number
    installation_cost: number
    raw_material_cost: number
    margin_addition: number
    total_with_margin: number
  }
}

export interface QuotationMarginMoney {
  id: string
  quotation_id: string
  bank_name: string
  margin_percentage: number
  original_amount: number
  margin_amount: number
  final_amount: number
  is_included_in_quotation: boolean
  created_at: string
}

// Bank-wise margin money requirements
export const DEFAULT_MARGIN_CONFIGS: Omit<MarginMoneyConfig, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    bank_name: 'State Bank of India',
    margin_percentage: 10,
    min_loan_amount: 50000,
    max_loan_amount: 5000000,
    applies_to_system_types: ['residential', 'commercial'],
    is_active: true,
    description: 'Standard 10% margin for SBI loans'
  },
  {
    bank_name: 'HDFC Bank',
    margin_percentage: 15,
    min_loan_amount: 100000,
    max_loan_amount: 10000000,
    applies_to_system_types: ['residential', 'commercial', 'industrial'],
    is_active: true,
    description: '15% margin for HDFC solar loans'
  },
  {
    bank_name: 'ICICI Bank',
    margin_percentage: 12,
    min_loan_amount: 75000,
    max_loan_amount: 7500000,
    applies_to_system_types: ['residential', 'commercial'],
    is_active: true,
    description: '12% margin for ICICI green loans'
  },
  {
    bank_name: 'Axis Bank',
    margin_percentage: 20,
    min_loan_amount: 100000,
    max_loan_amount: 5000000,
    applies_to_system_types: ['residential'],
    is_active: true,
    description: '20% margin for Axis solar financing'
  },
  {
    bank_name: 'Punjab National Bank',
    margin_percentage: 10,
    min_loan_amount: 50000,
    max_loan_amount: 3000000,
    applies_to_system_types: ['residential', 'commercial'],
    is_active: true,
    description: 'PNB solar scheme with 10% margin'
  }
]

// Helper functions for margin money calculations
export interface MarginMoneyService {
  calculateMarginMoney: (
    baseAmount: number,
    marginPercentage: number,
    distributionStrategy?: 'proportional' | 'additional_costs' | 'mixed'
  ) => MarginMoneyCalculation
  
  getApplicableBanks: (
    loanAmount: number,
    systemType: 'residential' | 'commercial' | 'industrial'
  ) => MarginMoneyConfig[]
  
  generateQuotationWithMargin: (
    quotationData: any,
    selectedBank: string,
    marginPercentage: number
  ) => any
}

// Margin distribution strategies
export type MarginDistributionStrategy = 
  | 'proportional'      // Distribute margin proportionally across all costs
  | 'additional_costs'  // Add margin as separate "Additional Costs" line item
  | 'installation_cost' // Add margin to installation cost only
  | 'mixed'            // Split between installation cost and additional costs

export interface MarginDistributionConfig {
  strategy: MarginDistributionStrategy
  distribution_ratio?: {
    installation_cost_percentage?: number
    additional_costs_percentage?: number
    system_cost_percentage?: number
  }
  display_name: string
  description: string
}

export const MARGIN_DISTRIBUTION_STRATEGIES: MarginDistributionConfig[] = [
  {
    strategy: 'additional_costs',
    display_name: 'Additional Processing Costs',
    description: 'Add margin as separate line item for bank processing and documentation'
  },
  {
    strategy: 'installation_cost',
    display_name: 'Enhanced Installation Package',
    description: 'Include margin in installation cost as premium service charge'
  },
  {
    strategy: 'proportional',
    display_name: 'Proportional Distribution',
    description: 'Distribute margin proportionally across system and installation costs'
  },
  {
    strategy: 'mixed',
    distribution_ratio: {
      installation_cost_percentage: 60,
      additional_costs_percentage: 40
    },
    display_name: 'Mixed Distribution',
    description: '60% to installation, 40% as additional costs'
  }
]

// Finance integration
export interface QuotationFinanceIntegration {
  quotation_id: string
  selected_bank: string
  margin_percentage: number
  loan_amount: number
  customer_payment_breakdown: {
    total_quotation_amount: number
    loan_amount: number
    customer_contribution: number
    margin_included_in_loan: boolean
  }
  bank_disbursement_details: {
    disbursement_amount: number
    margin_deduction: number
    net_amount_to_vendor: number
  }
}

export interface MarginMoneyQuotationAddons {
  // Additional line items that can be used to justify margin
  bank_processing_fee?: number
  documentation_charges?: number
  loan_facilitation_fee?: number
  enhanced_warranty?: number
  premium_installation_package?: number
  project_management_fee?: number
}