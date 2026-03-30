import { useState, useEffect } from 'react'
import { App } from 'antd'
import dayjs from 'dayjs'
import { supabase } from '@/lib/supabaseClient'
import { Quotation, Lead, Vendor, Brand, SolarSystem, ProductDetail, QuotationFormData } from '@/types/quotations'

export const useQuotations = () => {
  const { message } = App.useApp()
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [solarSystems, setSolarSystems] = useState<SolarSystem[]>([])
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    fetchData()
    getCurrentUser()
  }, [])

  const getCurrentUser = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    setCurrentUser(user)
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchQuotations(),
        fetchLeads(),
        fetchVendors(),
        fetchBrands(),
        fetchSolarSystems()
      ])
    } catch (error) {
      console.error('Error fetching data:', error)
      message.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const fetchQuotations = async () => {
    const { data, error } = await supabase
      .from('quotations')
      .select(`
        *,
        leads(
          customer_name, 
          email, 
          mobile, 
          address,
          city,
          state,
          pincode
        ),
        vendors(
          company_name,
          contact_person,
          email,
          phone,
          address,
          city,
          state,
          pincode,
          logo_url,
          signature_url,
          stamp_url,
          gst_number,
          pan_number
        ),
        product_brands(name),
        solar_systems(
          name, 
          total_price, 
          components, 
          installation_cost, 
          subtotal_price, 
          additional_costs,
          capacity_kw,
          system_type,
          application_type,
          warranty_period,
          description
        ),
        users(name, email, phone)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    setQuotations(data || [])
  }

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('id, customer_name, email, mobile, address, system_capacity_kw, application_type, system_type, status')
      .eq('status', 'new')
      .order('customer_name')

    if (error) throw error
    setLeads(data || [])
  }

  const fetchVendors = async () => {
    const { data, error } = await supabase
      .from('vendors')
      .select('id, company_name, vendor_code, is_active')
      .eq('is_active', true)
      .order('company_name')

    if (error) throw error
    setVendors(data || [])
  }

  const fetchBrands = async () => {
    const { data, error } = await supabase
      .from('product_brands')
      .select('id, name')
      .order('name')

    if (error) throw error
    setBrands(data || [])
  }

  const fetchSolarSystems = async () => {
    const { data, error } = await supabase
      .from('solar_systems')
      .select('*')
      .order('name')

    if (error) throw error
    setSolarSystems(data || [])
  }

  const generateQuotationNumber = async (): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('quotations')
        .select('quotation_number')
        .order('quotation_number', { ascending: false })
        .limit(1)

      if (error) throw error

      if (data && data.length > 0) {
        const lastNumber = data[0].quotation_number
        const match = lastNumber.match(/QUO-(\d+)/)
        if (match) {
          const nextNumber = parseInt(match[1]) + 1
          return `QUO-${nextNumber.toString().padStart(4, '0')}`
        }
      }
      return 'QUO-0001'
    } catch (error) {
      console.error('Error generating quotation number:', error)
      return 'QUO-0001'
    }
  }

  const createQuotation = async (formData: QuotationFormData) => {
    try {
      if (!formData.selectedLead || !formData.selectedSolarSystem) {
        throw new Error('Missing required data')
      }

      const quotationNumber = await generateQuotationNumber()
      const validUntil = dayjs().add(1, 'month').format('YYYY-MM-DD')

      const quotationData = {
        quotation_number: quotationNumber,
        lead_id: formData.selectedLead.id,
        vendor_id: formData.selectedVendor?.id,
        brand_id: formData.selectedBrand,
        application_type: formData.selectedApplicationType,
        system_type: formData.selectedSystemType,
        solar_system_id: formData.selectedSolarSystem.id,
        customer_name: formData.selectedLead.customer_name,
        customer_email: formData.selectedLead.email,
        customer_phone: formData.selectedLead.mobile,
        customer_address: formData.selectedLead.address,
        system_capacity_kw: formData.selectedSolarSystem.capacity_kw,
        total_amount: formData.selectedSolarSystem.total_price,
        installation_cost: formData.selectedSolarSystem.installation_cost,
        raw_material_cost: formData.selectedSolarSystem.subtotal_price,
        net_amount: formData.selectedSolarSystem.total_price,
        valid_until: validUntil,
        status: 'draft' as const,
        notes: '',
        created_by: currentUser?.id
      }

      const { data, error } = await supabase
        .from('quotations')
        .insert([quotationData])
        .select()
        .single()

      if (error) throw error

      message.success('Quotation created successfully')
      await fetchQuotations()
      return data
    } catch (error: any) {
      console.error('Error creating quotation:', error)
      message.error('Failed to create quotation: ' + error.message)
      throw error
    }
  }

  const updateQuotation = async (id: string, formData: QuotationFormData) => {
    try {
      if (!formData.selectedLead || !formData.selectedSolarSystem) {
        throw new Error('Missing required data')
      }

      const quotationData = {
        lead_id: formData.selectedLead.id,
        vendor_id: formData.selectedVendor?.id,
        brand_id: formData.selectedBrand,
        application_type: formData.selectedApplicationType,
        system_type: formData.selectedSystemType,
        solar_system_id: formData.selectedSolarSystem.id,
        customer_name: formData.selectedLead.customer_name,
        customer_email: formData.selectedLead.email,
        customer_phone: formData.selectedLead.mobile,
        customer_address: formData.selectedLead.address,
        system_capacity_kw: formData.selectedSolarSystem.capacity_kw,
        total_amount: formData.selectedSolarSystem.total_price,
        installation_cost: formData.selectedSolarSystem.installation_cost,
        raw_material_cost: formData.selectedSolarSystem.subtotal_price,
        net_amount: formData.selectedSolarSystem.total_price,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('quotations')
        .update(quotationData)
        .eq('id', id)

      if (error) throw error

      message.success('Quotation updated successfully')
      await fetchQuotations()
    } catch (error: any) {
      console.error('Error updating quotation:', error)
      message.error('Failed to update quotation: ' + error.message)
      throw error
    }
  }

  const deleteQuotation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quotations')
        .delete()
        .eq('id', id)

      if (error) throw error
      message.success('Quotation deleted successfully')
      await fetchQuotations()
    } catch (error: any) {
      console.error('Error deleting quotation:', error)
      message.error('Failed to delete quotation: ' + error.message)
    }
  }

  const fetchProductDetails = async (productIds: string[]): Promise<ProductDetail[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          sku,
          price,
          unit,
          warranty_period,
          specifications,
          technical_details,
          images,
          certifications,
          product_brands!inner(id, name, logo_url, website),
          product_categories(name, description)
        `)
        .in('id', productIds)

      if (error) throw error
      
      // Transform the data to match ProductDetail interface
      const transformedData = (data || []).map((item: any) => ({
        ...item,
        product_brands: Array.isArray(item.product_brands) ? item.product_brands[0] : item.product_brands,
        product_categories: Array.isArray(item.product_categories) ? item.product_categories[0] : item.product_categories
      }))
      
      return transformedData as ProductDetail[]
    } catch (error) {
      console.error('Error fetching product details:', error)
      return []
    }
  }

  return {
    // State
    quotations,
    leads,
    vendors,
    brands,
    solarSystems,
    loading,
    currentUser,
    
    // Actions
    fetchData,
    createQuotation,
    updateQuotation,
    deleteQuotation,
    fetchProductDetails,
    generateQuotationNumber
  }
}