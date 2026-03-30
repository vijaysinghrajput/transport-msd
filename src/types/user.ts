import { UserRole } from '@/config/roles'
import { Branch } from './branch'

export interface User {
  id: string
  email: string
  role: UserRole
  full_name: string
  phone?: string
  avatar_url?: string
  branch_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AuthUser extends User {
  branch?: Branch
}