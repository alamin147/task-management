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
      title="Create New Task"
      open={openModal}
      onCancel={() => setOpenModal(false)}
      footer={null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Title Field */}
        <div>
          <label htmlFor="title">Title</label>
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <input
                {...field}
                className="w-full p-2 border rounded"
                type="text"
                id="title"
                placeholder="Task Title"
              />
            )}
          />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description">Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className="w-full p-2 border rounded"
                placeholder="Task Description"
                rows={3}
              />
            )}
          />
        </div>

        {/* Priority Field */}
        <div>
          <label htmlFor="priority">Priority</label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <select {...field} className="w-full p-2 border rounded">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            )}
          />
        </div>

        {/* Due Date Field */}
        <div>
          <label htmlFor="dueDate">Due Date</label>
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                className="w-full p-2 border rounded"
                type="date"
              />
            )}
          />
        </div>

        {/* Completed Field */}
        <div>
          <label htmlFor="completed">Task Completed</label>
          <Controller
            name="completed"
            control={control}
            render={({ field }) => (
              <select {...field} className="w-full p-2 border rounded">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            )}
          />
        </div>

        <Button type="primary" htmlType="submit" className="mt-4 w-full">
          Submit
        </Button>
      </form>
    </Modal>
  );
};

export default CreateTask;
