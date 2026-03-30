import { UserRole } from './roles'
import { 
  Truck,
  Car,
  Users,
  BarChart3,
  Home,
  Receipt,
  MapPin,
  Fuel,
  Shield,
  Package,
  Route
} from 'lucide-react'

export interface MenuItem {
  title: string
  href: string
  icon: any
  roles: UserRole[]
  description?: string
  group?: string
  children?: MenuItem[]
}

const ALL_ROLES: UserRole[] = Object.values(UserRole)

export const menuConfig: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard/transportation',
    icon: Home,
    roles: ALL_ROLES,
    group: 'Transportation',
    description: 'Overview of fleet, shipments, and transportation metrics'
  },
  {
    title: 'Vehicles',
    href: '/dashboard/transportation/vehicles',
    icon: Car,
    roles: ALL_ROLES,
    group: 'Fleet Management',
    description: 'Manage vehicles, registration, insurance, and fitness details'
  },
  {
    title: 'Drivers',
    href: '/dashboard/transportation/drivers',
    icon: Users,
    roles: ALL_ROLES,
    group: 'Fleet Management',
    description: 'Manage drivers, licenses, and contact details'
  },
  {
    title: 'Shipments',
    href: '/dashboard/transportation/shipments',
    icon: Package,
    roles: ALL_ROLES,
    group: 'Logistics',
    description: 'Track and manage all shipments and deliveries'
  },
  {
    title: 'Delivery Points',
    href: '/dashboard/transportation/delivery-points',
    icon: MapPin,
    roles: ALL_ROLES,
    group: 'Logistics',
    description: 'Manage delivery locations and track delivery status'
  },
  {
    title: 'Trip Materials',
    href: '/dashboard/transportation/trip-materials',
    icon: Route,
    roles: ALL_ROLES,
    group: 'Logistics',
    description: 'Track materials transported in each trip'
  },
  {
    title: 'Expenses',
    href: '/dashboard/transportation/expenses',
    icon: Receipt,
    roles: ALL_ROLES,
    group: 'Finance',
    description: 'Fuel, toll, maintenance, and other transportation expenses'
  },
  {
    title: 'Analytics',
    href: '/dashboard/transportation/analytics',
    icon: BarChart3,
    roles: ALL_ROLES,
    group: 'Analytics',
    description: 'AI-powered shipment analytics, cost predictions, and route insights'
  },
]

const mapDatabaseRoleToUserRole = (dbRole: string): UserRole[] => {
  switch (dbRole) {
    case UserRole.DIRECTOR:
    case 'director':
    case 'super_admin':
    case 'admin':
      return [UserRole.DIRECTOR]
    case UserRole.SALES_HEAD:
    case 'sales_head':
      return [UserRole.SALES_HEAD]
    case UserRole.OPS_HEAD:
    case 'ops_head':
    case 'business_operations_head':
      return [UserRole.OPS_HEAD]
    case UserRole.HR_HEAD:
    case 'hr_head':
      return [UserRole.HR_HEAD]
    case UserRole.STATE_MANAGER:
    case 'state_manager':
      return [UserRole.STATE_MANAGER]
    case UserRole.REGIONAL_MANAGER:
    case 'regional_manager':
      return [UserRole.REGIONAL_MANAGER]
    case UserRole.AREA_MANAGER:
    case 'area_manager':
      return [UserRole.AREA_MANAGER]
    case UserRole.BRANCH_MANAGER:
    case 'branch_manager':
    case 'branch_admin':
      return [UserRole.BRANCH_MANAGER]
    case UserRole.ASSISTANT_BRANCH_MANAGER:
    case 'assistant_branch_manager':
      return [UserRole.ASSISTANT_BRANCH_MANAGER]
    case UserRole.SALES_STAFF:
    case 'sales_staff':
    case 'salesperson':
    case 'agent':
      return [UserRole.SALES_STAFF]
    case UserRole.SUBSIDY_STAFF:
    case 'subsidy_staff':
    case 'subsidy_team':
      return [UserRole.SUBSIDY_STAFF]
    case UserRole.INSTALLATION_TEAM:
    case 'installation_team':
      return [UserRole.INSTALLATION_TEAM]
    case UserRole.ADMIN_STAFF:
    case 'admin_staff':
    case 'staff':
      return [UserRole.ADMIN_STAFF]
    default:
      return [UserRole.ADMIN_STAFF]
  }
}

export const getMenuForRole = (userRole: string): MenuItem[] => {
  const mappedRoles = mapDatabaseRoleToUserRole(userRole)
  return menuConfig.filter(item => 
    item.roles.some(role => mappedRoles.includes(role))
  )
}
