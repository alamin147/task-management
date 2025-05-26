import { useUpdateSingleTaskMutation } from "@/redux/features/tasks/tasksApi";
import { TTask } from "@/types/types";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

const Modal = ({ task, setOpenModal }: { task: TTask; setOpenModal: any }) => {
  const [updateSingleTask, {}] = useUpdateSingleTaskMutation();
  const {
    control,
    handleSubmit,


  } = useForm({
    defaultValues: {
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: new Date(task.dueDate).toISOString().split("T")[0], // Format dueDate to YYYY-MM-DD
      completed: task.completed ? "true" : "false",
    },
  });

  const onSubmit = async (data: any) => {
    // console.log("Form data:", data);
    // Handle the update action here
    const res = await updateSingleTask({ id: task._id, data });
    if (res) toast.success(`${task.title} updated successfully!`);
    setOpenModal(false);
  };

  return (
  <div className="fixed left-0 top-0 z-50 h-full w-full bg-black/40 overflow-hidden backdrop-blur-sm">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="py-8 px-7 max-w-[550px] w-full flex flex-col gap-4 bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-xl"
      >
        {/* Close button */}
        <button
          type="button"
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition-colors rounded-full w-8 h-8 flex items-center justify-center border border-gray-200 hover:border-red-200"
          onClick={() => setOpenModal(false)}
        >
          &times;
        </button>

        <h1 className="text-2xl font-bold text-center mt-4 mb-4 text-custom-green-dark">
          Update Task
        </h1>        {/* Title Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-gray-700 font-medium">Title</label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-custom-green-light focus:border-custom-green transition duration-200"
                type="text"
                id="title"
                placeholder="Enter task title"
              />
            )}
          />
        </div>

        {/* Description Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-gray-700 font-medium">Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-custom-green-light focus:border-custom-green transition duration-200"
                placeholder="Enter task details"
                rows={4}
              />
            )}
          />
        </div>        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
          {/* Priority Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="priority" className="text-gray-700 font-medium">Priority</label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-custom-green-light focus:border-custom-green transition duration-200 bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              )}
            />
          </div>

          {/* Due Date Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="dueDate" className="text-gray-700 font-medium">Due Date</label>
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-custom-green-light focus:border-custom-green transition duration-200"
                  type="date"
                />
              )}
            />
          </div>
        </div>

        {/* Completed Field */}
        <div className="flex flex-col gap-2 mt-1">
          <label htmlFor="completed" className="text-gray-700 font-medium">Task Status</label>
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
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default Modal;
