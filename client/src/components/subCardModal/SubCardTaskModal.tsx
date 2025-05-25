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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-7">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-custom-green-dark">Edit List</h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-red-500 transition-colors rounded-full w-8 h-8 flex items-center justify-center border border-gray-200 hover:border-red-200"
            >
              <RxCross2 size={18} />
            </button>
          </div>

          {/* Modal Form */}
          <form onSubmit={handleSubmit}>
            {/* Task Title */}
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">
                List Title
              </label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-custom-green-light focus:border-custom-green transition duration-200"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center mt-7">
              <Tooltip title="Delete this list" color="red">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                >
                  <FaTrash size={16} />
                  <span>Delete</span>
                </button>
              </Tooltip>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-custom-green hover:bg-custom-green-dark text-white rounded-md font-medium transition-colors shadow-sm"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
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
