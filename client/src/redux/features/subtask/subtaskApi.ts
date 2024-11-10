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
  }),
});

export const { useCreateSubTaskMutation } = subtaskApi;
