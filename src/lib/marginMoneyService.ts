/**
 * Margin Money Service
 * Handles calculation and integration of bank margin money into quotations
 */

import { 
  MarginMoneyConfig, 
  MarginMoneyCalculation, 
  MarginDistributionStrategy,
  DEFAULT_MARGIN_CONFIGS,
  MARGIN_DISTRIBUTION_STRATEGIES,
  QuotationFinanceIntegration
} from '@/types/margin-money'

export class MarginMoneyService {
  
  /**
   * Calculate margin money and distribute it across quotation components
   */
  static calculateMarginMoney(
    baseAmount: number,
    marginPercentage: number,
    systemCost: number = 0,
    installationCost: number = 0,
    rawMaterialCost: number = 0,
    distributionStrategy: MarginDistributionStrategy = 'additional_costs'
  ): MarginMoneyCalculation {
    
    const marginAmount = (baseAmount * marginPercentage) / 100
    const adjustedAmount = baseAmount + marginAmount
    
    let calculation: MarginMoneyCalculation = {
      base_quotation_amount: baseAmount,
      margin_percentage: marginPercentage,
      margin_amount: marginAmount,
      adjusted_quotation_amount: adjustedAmount,
      bank_name: '',
      calculation_breakdown: {
        system_cost: systemCost,
        installation_cost: installationCost,
        raw_material_cost: rawMaterialCost,
        margin_addition: marginAmount,
        total_with_margin: adjustedAmount
      }
    }

    return calculation
  }

  /**
   * Apply margin to quotation using specified distribution strategy
   */
  static applyMarginToQuotation(
    quotationData: any,
    marginPercentage: number,
    bankName: string,
    distributionStrategy: MarginDistributionStrategy = 'additional_costs'
  ): any {
    
    const originalTotal = quotationData.total_amount || 0
    const originalInstallationCost = quotationData.installation_cost || 0
    const originalRawMaterialCost = quotationData.raw_material_cost || 0
    
    const marginAmount = (originalTotal * marginPercentage) / 100
    
    let updatedQuotation = { ...quotationData }

    switch (distributionStrategy) {
      case 'additional_costs':
        // Add margin as separate additional costs line
        updatedQuotation.additional_costs = (updatedQuotation.additional_costs || 0) + marginAmount
        updatedQuotation.additional_costs_breakdown = {
          ...(updatedQuotation.additional_costs_breakdown || {}),
          bank_processing_charges: marginAmount,
          bank_processing_description: `${bankName} loan processing and documentation charges (${marginPercentage}%)`
        }
        break

      case 'installation_cost':
        // Add margin to installation cost
        updatedQuotation.installation_cost = originalInstallationCost + marginAmount
        updatedQuotation.installation_cost_breakdown = {
          base_installation: originalInstallationCost,
          premium_service_charge: marginAmount,
          premium_service_description: `Enhanced installation package for ${bankName} financing`
        }
        break

      case 'proportional':
        // Distribute proportionally
        const systemPortion = (originalRawMaterialCost / originalTotal) * marginAmount
        const installationPortion = (originalInstallationCost / originalTotal) * marginAmount
        
        updatedQuotation.raw_material_cost = originalRawMaterialCost + systemPortion
        updatedQuotation.installation_cost = originalInstallationCost + installationPortion
        break

      case 'mixed':
        // 60% to installation, 40% as additional costs
        const installationAddition = marginAmount * 0.6
        const additionalCostsAddition = marginAmount * 0.4
        
        updatedQuotation.installation_cost = originalInstallationCost + installationAddition
        updatedQuotation.additional_costs = (updatedQuotation.additional_costs || 0) + additionalCostsAddition
        
        updatedQuotation.mixed_margin_breakdown = {
          installation_enhancement: installationAddition,
          processing_charges: additionalCostsAddition,
          bank_name: bankName,
          total_margin: marginAmount
        }
        break
    }

    // Update totals
    updatedQuotation.margin_money_applied = {
      bank_name: bankName,
      margin_percentage: marginPercentage,
      margin_amount: marginAmount,
      distribution_strategy: distributionStrategy,
      original_total: originalTotal
    }

    // Calculate new total
    updatedQuotation.total_amount = originalTotal + marginAmount
    updatedQuotation.net_amount = updatedQuotation.total_amount

    return updatedQuotation
  }

  /**
   * Get applicable banks based on loan amount and system type
   */
  static getApplicableBanks(
    loanAmount: number,
    systemType: 'residential' | 'commercial' | 'industrial'
  ): MarginMoneyConfig[] {
    return DEFAULT_MARGIN_CONFIGS.filter(config => {
      const withinAmountRange = 
        (!config.min_loan_amount || loanAmount >= config.min_loan_amount) &&
        (!config.max_loan_amount || loanAmount <= config.max_loan_amount)
      
      const systemTypeApplicable = 
        !config.applies_to_system_types || 
        config.applies_to_system_types.includes(systemType)
      
      return config.is_active && withinAmountRange && systemTypeApplicable
    }) as MarginMoneyConfig[]
  }

