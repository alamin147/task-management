import { useState } from "react";
import { Tooltip } from "antd";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { FaTrash } from "react-icons/fa6";
import { useDeleteSubTaskMutation, useUpdateSubTaskMutation } from "@/redux/features/subtask/subtaskApi";

const SubCardTaskModal = ({
  onClose,
  subTask,
  taskId,
}: {
  onClose: () => void;
  taskId: string;
  subTask: {
    _id: string;
    title?: string;
    miniTasks?: any;
  } | null;
}) => {
  const [updateSubTask] = useUpdateSubTaskMutation();
  const [deleteSubTask] = useDeleteSubTaskMutation();

  const [loading, setLoading] = useState(false);
// console.log("24",subTask,taskId)
  const [taskTitle, setTaskTitle] = useState(subTask?.title || "");

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    const data = {
      _id: subTask?._id,
      title: taskTitle,
    };

    try {
      const res = await updateSubTask(data).unwrap();

      if (res?.status == 200) toast.success(res?.message || "Sub Task updated");
      else toast.error(res?.message || "Failed to update task.");
    } catch (err) {
      toast.error("Failed to update task.");
      console.error(err);
    } finally {
      onClose();
      setLoading(false);
    }
  };

  //   delete card option to be added
  const handleDelete = async() => {
    const data = {
      taskId,
      subtaskId: subTask?._id,
    };

    try {
      const res = await deleteSubTask(data).unwrap();

      if (res?.status == 200) toast.success(res?.message || "Sub Task deleted");
      else toast.error(res?.message || "Failed to delete task.");
    } catch (err) {
      toast.error("Failed to delete task.");
      console.error(err);
    } finally {
      onClose();
      setLoading(false);
    }
  };
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Sub Task</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded-full bg-red-500"
            >
              <RxCross2 color="white" size={20} />
            </button>
          </div>

          {/* Modal Form */}
          <form onSubmit={handleSubmit}>
            {/* Task Title */}

            <div className="mb-4">
              <label className="mt-2 block text-sm font-medium text-gray-700 mb-1">
                Task Title
              </label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center">
              <Tooltip title="Delete this Task" color={"red"} key={"red"}>
                <FaTrash
                  onClick={handleDelete}
                  size={18}
                  color="red"
                  className="ms-1 cursor-pointer"
                  type="button"
                />
              </Tooltip>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Task"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SubCardTaskModal;
