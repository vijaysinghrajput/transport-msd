export interface ProductCategory {
  id: string
  name: string
  description?: string
  parent_category_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Brand {
  id: string
  name: string
  logo_url?: string
  website?: string
  contact_info?: Json
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  model: string
  brand_id: string
  category_id: string
  description?: string
  specifications: Json // Technical specs like wattage, efficiency, etc.
  images: string[] // Array of image URLs
  base_price: number
  cost_price: number
  hsn_code?: string
  warranty_years?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Inventory {
  id: string
  product_id: string
  branch_id?: string // null means main warehouse
  quantity: number
  reserved_quantity: number // For pending orders
  min_stock_level: number
  max_stock_level: number
  last_updated: string
}

export enum SolarSystemType {
  ON_GRID = 'on_grid',
  OFF_GRID = 'off_grid',
  HYBRID = 'hybrid'
}

export interface SolarSystemPackage {
  id: string
  name: string
  type: SolarSystemType
  capacity_kw: number
  brand_id: string
  components: SolarSystemComponent[]
  base_price: number
  installation_cost: number
  total_price: number
  description?: string
  features: string[]
  warranty_years: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SolarSystemComponent {
  product_id: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface ProductPricing {
  id: string
  product_id: string
  branch_id?: string // null means global pricing
  price_type: 'retail' | 'wholesale' | 'distributor'
  price: number
  min_quantity?: number
  max_quantity?: number
  valid_from: string
  valid_to?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]
