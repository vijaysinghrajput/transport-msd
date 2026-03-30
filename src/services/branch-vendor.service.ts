import { supabase } from '../lib/supabaseClient'
import type {
  BranchVendor,
  CreateBranchVendorInput,
  UpdateBranchVendorInput,
  BranchVendorFilters,
} from '../types/vendor.types'

class BranchVendorService {
  /**
   * Get all vendors for a branch
   */
  async getBranchVendors(
    branchId: string,
    filters?: BranchVendorFilters
  ): Promise<BranchVendor[]> {
    let query = supabase
      .from('branch_vendors')
      .select('*')
      .eq('branch_id', branchId)
      .order('created_at', { ascending: false })

    if (filters?.vendor_type) {
      query = query.eq('vendor_type', filters.vendor_type)
    }

    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active)
    }

    if (filters?.search) {
      query = query.or(
        `vendor_name.ilike.%${filters.search}%,vendor_code.ilike.%${filters.search}%,contact_person.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`
      )
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  /**
   * Get a single vendor by ID
   */
  async getVendorById(vendorId: string): Promise<BranchVendor | null> {
    const { data, error } = await supabase
      .from('branch_vendors')
      .select('*')
      .eq('id', vendorId)
      .single()

    if (error) throw error
    return data
  }

  /**
   * Create a new vendor
   */
  async createVendor(input: CreateBranchVendorInput): Promise<BranchVendor> {
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('branch_vendors')
      .insert({
        ...input,
        created_by: user?.id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Update a vendor
   */
  async updateVendor(
    vendorId: string,
    input: UpdateBranchVendorInput
  ): Promise<BranchVendor> {
    const { data, error } = await supabase
      .from('branch_vendors')
      .update(input)
      .eq('id', vendorId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Delete a vendor
   */
  async deleteVendor(vendorId: string): Promise<void> {
    const { error } = await supabase
      .from('branch_vendors')
      .delete()
      .eq('id', vendorId)

    if (error) throw error
  }

  /**
   * Toggle vendor active status
   */
  async toggleVendorStatus(vendorId: string, isActive: boolean): Promise<BranchVendor> {
    return this.updateVendor(vendorId, { is_active: isActive })
  }

  /**
   * Get active vendors only
   */
  async getActiveVendors(branchId: string): Promise<BranchVendor[]> {
    return this.getBranchVendors(branchId, { is_active: true })
  }
}

export const branchVendorService = new BranchVendorService()
