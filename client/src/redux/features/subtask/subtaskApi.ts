import { baseApi } from "../../api/baseApi";

const subtaskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSubTask: builder.mutation({
      query: ({ taskId, title }) => {
        // console.log(id, data);
        return {
          url: `/card/sub-card`,
          method: "POST",
          body: { title, taskId },
        };
      },
      invalidatesTags: ["subtask"],
    }),

    updateSubTask: builder.mutation({
      query: (data) => {
        return {
          url: `/card/sub-card/update`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["subtask"],
    }),
    deleteSubTask: builder.mutation({
      query: (data) => {
        return {
          url: `/card/sub-card/delete`,
          method: "delete",
          body: data,
        };
      },
      invalidatesTags: ["subtask"],
    }),
    reorderSubTasks: builder.mutation({
      query: ({ taskId, subtasks }) => {
        return {
          url: `/card/sub-card/reorder`,
          method: "PATCH",
          body: { taskId, subtasks },
        };
      },
      invalidatesTags: ["subtask"],
    }),
  }),
});

export const {
  useCreateSubTaskMutation,
  useUpdateSubTaskMutation,
  useDeleteSubTaskMutation,
  useReorderSubTasksMutation
} = subtaskApi;
