// User roles enum aligned with CRM organisational structure
export enum UserRole {
  ADMIN = 'admin',
  DIRECTOR = 'director',
  SALES_HEAD = 'sales_head',
  OPS_HEAD = 'ops_head',
  HR_HEAD = 'hr_head',
  STATE_MANAGER = 'state_manager',
  REGIONAL_MANAGER = 'regional_manager',
  AREA_MANAGER = 'area_manager',
  BRANCH_MANAGER = 'branch_manager',
  ASSISTANT_BRANCH_MANAGER = 'assistant_branch_manager',
  SALES_STAFF = 'sales_staff',
  SUBSIDY_STAFF = 'subsidy_staff',
  INSTALLATION_TEAM = 'installation_team',
  ADMIN_STAFF = 'admin_staff'
}

type PermissionKey =
  | 'canManageBranches'
  | 'canManageUsers'
  | 'canManageLeads'
  | 'canViewAllData'
  | 'canManageSubsidy'
  | 'canManageWallet'
  | 'canViewReports'
  | 'canManageSettings'
  | 'canManageProducts'
  | 'canManageBrands'
  | 'canManageCategories'
  | 'canManageSolarSystems'
  | 'canManageCommissions'
  | 'canManageInstallations'
  | 'canManageQuotations'
  | 'canManageRawMaterials'

export type RolePermissionMap = Record<PermissionKey, boolean>

export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrator',
  [UserRole.DIRECTOR]: 'Director',
  [UserRole.SALES_HEAD]: 'Sales Head',
  [UserRole.OPS_HEAD]: 'Business Operations Head',
  [UserRole.HR_HEAD]: 'HR Head',
  [UserRole.STATE_MANAGER]: 'State Manager',
  [UserRole.REGIONAL_MANAGER]: 'Regional Manager',
  [UserRole.AREA_MANAGER]: 'Area Manager',
  [UserRole.BRANCH_MANAGER]: 'Branch Manager',
  [UserRole.ASSISTANT_BRANCH_MANAGER]: 'Assistant Branch Manager',
  [UserRole.SALES_STAFF]: 'Sales Personnel',
  [UserRole.SUBSIDY_STAFF]: 'Subsidy Team',
  [UserRole.INSTALLATION_TEAM]: 'Installation Team',
  [UserRole.ADMIN_STAFF]: 'Office Admin'
}

export const ROLE_BADGE_COLORS: Record<UserRole, string> = {
  [UserRole.ADMIN]: '#ff0000',
  [UserRole.DIRECTOR]: '#722ed1',
  [UserRole.SALES_HEAD]: '#2f54eb',
  [UserRole.OPS_HEAD]: '#7347f2',
  [UserRole.HR_HEAD]: '#7cb305',
  [UserRole.STATE_MANAGER]: '#1890ff',
  [UserRole.REGIONAL_MANAGER]: '#1890ff',
  [UserRole.AREA_MANAGER]: '#1890ff',
  [UserRole.BRANCH_MANAGER]: '#1890ff',
  [UserRole.ASSISTANT_BRANCH_MANAGER]: '#40a9ff',
  [UserRole.SALES_STAFF]: '#fa8c16',
  [UserRole.SUBSIDY_STAFF]: '#eb2f96',
  [UserRole.INSTALLATION_TEAM]: '#13c2c2',
  [UserRole.ADMIN_STAFF]: '#52c41a'
}

