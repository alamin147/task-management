import { baseApi } from "../../api/baseApi";

const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTask: builder.mutation({
      query: (data) => ({
        url: "/task/create",
        method: "POST",
        body: data,
      }),
    }),
    getTasks: builder.query({
      query: () => ({
        url: "/task/tasks",
        method: "GET",
      }),
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
      query: ({ id, data }) => ({
        url: `/task/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteSingleTask: builder.mutation({
      query: (id) => ({
        url: `/task/${id}`,
        method: "DELETE",
      }),
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
