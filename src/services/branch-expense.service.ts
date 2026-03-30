import { supabase } from '../lib/supabaseClient'
import type {
  BranchExpense,
  CreateBranchExpense,
  UpdateBranchExpense,
  ExpenseCategory,
  ExpenseSummary,
  ExpenseFilters,
  ExpenseStats,
} from '../types/expense.types'

/**
 * Branch Expense Service
 * Handles all branch expense management operations
 */
class BranchExpenseService {
  /**
   * Get all expense categories
   */
  async getExpenseCategories(): Promise<ExpenseCategory[]> {
    const { data, error } = await supabase
      .from('branch_expense_categories')
      .select('*')
      .order('category_name')

    if (error) throw error
    return data || []
  }

  /**
   * Get expenses for a branch
   */
  async getBranchExpenses(
    branchId: string,
    filters?: ExpenseFilters
  ): Promise<BranchExpense[]> {
    let query = supabase
      .from('branch_expenses')
      .select('*')
      .eq('branch_id', branchId)
      .order('expense_date', { ascending: false })

    // Apply filters
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.expense_type) {
      query = query.eq('expense_type', filters.expense_type)
    }
    if (filters?.date_from) {
      query = query.gte('expense_date', filters.date_from)
    }
    if (filters?.date_to) {
      query = query.lte('expense_date', filters.date_to)
    }
    if (filters?.min_amount) {
      query = query.gte('amount', filters.min_amount)
    }
    if (filters?.max_amount) {
      query = query.lte('amount', filters.max_amount)
    }
    if (filters?.vendor_id) {
      query = query.eq('vendor_id', filters.vendor_id)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  /**
   * Get all expenses (for admin/finance roles)
   */
  async getAllExpenses(filters?: ExpenseFilters): Promise<BranchExpense[]> {
    let query = supabase
      .from('branch_expenses')
      .select('*')
      .order('expense_date', { ascending: false })

    // Apply filters
    if (filters?.branch_id) {
      query = query.eq('branch_id', filters.branch_id)
    }
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.expense_type) {
      query = query.eq('expense_type', filters.expense_type)
    }
    if (filters?.date_from) {
      query = query.gte('expense_date', filters.date_from)
    }
    if (filters?.date_to) {
      query = query.lte('expense_date', filters.date_to)
    }
    if (filters?.min_amount) {
      query = query.gte('amount', filters.min_amount)
    }
    if (filters?.max_amount) {
      query = query.lte('amount', filters.max_amount)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  /**
   * Get expense by ID
   */
  async getExpenseById(expenseId: string): Promise<BranchExpense | null> {
    const { data, error } = await supabase
      .from('branch_expenses')
      .select('*')
      .eq('id', expenseId)
      .single()

    if (error) throw error
    return data
  }

  /**
   * Create a new expense
   */
  async createExpense(expense: CreateBranchExpense): Promise<BranchExpense> {
    const { data: { user } } = await supabase.auth.getUser()

    const expenseData = {
      ...expense,
      created_by: user?.id,
      created_by_name: user?.user_metadata?.full_name || user?.email,
      status: expense.status || 'draft',
    }

    const { data, error } = await supabase
      .from('branch_expenses')
      .insert(expenseData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Update an expense
   */
  async updateExpense(
    expenseId: string,
    updates: UpdateBranchExpense
  ): Promise<BranchExpense> {
    const { data, error } = await supabase
      .from('branch_expenses')
      .update(updates)
      .eq('id', expenseId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Submit expense for approval
   */
  async submitExpense(expenseId: string): Promise<BranchExpense> {
    return this.updateExpense(expenseId, {
      status: 'pending',
      submitted_at: new Date().toISOString(),
    })
  }

  /**
   * Approve an expense
   */
  async approveExpense(expenseId: string): Promise<BranchExpense> {
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('branch_expenses')
      .update({
        status: 'approved',
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
        payment_status: 'Pending'
      })
      .eq('id', expenseId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Reject an expense
   */
  async rejectExpense(expenseId: string, reason: string): Promise<BranchExpense> {
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('branch_expenses')
      .update({
        status: 'rejected',
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
        rejection_reason: reason,
        payment_status: 'Cancelled'
      })
      .eq('id', expenseId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Mark expense as paid
   */
  async markAsPaid(expenseId: string, paymentDetails?: {
    payment_mode?: string
    payment_reference?: string
    payment_date?: string
  }): Promise<BranchExpense> {
    const updates: any = {
      status: 'paid',
      payment_status: 'Paid',
      payment_date: paymentDetails?.payment_date || new Date().toISOString(),
      ...paymentDetails
    }

    const { data, error } = await supabase
      .from('branch_expenses')
      .update(updates)
      .eq('id', expenseId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Delete an expense
   */
  async deleteExpense(expenseId: string): Promise<void> {
    const { error } = await supabase
      .from('branch_expenses')
      .delete()
      .eq('id', expenseId)

    if (error) throw error
  }

  /**
   * Get expense summary for a branch
   */
  async getBranchExpenseSummary(
    branchId: string,
    monthYear?: string
  ): Promise<ExpenseSummary[]> {
    let query = supabase
      .from('branch_expense_summary')
      .select('*')
      .eq('branch_id', branchId)

    if (monthYear) {
      query = query.eq('expense_month', monthYear)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  /**
   * Get expense statistics for a branch
   */
  async getBranchExpenseStats(branchId: string): Promise<ExpenseStats> {
    const { data, error } = await supabase
      .from('branch_expenses')
      .select('status, amount')
      .eq('branch_id', branchId)

    if (error) throw error

    const stats: ExpenseStats = {
      total: data?.length || 0,
      draft: data?.filter((e) => e.status === 'draft').length || 0,
      pending: data?.filter((e) => e.status === 'pending').length || 0,
      approved: data?.filter((e) => e.status === 'approved').length || 0,
      rejected: data?.filter((e) => e.status === 'rejected').length || 0,
      paid: data?.filter((e) => e.status === 'paid').length || 0,
      total_amount: data?.reduce((sum, e) => sum + Number(e.amount), 0) || 0,
      approved_amount:
        data
          ?.filter((e) => e.status === 'approved')
          .reduce((sum, e) => sum + Number(e.amount), 0) || 0,
      pending_amount:
        data
          ?.filter((e) => e.status === 'pending')
          .reduce((sum, e) => sum + Number(e.amount), 0) || 0,
    }

    return stats
  }

  /**
   * Get category spending for current month using database function
   */
  async getCategorySpending(branchId: string, expenseType?: string) {
    const { data, error } = await supabase.rpc('get_branch_category_spending', {
      p_branch_id: branchId,
      p_expense_type: expenseType || null,
    })

    if (error) throw error
    return data || []
  }

  /**
   * Get monthly limit status using database function
   */
  async getMonthlyLimitStatus(branchId: string) {
    const { data, error } = await supabase.rpc('get_branch_monthly_limit_status', {
      p_branch_id: branchId,
    })

    if (error) throw error
    return data?.[0] || null
  }
}

export const branchExpenseService = new BranchExpenseService()