// Role permissions
export const rolePermissions: Record<UserRole, RolePermissionMap> = {
  [UserRole.ADMIN]: {
    canManageBranches: true,
    canManageUsers: true,
    canManageLeads: true,
    canViewAllData: true,
    canManageSubsidy: true,
    canManageWallet: true,
    canViewReports: true,
    canManageSettings: true,
    canManageProducts: true,
    canManageBrands: true,
    canManageCategories: true,
    canManageSolarSystems: true,
    canManageCommissions: true,
    canManageInstallations: true,
    canManageQuotations: true,
    canManageRawMaterials: true
  },
  [UserRole.DIRECTOR]: {
    canManageBranches: true,
    canManageUsers: true,
    canManageLeads: true,
    canViewAllData: true,
    canManageSubsidy: true,
    canManageWallet: true,
    canViewReports: true,
    canManageSettings: true,
    canManageProducts: true,
    canManageBrands: true,
    canManageCategories: true,
    canManageSolarSystems: true,
    canManageCommissions: true,
    canManageInstallations: true,
    canManageQuotations: true,
    canManageRawMaterials: true
  },
  [UserRole.SALES_HEAD]: {
    canManageBranches: false,
    canManageUsers: true,
    canManageLeads: true,
    canViewAllData: true,
    canManageSubsidy: false,
    canManageWallet: true,
    canViewReports: true,
    canManageSettings: false,
    canManageProducts: true,
    canManageBrands: true,
    canManageCategories: true,
    canManageSolarSystems: true,
    canManageCommissions: true,
    canManageInstallations: false,
    canManageQuotations: true,
    canManageRawMaterials: false
  },
  [UserRole.OPS_HEAD]: {
    canManageBranches: true,
    canManageUsers: true,
    canManageLeads: true,
    canViewAllData: true,
    canManageSubsidy: true,
    canManageWallet: true,
    canViewReports: true,
    canManageSettings: true,
    canManageProducts: false,
    canManageBrands: false,
    canManageCategories: false,
    canManageSolarSystems: false,
    canManageCommissions: false,
    canManageInstallations: true,
    canManageQuotations: true,
    canManageRawMaterials: true
  },
  [UserRole.HR_HEAD]: {
    canManageBranches: true,
    canManageUsers: true,
    canManageLeads: false,
    canViewAllData: true,
    canManageSubsidy: false,
    canManageWallet: false,
    canViewReports: true,
    canManageSettings: true,
    canManageProducts: false,
    canManageBrands: false,
    canManageCategories: false,
    canManageSolarSystems: false,
    canManageCommissions: false,
    canManageInstallations: false,
    canManageQuotations: false,
    canManageRawMaterials: false
  },
  [UserRole.STATE_MANAGER]: {
    canManageBranches: false,
    canManageUsers: true,
    canManageLeads: true,
    canViewAllData: true,
    canManageSubsidy: true,
    canManageWallet: true,
    canViewReports: true,
    canManageSettings: false,
    canManageProducts: false,
    canManageBrands: false,
    canManageCategories: false,
    canManageSolarSystems: false,
    canManageCommissions: true,
    canManageInstallations: true,
    canManageQuotations: true,
    canManageRawMaterials: false
  },
  [UserRole.REGIONAL_MANAGER]: {
    canManageBranches: false,
    canManageUsers: true,
    canManageLeads: true,
    canViewAllData: false,
    canManageSubsidy: true,
    canManageWallet: true,
    canViewReports: true,
    canManageSettings: false,
    canManageProducts: false,
    canManageBrands: false,
    canManageCategories: false,
    canManageSolarSystems: false,
    canManageCommissions: true,
    canManageInstallations: true,
    canManageQuotations: true,
    canManageRawMaterials: false
  },
  [UserRole.AREA_MANAGER]: {
    canManageBranches: false,
    canManageUsers: true,
    canManageLeads: true,
    canViewAllData: false,
    canManageSubsidy: true,
    canManageWallet: true,
    canViewReports: true,
    canManageSettings: false,
    canManageProducts: false,
    canManageBrands: false,
    canManageCategories: false,
    canManageSolarSystems: false,
    canManageCommissions: false,
    canManageInstallations: true,
    canManageQuotations: true,
    canManageRawMaterials: false
  },
  [UserRole.BRANCH_MANAGER]: {
    canManageBranches: false,
    canManageUsers: true,
    canManageLeads: true,
    canViewAllData: false,
    canManageSubsidy: true,
    canManageWallet: true,
    canViewReports: true,
    canManageSettings: false,
    canManageProducts: false,
    canManageBrands: false,
    canManageCategories: false,
    canManageSolarSystems: false,
    canManageCommissions: false,
    canManageInstallations: true,
    canManageQuotations: true,
    canManageRawMaterials: false
  },
  [UserRole.ASSISTANT_BRANCH_MANAGER]: {
    canManageBranches: false,
    canManageUsers: false,
    canManageLeads: true,
    canViewAllData: false,
    canManageSubsidy: true,
    canManageWallet: true,
    canViewReports: true,
    canManageSettings: false,
    canManageProducts: false,
    canManageBrands: false,
    canManageCategories: false,
    canManageSolarSystems: false,
    canManageCommissions: false,
    canManageInstallations: true,
    canManageQuotations: true,
    canManageRawMaterials: false
  },
  [UserRole.SALES_STAFF]: {
    canManageBranches: false,
    canManageUsers: false,
    canManageLeads: true,
    canViewAllData: false,
    canManageSubsidy: false,
    canManageWallet: false,
    canViewReports: false,
    canManageSettings: false,
    canManageProducts: false,
    canManageBrands: false,
    canManageCategories: false,
    canManageSolarSystems: false,
    canManageCommissions: false,
    canManageInstallations: false,
    canManageQuotations: true,
    canManageRawMaterials: false
  },
  [UserRole.SUBSIDY_STAFF]: {
    canManageBranches: false,
    canManageUsers: false,
    canManageLeads: false,
    canViewAllData: false,
    canManageSubsidy: true,
    canManageWallet: false,
    canViewReports: false,
    canManageSettings: false,
    canManageProducts: false,
    canManageBrands: false,
    canManageCategories: false,
    canManageSolarSystems: false,
    canManageCommissions: false,
    canManageInstallations: false,
    canManageQuotations: false,
    canManageRawMaterials: false
  },
  [UserRole.INSTALLATION_TEAM]: {
    canManageBranches: false,
    canManageUsers: false,
    canManageLeads: false,
    canViewAllData: false,
    canManageSubsidy: false,
    canManageWallet: false,
    canViewReports: false,
    canManageSettings: false,
    canManageProducts: false,
    canManageBrands: false,
    canManageCategories: false,
    canManageSolarSystems: false,
    canManageCommissions: false,
    canManageInstallations: true,
    canManageQuotations: false,
    canManageRawMaterials: false
  },
  [UserRole.ADMIN_STAFF]: {
    canManageBranches: false,
    canManageUsers: false,
    canManageLeads: true,
    canViewAllData: false,
    canManageSubsidy: false,
    canManageWallet: true,
    canViewReports: true,
    canManageSettings: false,
    canManageProducts: false,
    canManageBrands: false,
    canManageCategories: false,
    canManageSolarSystems: false,
    canManageCommissions: false,
    canManageInstallations: false,
    canManageQuotations: false,
    canManageRawMaterials: false
  }
}

