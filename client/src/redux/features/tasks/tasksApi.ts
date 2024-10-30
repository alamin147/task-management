import { baseApi } from "../../api/baseApi";

const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTask: builder.mutation({
      query: (data) => {
        return {
          url: "/task/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["tasks"],
    }),
    getTasks: builder.query({
      query: () => {
        return {
          url: "/task/tasks",
          method: "GET",
        };
      },
      providesTags: ["tasks"],
    }),
    getSingleTask: builder.query({
      query: (id: string) => ({
        url: "/task",
        method: "GET",
        params: {
          id,
        },
      }),
    }),
    updateSingleTask: builder.mutation({
      query: ({ id, data }) => {
        console.log(id, data);
        return {
          url: `/task/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["tasks"],
    }),
    deleteSingleTask: builder.mutation({
      query: (id) => ({
        url: `/task/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tasks"],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useGetTasksQuery,
  useGetSingleTaskQuery,
  useUpdateSingleTaskMutation,
  useDeleteSingleTaskMutation,
} = taskApi;
