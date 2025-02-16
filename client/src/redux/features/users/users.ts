import { baseApi } from "../../api/baseApi";

const UserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => {
        return {
          url: `/auth/users`,
          method: "GET",
        };
      },
      providesTags: ["user"],
    }),
    getUser: builder.query({
      query: () => {
        return {
          url: `/auth/users/user`,
          method: "GET",
        };
      },
      providesTags: ["user"],
    }),
    updateUser: builder.mutation({
      query: (formdata) => {
        return {
          url: `/auth/user/edit`,
          method: "PATCH",
          body: formdata
        };
      },
      invalidatesTags: ["user"],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserQuery, useUpdateUserMutation} = UserApi;
