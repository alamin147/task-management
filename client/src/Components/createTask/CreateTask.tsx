import { useCreateTaskMutation } from "@/redux/features/tasks/tasksApi";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

const CreateTask = ({ setOpenModal }: { setOpenModal: any }) => {
  const [createTask] = useCreateTaskMutation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: "low",
      dueDate: "",
      completed: "false",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await createTask(data).unwrap();
      toast.success("Task created successfully!");
      setOpenModal(false);
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  return (
    <div className="fixed left-0 top-0 z-50 h-full w-full bg-[#333]/30 overflow-hidden">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="py-5 px-6 max-w-[520px] w-full flex flex-col gap-3 bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md"
      >
        {/* Close button */}
        <button
          type="button"
          className="absolute -top-1 -right-1 text-white bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center"
          onClick={() => setOpenModal(false)}
        >
          &times;
        </button>

        <h1 className="text-2xl font-bold text-center mt-10 mb-3">
          Create a new Task
        </h1>

        {/* Title Field */}
        <div className="flex flex-col gap-1">
          <label htmlFor="title">Title</label>
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <input
                {...field}
                className="bg-[#F9F9F9] p-2 rounded-md border"
                type="text"
                id="title"
                placeholder="Task Title"
              />
            )}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div className="flex flex-col gap-1">
          <label htmlFor="description">Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className="bg-[#F9F9F9] p-2 rounded-md border resize-none"
                placeholder="Task Description"
                rows={4}
              />
            )}
          />
        </div>

        {/* Priority Field */}
        <div className="flex flex-col gap-1">
          <label htmlFor="priority">Select Priority</label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="bg-[#F9F9F9] p-2 rounded-md border cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            )}
          />
        </div>

        {/* Due Date Field */}
        <div className="flex flex-col gap-1">
          <label htmlFor="dueDate">Due Date</label>
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                className="bg-[#F9F9F9] p-2 rounded-md border"
                type="date"
              />
            )}
          />
        </div>

        {/* Completed Field */}
        <div className="flex flex-col gap-1">
          <label htmlFor="completed">Task Completed</label>
          <Controller
            name="completed"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="bg-[#F9F9F9] p-2 rounded-md border cursor-pointer"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            className="px-8 py-3 bg-[#3aafae] text-white rounded-[50px]
            hover:bg-[#00A1F1] hover:text-white transition-all duration-200 ease-in-out w-full"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;
