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
      query: (status?: string) => {
        // console.log(status);
        return {
          url: `/task/tasks/${status}`,
          method: "GET",
        };
      },
      providesTags: ["tasks"],
    }),
    getSharedTasks: builder.query({
      query: () => {
        // console.log(status);
        return {
          url: `/task/tasks/share`,
          method: "GET",
        };
      },
      providesTags: ["tasks"],
    }),

    getSingleTask: builder.query({
      query: (taskId: string) => {
        // console.log({taskId})

        return {
          url: `/task/${taskId}`,
          method: "GET",
        };
      },
      providesTags: ["subtask"],
    }),

    updateSingleTask: builder.mutation({
      query: ({ id, data }) => {
        // console.log(id, data);
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
    duplicateSingleTask: builder.mutation({
      query: (taskId) => ({
        url: `/task/duplicate/${taskId}`,
        method: "POST",
      }),
      invalidatesTags: ["tasks"],
    }),
    shareSingleTask: builder.mutation({
      query: ({ taskId, user }) => {
        // console.log("666", taskId, user);
        return {
          url: `/task/share/${taskId}`,
          method: "POST",
          body: user,
        };
      },
      invalidatesTags: ["tasks","subtask"],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useGetTasksQuery,
  useGetSingleTaskQuery,
  useUpdateSingleTaskMutation,
  useDeleteSingleTaskMutation,
  useDuplicateSingleTaskMutation,
  useShareSingleTaskMutation,
  useGetSharedTasksQuery
} = taskApi;
