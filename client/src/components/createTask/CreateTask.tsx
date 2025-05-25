import { useCreateTaskMutation } from "@/redux/features/tasks/tasksApi";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { Button, Modal } from "antd";

const CreateTask = ({
  openModal,
  setOpenModal,
}: {
  setOpenModal: any;
  openModal: any;
}) => {
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
      console.log(
        "right herererer create task"
      )
      await createTask(data).unwrap();
      toast.success("Task created successfully!");
      setOpenModal(false);
    } catch (error) {
      toast.error("Failed to create task");
    }
  };
  return (
    <Modal
      title={<div className="text-xl font-bold text-custom-green-dark py-2">Create New Task</div>}
      open={openModal}
      onCancel={() => setOpenModal(false)}
      footer={null}
      style={{
        top: 20,
        boxShadow: '0 10px 25px rgba(46, 204, 113, 0.15)'
      }}
      bodyStyle={{
        padding: '20px',
        backgroundColor: '#fff'
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
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
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className="h-2xl max-h-[200px] md:max-h-[250px] w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-custom-green-light focus:border-custom-green transition duration-200"
                placeholder="Enter task details"
                rows={3}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Priority Field */}
          <div>
            <label htmlFor="priority" className="block text-gray-700 font-medium mb-2">Priority</label>
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
          <div>
            <label htmlFor="dueDate" className="block text-gray-700 font-medium mb-2">Due Date</label>
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
        <div>
          <label htmlFor="completed" className="block text-gray-700 font-medium mb-2">Task Status</label>
          <Controller
            name="completed"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-custom-green-light focus:border-custom-green transition duration-200 bg-white"
              >
                <option value="false">Pending</option>
                <option value="true">Completed</option>
              </select>
            )}
          />
        </div>

        <Button
          type="primary"
          htmlType="submit"
          className="mt-4 w-full bg-custom-green hover:bg-custom-green-hover h-12 text-lg font-medium border-0 rounded-md shadow-md"
        >
          Create Task
        </Button>
      </form>
    </Modal>
  );
};

export default CreateTask;
