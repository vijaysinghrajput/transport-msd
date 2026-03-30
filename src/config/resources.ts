import { UserRole } from '@/config/roles'

// Define Refine resources based on our CRM entities
export const resources = [
  {
    name: "leads",
    list: "/dashboard/leads",
    create: "/dashboard/leads/create",
    edit: "/dashboard/leads/edit/:id",
    show: "/dashboard/leads/show/:id",
    meta: {
      canDelete: true,
      label: "Leads",
      icon: "UserOutlined",
      roles: [
        UserRole.DIRECTOR,
        UserRole.SALES_HEAD,
        UserRole.OPS_HEAD,
        UserRole.STATE_MANAGER,
        UserRole.REGIONAL_MANAGER,
        UserRole.AREA_MANAGER,
        UserRole.BRANCH_MANAGER,
        UserRole.ASSISTANT_BRANCH_MANAGER,
        UserRole.SALES_STAFF,
        UserRole.SUBSIDY_STAFF,
        UserRole.ADMIN_STAFF
      ]
    },
  },
  {
    name: "branches",
    list: "/dashboard/branches", 
    create: "/dashboard/branches/create",
    edit: "/dashboard/branches/edit/:id",
    show: "/dashboard/branches/show/:id",
    meta: {
      canDelete: true,
      label: "Branches",
      icon: "BankOutlined",
      roles: [UserRole.DIRECTOR, UserRole.OPS_HEAD, UserRole.HR_HEAD, UserRole.STATE_MANAGER]
    },
  },
  {
    name: "users",
    list: "/dashboard/users",
    create: "/dashboard/users/create", 
    edit: "/dashboard/users/edit/:id",
    show: "/dashboard/users/show/:id",
    meta: {
      canDelete: true,
      label: "Users",
      icon: "TeamOutlined",
      roles: [UserRole.DIRECTOR, UserRole.OPS_HEAD, UserRole.HR_HEAD, UserRole.STATE_MANAGER]
    },
  },
  {
    name: "subsidy_claims",
    list: "/dashboard/subsidy",
    create: "/dashboard/subsidy/create",
    edit: "/dashboard/subsidy/edit/:id", 
    show: "/dashboard/subsidy/show/:id",
    meta: {
      canDelete: false,
      label: "Subsidy Claims",
      icon: "FileTextOutlined",
      roles: [
        UserRole.DIRECTOR,
        UserRole.OPS_HEAD,
        UserRole.STATE_MANAGER,
        UserRole.REGIONAL_MANAGER,
        UserRole.AREA_MANAGER,
        UserRole.BRANCH_MANAGER,
        UserRole.ASSISTANT_BRANCH_MANAGER,
        UserRole.SUBSIDY_STAFF
      ]
    },
  },
  {
    name: "lead_documents",
    list: "/dashboard/documents",
    create: "/dashboard/documents/create",
    edit: "/dashboard/documents/edit/:id",
    show: "/dashboard/documents/show/:id", 
    meta: {
      canDelete: true,
      label: "Documents",
      icon: "FolderOutlined",
      roles: [
        UserRole.DIRECTOR,
        UserRole.OPS_HEAD,
        UserRole.STATE_MANAGER,
        UserRole.AREA_MANAGER,
        UserRole.BRANCH_MANAGER,
        UserRole.ASSISTANT_BRANCH_MANAGER,
        UserRole.SUBSIDY_STAFF,
        UserRole.ADMIN_STAFF
      ]
    },
  }
]

// Filter resources based on user role
export const getResourcesForRole = (role: UserRole) => {
  return resources.filter(resource => 
    resource.meta.roles.includes(role)
  )
}