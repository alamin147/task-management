import { baseApi } from "../../api/baseApi";

const miniTaskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMiniTask: builder.mutation({
      query: ({ subtaskId, title }) => {
        // console.log(id, data);
        return {
          url: `/minitask/create`,
          method: "POST",
          body: { title, subtaskId },
        };
      },
      invalidatesTags: ["subtask"],
    }),

    updateMiniTask: builder.mutation({
      query: (formdata) => {
        return {
          url: `/minitask/update`,
          method: "POST",
          body: formdata,
        };
      },
      invalidatesTags: ["subtask"],
    }),

    deleteMiniTask: builder.mutation({
      query: ({ miniTaskId, subtaskId }) => {
        return {
          url: `/minitask/delete/minitask`,
          method: "DELETE",
          body: {
            miniTaskId,
            subtaskId,
          },
        };
      },
      invalidatesTags: ["subtask"],
    }),
  }),
});

export const {
  useCreateMiniTaskMutation,
  useUpdateMiniTaskMutation,
  useDeleteMiniTaskMutation,
} = miniTaskApi;
