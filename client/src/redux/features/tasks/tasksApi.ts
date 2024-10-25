import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
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
  }),
});

export const { useCreateTaskMutation, useGetTasksQuery } = authApi;