// Role hierarchy for access control
export const roleHierarchy: Record<UserRole, number> = {
  [UserRole.ADMIN]: 110,
  [UserRole.DIRECTOR]: 100,
  [UserRole.SALES_HEAD]: 95,
  [UserRole.OPS_HEAD]: 90,
  [UserRole.HR_HEAD]: 88,
  [UserRole.STATE_MANAGER]: 80,
  [UserRole.REGIONAL_MANAGER]: 70,
  [UserRole.AREA_MANAGER]: 65,
  [UserRole.BRANCH_MANAGER]: 55,
  [UserRole.ASSISTANT_BRANCH_MANAGER]: 50,
  [UserRole.SALES_STAFF]: 40,
  [UserRole.SUBSIDY_STAFF]: 40,
  [UserRole.INSTALLATION_TEAM]: 35,
  [UserRole.ADMIN_STAFF]: 30
}

const BRANCH_CHAIN = [
  UserRole.DIRECTOR,
  UserRole.STATE_MANAGER,
  UserRole.REGIONAL_MANAGER,
  UserRole.AREA_MANAGER,
  UserRole.BRANCH_MANAGER
]

const ROLE_HIERARCHY_PATHS: Record<UserRole, UserRole[]> = {
  [UserRole.ADMIN]: [UserRole.ADMIN],
  [UserRole.DIRECTOR]: [UserRole.DIRECTOR],
  [UserRole.SALES_HEAD]: [UserRole.DIRECTOR, UserRole.SALES_HEAD],
  [UserRole.OPS_HEAD]: [UserRole.DIRECTOR, UserRole.OPS_HEAD],
  [UserRole.HR_HEAD]: [UserRole.DIRECTOR, UserRole.HR_HEAD],
  [UserRole.STATE_MANAGER]: [UserRole.DIRECTOR, UserRole.STATE_MANAGER],
  [UserRole.REGIONAL_MANAGER]: [UserRole.DIRECTOR, UserRole.STATE_MANAGER, UserRole.REGIONAL_MANAGER],
  [UserRole.AREA_MANAGER]: [UserRole.DIRECTOR, UserRole.STATE_MANAGER, UserRole.REGIONAL_MANAGER, UserRole.AREA_MANAGER],
  [UserRole.BRANCH_MANAGER]: [...BRANCH_CHAIN],
  [UserRole.ASSISTANT_BRANCH_MANAGER]: [...BRANCH_CHAIN, UserRole.ASSISTANT_BRANCH_MANAGER],
  [UserRole.SALES_STAFF]: [...BRANCH_CHAIN, UserRole.SALES_STAFF],
  [UserRole.SUBSIDY_STAFF]: [...BRANCH_CHAIN, UserRole.SUBSIDY_STAFF],
  [UserRole.INSTALLATION_TEAM]: [...BRANCH_CHAIN, UserRole.INSTALLATION_TEAM],
  [UserRole.ADMIN_STAFF]: [...BRANCH_CHAIN, UserRole.ADMIN_STAFF]
}

export const getRoleHierarchyPath = (role: UserRole): UserRole[] => {
  return ROLE_HIERARCHY_PATHS[role] || [role]
}

export const hasPermission = (userRole: UserRole, permission: PermissionKey): boolean => {
  return rolePermissions[userRole]?.[permission] || false
}

export const canAccessRole = (currentRole: UserRole, targetRole: UserRole): boolean => {
  return (roleHierarchy[currentRole] || 0) >= (roleHierarchy[targetRole] || 0)
}