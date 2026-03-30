import { 
  BankMarginCalculation, 
  BankQuotationItemWithMargin, 
  MarginDistributionStrategy,
  BANK_MARGIN_DISTRIBUTION_STRATEGIES,
  MarginHelpers
} from '@/types/bank-quotation-margin'

export class BankMarginCalculator {
  /**
   * Calculate margin money and distribute seamlessly across products and installation
   */
  static calculateMargin(
    items: any[],
    installationCost: number,
    marginPercentage: number,
    distributionStrategy: MarginDistributionStrategy = 'products_installation'
  ): BankMarginCalculation {
    const originalAmount = items.reduce((sum, item) => sum + item.total_price, 0) + installationCost
    const marginAmount = originalAmount * (marginPercentage / 100)
    const adjustedAmount = originalAmount + marginAmount
    
    // Get distribution strategy
    const strategy = BANK_MARGIN_DISTRIBUTION_STRATEGIES.find(s => s.strategy === distributionStrategy)
    if (!strategy) {
      throw new Error(`Invalid distribution strategy: ${distributionStrategy}`)
    }
    
    // Calculate margin distribution
    const marginForProducts = marginAmount * (strategy.products_percentage / 100)
    const marginForInstallation = marginAmount * (strategy.installation_percentage / 100)
    
    // Distribute margin across products
    const adjustedItems = this.distributeMarginAcrossProducts(items, marginForProducts)
    
    // Calculate adjusted installation cost
    const originalProductTotal = items.reduce((sum, item) => sum + item.total_price, 0)
    const adjustedProductTotal = adjustedItems.reduce((sum, item) => sum + item.adjusted_total, 0)
    const adjustedInstallationCost = MarginHelpers.makeNaturalPrice(installationCost + marginForInstallation)
    
    return {
      original_amount: originalAmount,
      margin_percentage: marginPercentage,
      margin_amount: marginAmount,
      adjusted_amount: adjustedAmount,
      distribution: {
        strategy: distributionStrategy,
        product_cost_addition: marginForProducts,
        installation_cost_addition: marginForInstallation,
        adjusted_product_cost: adjustedProductTotal,
        adjusted_installation_cost: adjustedInstallationCost
      },
      adjusted_items: adjustedItems
    }
  }
  
  /**
   * Distribute margin across product items proportionally and naturally
   */
  private static distributeMarginAcrossProducts(
    items: any[],
    totalMarginForProducts: number
  ): BankQuotationItemWithMargin[] {
    const totalOriginalValue = items.reduce((sum, item) => sum + item.total_price, 0)
    
    return items.map(item => {
      // Calculate proportional margin for this item
      const itemMarginAmount = (item.total_price / totalOriginalValue) * totalMarginForProducts
      
      // Calculate new unit price with margin
      const newUnitPrice = item.unit_price + (itemMarginAmount / item.quantity)
      const naturalUnitPrice = MarginHelpers.makeNaturalPrice(newUnitPrice)
      
      // Calculate new total based on natural unit price
      const adjustedTotal = naturalUnitPrice * item.quantity
      const actualMarginAdded = adjustedTotal - item.total_price
      
      return {
        product_id: item.product_id,
        product_name: item.product_name || `Product ${item.product_id}`,
        original_quantity: item.quantity,
        original_unit_price: item.unit_price,
        original_total: item.total_price,
        
        // Margin adjusted pricing
        adjusted_unit_price: naturalUnitPrice,
        adjusted_total: adjustedTotal,
        margin_added: actualMarginAdded,
        
        // Display data (what customer sees - same as adjusted)
        display_unit_price: naturalUnitPrice,
        display_total: adjustedTotal
      }
    })
  }
  
  /**
   * Generate complete bank quotation with seamlessly integrated margin
   */
  static generateBankQuotationWithMargin(
    originalQuotationData: any,
    marginPercentage: number,
    distributionStrategy: MarginDistributionStrategy = 'products_installation'
  ) {
    const { items, installation_cost } = originalQuotationData
    
    // Calculate margin distribution
    const marginCalculation = this.calculateMargin(
      items,
      installation_cost,
      marginPercentage,
      distributionStrategy
    )
    
    // Generate business justifications
    const justifications = MarginHelpers.generatePriceJustifications(marginPercentage)
    
    return {
      ...originalQuotationData,
      
      // Original pricing (hidden from customer)
      original_subtotal: items.reduce((sum: number, item: any) => sum + item.total_price, 0),
      original_installation_cost: installation_cost,
      original_total: marginCalculation.original_amount,
      
      // Margin information (internal use)
      margin_applied: true,
      margin_percentage: marginPercentage,
      margin_amount: marginCalculation.margin_amount,
      distribution_strategy: distributionStrategy,
      
      // Final pricing (with seamlessly distributed margin)
      final_subtotal: marginCalculation.distribution.adjusted_product_cost,
      final_installation_cost: marginCalculation.distribution.adjusted_installation_cost,
      final_total: marginCalculation.adjusted_amount,
      
      // Items with margin integrated
      items: marginCalculation.adjusted_items.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.original_quantity,
        unit_price: item.display_unit_price,
        total_price: item.display_total,
        // Hide margin-related fields from customer view
        _margin_info: {
          original_unit_price: item.original_unit_price,
          margin_added: item.margin_added
        }
      })),
      
      // Business justifications for pricing
      pricing_justifications: justifications,
      
      // Enhanced service descriptions
      enhanced_services: this.generateEnhancedServiceDescriptions(marginPercentage)
    }
  }
  
  /**
   * Generate enhanced service descriptions to justify higher pricing
   */
  private static generateEnhancedServiceDescriptions(marginPercentage: number): string[] {
    const baseServices = [
      'Standard solar system installation',
      'Basic warranty and support'
    ]
    
    const enhancedServices = [
      'Premium component selection and testing',
      'Advanced installation techniques and equipment',
      'Comprehensive project management',
      'Extended warranty coverage',
      'Priority technical support',
      'Performance monitoring system',
      'Maintenance and cleaning services',
      'Expedited installation timeline'
    ]
    
    // Add enhanced services based on margin percentage
    const numEnhancedServices = Math.floor(marginPercentage / 5)
    return [...baseServices, ...enhancedServices.slice(0, numEnhancedServices)]
  }
  
  /**
   * Validate margin distribution to ensure it looks natural
   */
  static validateMarginDistribution(calculation: BankMarginCalculation): {
    isValid: boolean
    warnings: string[]
  } {
    const warnings: string[] = []
    
    // Check if any individual item has too high margin
    calculation.adjusted_items.forEach(item => {
      const marginPercentageForItem = (item.margin_added / item.original_total) * 100
      if (marginPercentageForItem > 40) {
        warnings.push(`Product ${item.product_name} has ${marginPercentageForItem.toFixed(1)}% margin - may look suspicious`)
      }
    })
    
    // Check if installation cost margin is too high
    const installationMarginPercentage = 
      (calculation.distribution.installation_cost_addition / 
       (calculation.distribution.adjusted_installation_cost - calculation.distribution.installation_cost_addition)) * 100
    
    if (installationMarginPercentage > 50) {
      warnings.push(`Installation cost margin of ${installationMarginPercentage.toFixed(1)}% may look suspicious`)
    }
    
    return {
      isValid: warnings.length === 0,
      warnings
    }
  }
}