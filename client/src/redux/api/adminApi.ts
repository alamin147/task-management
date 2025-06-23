import { baseApi } from "./baseApi";

// Define types for the admin API
export interface UserWithDetails {
  _id: string;
  name: string;
  email: string;
  photo: string;
  bio: string;
  role: 'user' | 'admin' ;
  status: 'active' | 'suspended';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
}

export interface UserAnalytics {
  userStats: {
    totalUsers: number;
    adminUsers: number;
    regularUsers: number;
    activeUsers: number;
  };
  taskStats: {
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
  };
}

export interface RoleUpdatePayload {
  role: 'user' | 'admin';
}

export interface StatusUpdatePayload {
  status: 'active' | 'suspended';
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users with detailed information
    getUsersWithDetails: builder.query<UserWithDetails[], void>({
      query: () => ({
        url: '/auth/admin/users/details',
        method: 'GET',
      }),
      providesTags: ['user'],
    }),

    // Get user analytics
    getUserAnalytics: builder.query<UserAnalytics, void>({
      query: () => ({
        url: '/auth/admin/analytics',
        method: 'GET',
      }),
      providesTags: ['user'],
    }),

    // Update user role (promote/demote)
    updateUserRole: builder.mutation<any, { id: string; role: 'user' | 'admin' }>({
      query: ({ id, role }) => ({
        url: `/auth/admin/users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['user'],
    }),

    // Toggle user status (suspend/activate)
    toggleUserStatus: builder.mutation<any, { id: string; status: 'active' | 'suspended' }>({
      query: ({ id, status }) => ({
        url: `/auth/admin/users/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['user'],
    }),

    // Delete user
    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/auth/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['user'],
    }),
  }),
});

export const {
  useGetUsersWithDetailsQuery,
  useGetUserAnalyticsQuery,
  useUpdateUserRoleMutation,
  useToggleUserStatusMutation,
  useDeleteUserMutation,
} = adminApi;
