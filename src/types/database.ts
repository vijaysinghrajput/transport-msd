export interface Database {
  public: {
    Tables: {
      branches: {
        Row: {
          id: string
          name: string
          address: string
          city: string
          state: string
          pincode: string
          phone: string
          email: string
          manager_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          city: string
          state: string
          pincode: string
          phone: string
          email: string
          manager_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          city?: string
          state?: string
          pincode?: string
          phone?: string
          email?: string
          manager_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string
          role: string
          branch_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          phone: string
          role: string
          branch_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string
          role?: string
          branch_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      vendors: {
        Row: {
          id: string
          vendor_code: string
          company_name: string
          contact_person: string | null
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          pincode: string | null
          gst_number: string | null
          pan_number: string | null
          bank_account_number: string | null
          bank_name: string | null
          ifsc_code: string | null
          vendor_type: string
          registration_number: string | null
          registration_date: string | null
          validity_period_months: number
          is_active: boolean
          rating: number
          notes: string | null
          created_at: string
          updated_at: string
          state_id: string | null
          district_id: string | null
          city_id: string | null
          area_id: string | null
        }
        Insert: {
          id?: string
          vendor_code: string
          company_name: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          pincode?: string | null
          gst_number?: string | null
          pan_number?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          ifsc_code?: string | null
          vendor_type?: string
          registration_number?: string | null
          registration_date?: string | null
          validity_period_months?: number
          is_active?: boolean
          rating?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
          state_id?: string | null
          district_id?: string | null
          city_id?: string | null
          area_id?: string | null
        }
        Update: {
          id?: string
          vendor_code?: string
          company_name?: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          pincode?: string | null
          gst_number?: string | null
          pan_number?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          ifsc_code?: string | null
          vendor_type?: string
          registration_number?: string | null
          registration_date?: string | null
          validity_period_months?: number
          is_active?: boolean
          rating?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
          state_id?: string | null
          district_id?: string | null
          city_id?: string | null
          area_id?: string | null
        }
      }
      distributors: {
        Row: {
          id: string
          distributor_code: string
          company_name: string
          contact_person: string | null
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          pincode: string | null
          gst_number: string | null
          pan_number: string | null
          bank_account_number: string | null
          bank_name: string | null
          ifsc_code: string | null
          distributor_type: string
          business_category: string | null
          credit_limit: number
          payment_terms: string | null
          minimum_order_amount: number
          delivery_time_days: number
          is_active: boolean
          rating: number
          notes: string | null
          created_at: string
          updated_at: string
          state_id: string | null
          district_id: string | null
          city_id: string | null
          area_id: string | null
        }
        Insert: {
          id?: string
          distributor_code: string
          company_name: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          pincode?: string | null
          gst_number?: string | null
          pan_number?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          ifsc_code?: string | null
          distributor_type?: string
          business_category?: string | null
          credit_limit?: number
          payment_terms?: string | null
          minimum_order_amount?: number
          delivery_time_days?: number
          is_active?: boolean
          rating?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
          state_id?: string | null
          district_id?: string | null
          city_id?: string | null
          area_id?: string | null
        }
        Update: {
          id?: string
          distributor_code?: string
          company_name?: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          pincode?: string | null
          gst_number?: string | null
          pan_number?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          ifsc_code?: string | null
          distributor_type?: string
          business_category?: string | null
          credit_limit?: number
          payment_terms?: string | null
          minimum_order_amount?: number
          delivery_time_days?: number
          is_active?: boolean
          rating?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
          state_id?: string | null
          district_id?: string | null
          city_id?: string | null
          area_id?: string | null
        }
      }
      lead_status_history: {
        Row: {
          id: string
          lead_id: string
          old_status: string | null
          new_status: string
          changed_by: string | null
          changed_by_name: string | null
          changed_at: string
          notes: string | null
          metadata: Record<string, any>
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          old_status?: string | null
          new_status: string
          changed_by?: string | null
          changed_by_name?: string | null
          changed_at?: string
          notes?: string | null
          metadata?: Record<string, any>
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          old_status?: string | null
          new_status?: string
          changed_by?: string | null
          changed_by_name?: string | null
          changed_at?: string
          notes?: string | null
          metadata?: Record<string, any>
          created_at?: string
        }
      }
      lead_payments: {
        Row: {
          id: string
          lead_id: string
          payment_type: 'cash' | 'finance'
          finance_application_id: string | null
          bank_name: string | null
          ifsc_code: string | null
          sanctioned_amount: number | null
          disbursed_amount: number | null
          disbursement_date: string | null
          pending_amount: number | null
          account_number: string | null
          vendor_name: string | null
          approval_status: 'pending' | 'approved' | 'rejected' | null
          total_amount: number | null
          paid_amount: number | null
          pending_cash_amount: number | null
          payment_mode: 'cash' | 'cheque' | 'online' | 'upi' | null
          payment_date: string | null
          payment_reference: string | null
          notes: string | null
          created_by: string | null
          created_by_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          payment_type: 'cash' | 'finance'
          finance_application_id?: string | null
          bank_name?: string | null
          ifsc_code?: string | null
          sanctioned_amount?: number | null
          disbursed_amount?: number | null
          disbursement_date?: string | null
          pending_amount?: number | null
          account_number?: string | null
          vendor_name?: string | null
          approval_status?: 'pending' | 'approved' | 'rejected' | null
          total_amount?: number | null
          paid_amount?: number | null
          pending_cash_amount?: number | null
          payment_mode?: 'cash' | 'cheque' | 'online' | 'upi' | null
          payment_date?: string | null
          payment_reference?: string | null
          notes?: string | null
          created_by?: string | null
          created_by_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          payment_type?: 'cash' | 'finance'
          finance_application_id?: string | null
          bank_name?: string | null
          ifsc_code?: string | null
          sanctioned_amount?: number | null
          disbursed_amount?: number | null
          disbursement_date?: string | null
          pending_amount?: number | null
          account_number?: string | null
          vendor_name?: string | null
          approval_status?: 'pending' | 'approved' | 'rejected' | null
          total_amount?: number | null
          paid_amount?: number | null
          pending_cash_amount?: number | null
          payment_mode?: 'cash' | 'cheque' | 'online' | 'upi' | null
          payment_date?: string | null
          payment_reference?: string | null
          notes?: string | null
          created_by?: string | null
          created_by_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      lead_pm_suryaghar: {
        Row: {
          id: string
          lead_id: string
          portal_login_id: string | null
          portal_password_hint: string | null
          registration_date: string | null
          application_number: string | null
          consumer_number: string | null
          discom_name: string | null
          sanction_load_kw: number | null
          feasibility_status: 'pending' | 'approved' | 'rejected' | null
          feasibility_approval_date: string | null
          rejection_reason: string | null
          portal_status: string | null
          notes: string | null
          created_by: string | null
          created_by_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          portal_login_id?: string | null
          portal_password_hint?: string | null
          registration_date?: string | null
          application_number?: string | null
          consumer_number?: string | null
          discom_name?: string | null
          sanction_load_kw?: number | null
          feasibility_status?: 'pending' | 'approved' | 'rejected' | null
          feasibility_approval_date?: string | null
          rejection_reason?: string | null
          portal_status?: string | null
          notes?: string | null
          created_by?: string | null
          created_by_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          portal_login_id?: string | null
          portal_password_hint?: string | null
          registration_date?: string | null
          application_number?: string | null
          consumer_number?: string | null
          discom_name?: string | null
          sanction_load_kw?: number | null
          feasibility_status?: 'pending' | 'approved' | 'rejected' | null
          feasibility_approval_date?: string | null
          rejection_reason?: string | null
          portal_status?: string | null
          notes?: string | null
          created_by?: string | null
          created_by_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      lead_net_meter: {
        Row: {
          id: string
          lead_id: string
          application_number: string | null
          application_date: string | null
          approval_date: string | null
          installation_date: string | null
          meter_number: string | null
          meter_type: string | null
          discom_name: string | null
          agreement_signed: boolean
          agreement_date: string | null
          commissioning_date: string | null
          first_generation_date: string | null
          monthly_generation_kwh: number | null
          notes: string | null
          created_by: string | null
          created_by_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          application_number?: string | null
          application_date?: string | null
          approval_date?: string | null
          installation_date?: string | null
          meter_number?: string | null
          meter_type?: string | null
          discom_name?: string | null
          agreement_signed?: boolean
          agreement_date?: string | null
          commissioning_date?: string | null
          first_generation_date?: string | null
          monthly_generation_kwh?: number | null
          notes?: string | null
          created_by?: string | null
          created_by_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          application_number?: string | null
          application_date?: string | null
          approval_date?: string | null
          installation_date?: string | null
          meter_number?: string | null
          meter_type?: string | null
          discom_name?: string | null
          agreement_signed?: boolean
          agreement_date?: string | null
          commissioning_date?: string | null
          first_generation_date?: string | null
          monthly_generation_kwh?: number | null
          notes?: string | null
          created_by?: string | null
          created_by_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
