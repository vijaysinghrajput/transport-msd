// Bank Quotation Margin Money Types - For Bank Quotations Only
export interface BankQuotationMargin {
  id: string
  bank_quotation_id: string
  margin_percentage: number // 5%, 10%, 15%, 20%, 25%, 30%
  original_total: number
  margin_amount: number
  adjusted_total: number
  distribution_strategy: MarginDistributionStrategy
  created_at: string
}

// Margin distribution for seamless integration
export type MarginDistributionStrategy = 
  | 'products_installation' // 70% to products, 30% to installation
  | 'installation_heavy'    // 20% to products, 80% to installation  
  | 'products_heavy'        // 80% to products, 20% to installation
  | 'equal_split'          // 50% to products, 50% to installation

export interface BankQuotationMarginDistribution {
  strategy: MarginDistributionStrategy
  products_percentage: number
  installation_percentage: number
  display_name: string
  description: string
}

export const BANK_MARGIN_DISTRIBUTION_STRATEGIES: BankQuotationMarginDistribution[] = [
  {
    strategy: 'products_installation',
    products_percentage: 70,
    installation_percentage: 30,
    display_name: 'Standard Distribution',
    description: 'Distribute margin primarily in product costs (70%) with some in installation (30%)'
  },
  {
    strategy: 'installation_heavy',
    products_percentage: 20,
    installation_percentage: 80,
    display_name: 'Installation Focused',
    description: 'Add most margin to installation costs (80%) as premium service charges'
  },
  {
    strategy: 'products_heavy',
    products_percentage: 80,
    installation_percentage: 20,
    display_name: 'Product Focused',
    description: 'Add most margin to product costs (80%) as premium equipment pricing'
  },
  {
    strategy: 'equal_split',
    products_percentage: 50,
    installation_percentage: 50,
    display_name: 'Balanced Distribution',
    description: 'Split margin equally between products and installation (50-50)'
  }
]

// Available margin percentages for bank quotations
export const BANK_MARGIN_PERCENTAGES = [
  { value: 5, label: '5% Margin', description: 'Low margin for competitive pricing' },
  { value: 10, label: '10% Margin', description: 'Standard margin for most projects' },
  { value: 15, label: '15% Margin', description: 'Higher margin for premium projects' },
  { value: 20, label: '20% Margin', description: 'High margin for complex installations' },
  { value: 25, label: '25% Margin', description: 'Premium margin for specialized projects' },
  { value: 30, label: '30% Margin', description: 'Maximum margin for exclusive projects' }
]

// Calculation result for bank quotation margin
export interface BankMarginCalculation {
  original_amount: number
  margin_percentage: number
  margin_amount: number
  adjusted_amount: number
  
  // Seamless distribution breakdown
  distribution: {
    strategy: MarginDistributionStrategy
    product_cost_addition: number
    installation_cost_addition: number
    adjusted_product_cost: number
    adjusted_installation_cost: number
  }
  
  // Items with margin distributed
  adjusted_items: BankQuotationItemWithMargin[]
}

export interface BankQuotationItemWithMargin {
  product_id: string
  product_name: string
  original_quantity: number
  original_unit_price: number
  original_total: number
  
  // Margin adjusted pricing (seamlessly integrated)
  adjusted_unit_price: number
  adjusted_total: number
  margin_added: number
  
  // Display data (what customer sees)
  display_unit_price: number
  display_total: number
}

// Service interface for bank margin calculations
export interface BankMarginService {
  calculateMargin: (
    items: any[],
    installationCost: number,
    marginPercentage: number,
    distributionStrategy: MarginDistributionStrategy
  ) => BankMarginCalculation
  
  distributeMarginSeamlessly: (
    items: any[],
    installationCost: number,
    marginAmount: number,
    strategy: MarginDistributionStrategy
  ) => {
    adjustedItems: BankQuotationItemWithMargin[]
    adjustedInstallationCost: number
  }
  
  generateSeamlessQuotation: (
    originalData: any,
    marginPercentage: number,
    distributionStrategy: MarginDistributionStrategy
  ) => any
}

// Integration with bank quotation system
export interface BankQuotationWithMargin {
  // Regular bank quotation fields
  id: string
  quotation_number: string
  customer_name: string
  customer_email?: string
  customer_phone: string
  system_capacity_kw: number
  application_type: string
  system_type: string
  
  // Original pricing (before margin)
  original_subtotal: number
  original_installation_cost: number
  original_total: number
  
  // Margin configuration
  margin_applied: boolean
  margin_percentage?: number
  margin_amount?: number
  distribution_strategy?: MarginDistributionStrategy
  
  // Final pricing (with margin seamlessly distributed)
  final_subtotal: number
  final_installation_cost: number
  final_total: number
  
  // Items with margin distributed
  items_with_margin: BankQuotationItemWithMargin[]
  
  created_at: string
  updated_at?: string
}

// Helper functions for seamless margin integration
export const MarginHelpers = {
  // Calculate how to distribute margin across products
  calculateProductMarginDistribution: (
    items: any[],
    totalMarginForProducts: number
  ): { productId: string; marginToAdd: number }[] => {
    const totalOriginalValue = items.reduce((sum, item) => sum + item.total_price, 0)
    
    return items.map(item => ({
      productId: item.product_id,
      marginToAdd: (item.total_price / totalOriginalValue) * totalMarginForProducts
    }))
  },
  
  // Round prices to look natural (avoid suspicious precise numbers)
  makeNaturalPrice: (price: number): number => {
    // Round to nearest 50 or 100 to look natural
    if (price < 1000) {
      return Math.round(price / 50) * 50
    } else if (price < 10000) {
      return Math.round(price / 100) * 100
    } else {
      return Math.round(price / 500) * 500
    }
  },
  
  // Generate business justifications for adjusted prices
  generatePriceJustifications: (marginPercentage: number): string[] => {
    const justifications = [
      'Premium quality components with extended warranty',
      'Enhanced installation package with specialized equipment',
      'Comprehensive project management and support services',
      'Advanced monitoring and maintenance system included',
      'Expedited delivery and installation timeline',
      'Premium technical support and consultation services'
    ]
    
    // Return appropriate justifications based on margin level
    if (marginPercentage <= 10) {
      return justifications.slice(0, 2)
    } else if (marginPercentage <= 20) {
      return justifications.slice(0, 4)
    } else {
      return justifications
    }
  }
}