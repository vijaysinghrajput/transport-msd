import { AuthProvider } from "@refinedev/core";
import { supabase } from "./supabaseClient";
import { UserRole } from "../config/roles";

interface AuthResult {
  success: boolean;
  error?: {
    name: string;
    message: string;
  };
  redirectTo?: string;
  [key: string]: any; // Add index signature for compatibility
}

export const authProvider: AuthProvider = {
  login: async ({ email, password }: any) => {
    try {
      console.log('🔐 Attempting login for:', email);
      
      // Use Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Supabase auth error:', error);
        return {
          success: false,
          error: {
            name: "LoginError",
            message: error.message,
          },
        };
      }

      if (data?.user) {
        // Get user profile from our users table
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          return {
            success: false,
            error: {
              name: "ProfileError", 
              message: "Failed to load user profile",
            },
          };
        }

        // Business Rule: Check branch assignment
        const rolesWithOptionalBranch: Array<string> = [
          'admin',
          UserRole.DIRECTOR,
          UserRole.SALES_HEAD,
          UserRole.OPS_HEAD,
          UserRole.HR_HEAD,
          UserRole.STATE_MANAGER,
          UserRole.REGIONAL_MANAGER,
          UserRole.AREA_MANAGER
        ]

        if (!rolesWithOptionalBranch.includes(userProfile.role) && !userProfile.branch_id) {
          return {
            success: false,
            error: {
              name: "BranchAssignmentError",
              message: "Your account is not assigned to any branch. Please contact administrator for branch assignment.",
            },
          };
        }

        // Check if user is active
        if (!userProfile.is_active) {
          return {
            success: false,
            error: {
              name: "AccountDisabledError",
              message: "Your account has been disabled. Please contact administrator.",
            },
          };
        }

        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify(userProfile));

        return {
          success: true,
          redirectTo: "/dashboard",
        };
      }

      return {
        success: false,
        error: {
          name: "LoginError",
          message: "Invalid credentials",
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: error.message,
        },
      };
    }
  },

  register: async ({ email, password, name, role, branch_id }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: {
            message: error.message,
            name: "Registration Error",
          },
        };
      }

      if (data.user) {
        return {
          success: true,
          redirectTo: "/login",
        };
      }

      return {
        success: false,
        error: {
          message: "Registration failed",
          name: "Registration Error",
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message,
          name: "Registration Error",
        },
      };
    }
  },

  logout: async (params?: any) => {
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    
    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          name: "Logout Error",
        },
      };
    }

    localStorage.removeItem('user');
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      // Handle refresh token errors
      if (error) {
        console.error('❌ Session check error:', error);
        // If refresh token is invalid, clear session and redirect to login
        if (error.message?.includes('refresh_token') || error.message?.includes('Invalid Refresh Token')) {
          localStorage.removeItem('user');
          await supabase.auth.signOut({ scope: 'local' });
          return {
            authenticated: false,
            redirectTo: "/login",
          };
        }
      }
      
      if (data?.session?.user) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          return {
            authenticated: true,
          };
        }
      }

      return {
        authenticated: false,
        redirectTo: "/login",
      };
    } catch (error: any) {
      console.error('❌ Auth check error:', error);
      // Clear user data on any auth error
      localStorage.removeItem('user');
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  },

  getPermissions: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role || null;
  },

  getIdentity: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch_id: user.branch_id,
      };
    }
    return null;
  },

  onError: async (error) => {
    console.error("Auth error:", error);
    return { error };
  },
};
