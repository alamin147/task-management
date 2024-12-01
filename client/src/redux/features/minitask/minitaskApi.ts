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
  }),
});

export const { useCreateMiniTaskMutation } = miniTaskApi;