  /**
   * Generate smooth quotation text that doesn't mention "margin money"
   */
  static generateMarginJustificationText(
    marginAmount: number,
    bankName: string,
    distributionStrategy: MarginDistributionStrategy
  ): string {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(marginAmount)

    switch (distributionStrategy) {
      case 'additional_costs':
        return `Processing and documentation charges for ${bankName} loan facilitation: ${formatted}. This includes loan application processing, technical verification, legal documentation, and project coordination fees.`
      
      case 'installation_cost':
        return `Premium installation package: ${formatted}. Enhanced service package including dedicated project manager, expedited timeline, premium quality assurance, and extended support for ${bankName} financed projects.`
      
      case 'proportional':
        return `Enhanced system configuration: ${formatted}. Premium components and installation services optimized for ${bankName} financing requirements and compliance standards.`
      
      case 'mixed':
        return `Comprehensive service package: ${formatted}. Includes enhanced installation services, project coordination, documentation support, and quality assurance for ${bankName} loan facilitation.`
      
      default:
        return `Additional charges: ${formatted}. Professional services and compliance requirements.`
    }
  }

  /**
   * Calculate customer vs bank payment breakdown
   */
  static calculatePaymentBreakdown(
    quotationAmount: number,
    loanPercentage: number, // How much of quotation amount will be financed
    marginPercentage: number,
    marginIncludedInLoan: boolean = true
  ): QuotationFinanceIntegration['customer_payment_breakdown'] & QuotationFinanceIntegration['bank_disbursement_details'] {
    
    const marginAmount = (quotationAmount * marginPercentage) / 100
    const totalQuotationAmount = quotationAmount + marginAmount
    const loanAmount = (quotationAmount * loanPercentage) / 100
    
    let customerContribution: number
    let bankDisbursementAmount: number
    let marginDeduction = 0

    if (marginIncludedInLoan) {
      // Margin is included in the quotation, customer pays down payment only
      customerContribution = totalQuotationAmount - loanAmount
      bankDisbursementAmount = loanAmount
    } else {
      // Customer pays margin separately
      customerContribution = (totalQuotationAmount - loanAmount) + marginAmount
      bankDisbursementAmount = loanAmount
      marginDeduction = marginAmount
    }

    return {
      total_quotation_amount: totalQuotationAmount,
      loan_amount: loanAmount,
      customer_contribution: customerContribution,
      margin_included_in_loan: marginIncludedInLoan,
      disbursement_amount: bankDisbursementAmount,
      margin_deduction: marginDeduction,
      net_amount_to_vendor: bankDisbursementAmount - marginDeduction
    }
  }

  /**
   * Generate quotation line items with margin smoothly integrated
   */
  static generateQuotationLineItems(
    baseQuotation: any,
    marginConfig: { bank_name: string; margin_percentage: number; distribution_strategy: MarginDistributionStrategy }
  ) {
    const lineItems = []
    
    // Base system cost
    lineItems.push({
      description: `Solar Power System (${baseQuotation.system_capacity_kw}kW)`,
      quantity: 1,
      unit_price: baseQuotation.raw_material_cost || baseQuotation.total_amount * 0.7,
      amount: baseQuotation.raw_material_cost || baseQuotation.total_amount * 0.7
    })

    // Installation cost (potentially enhanced)
    const baseInstallationCost = baseQuotation.installation_cost || baseQuotation.total_amount * 0.3
    const marginAmount = (baseQuotation.total_amount * marginConfig.margin_percentage) / 100

    if (marginConfig.distribution_strategy === 'installation_cost') {
      lineItems.push({
        description: 'Premium Installation & Project Management',
        details: `Enhanced installation package including dedicated project coordination, quality assurance, and compliance support for ${marginConfig.bank_name} financing`,
        quantity: 1,
        unit_price: baseInstallationCost + marginAmount,
        amount: baseInstallationCost + marginAmount
      })
    } else {
      lineItems.push({
        description: 'Professional Installation Services',
        quantity: 1,
        unit_price: baseInstallationCost,
        amount: baseInstallationCost
      })
      
      if (marginConfig.distribution_strategy === 'additional_costs') {
        lineItems.push({
          description: 'Loan Facilitation & Documentation Services',
          details: `Processing charges, technical verification, documentation support, and project coordination for ${marginConfig.bank_name} loan facilitation`,
          quantity: 1,
          unit_price: marginAmount,
          amount: marginAmount
        })
      }
    }

    return lineItems
  }

  /**
   * Validate margin money configuration
   */
  static validateMarginConfig(
    quotationAmount: number,
    marginPercentage: number,
    bankName: string,
    systemType: string
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (marginPercentage < 0 || marginPercentage > 50) {
      errors.push('Margin percentage must be between 0% and 50%')
    }

    if (quotationAmount <= 0) {
      errors.push('Quotation amount must be greater than 0')
    }

    const applicableBanks = this.getApplicableBanks(quotationAmount, systemType as any)
    const bankConfig = applicableBanks.find(b => b.bank_name === bankName)

    if (!bankConfig) {
      errors.push(`${bankName} is not applicable for this loan amount or system type`)
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
}

// Export utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount)
}

export const formatPercentage = (percentage: number): string => {
  return `${percentage}%`
}

// Export function for component compatibility
export const calculateMarginMoney = MarginMoneyService.calculateMarginMoney