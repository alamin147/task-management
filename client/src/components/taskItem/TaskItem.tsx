import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaPen, FaTrash } from "react-icons/fa";
import { IoMdDoneAll } from "react-icons/io";
import Modal from "../modal/Modal";
import {
  useDeleteSingleTaskMutation,
  useDuplicateSingleTaskMutation,
} from "@/redux/features/tasks/tasksApi";
import { TTask } from "@/types/types";
import { useNavigate } from "react-router-dom";
import { IoDuplicate } from "react-icons/io5";
import { Tooltip } from "antd";
const TaskItem = ({ task }: { task: TTask }) => {
  const navigate = useNavigate();
  const [deleteSingleTask] = useDeleteSingleTaskMutation();
  const [duplicateSingleTask] = useDuplicateSingleTaskMutation();
  const [openModal, setOpenModal] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "high":
        return "text-red-500";
      default:
        return "text-red-500";
    }
  };

  const deleteTask = async (id: string, title: string) => {
    try {
      await deleteSingleTask(id).unwrap();
      toast.success(`${title} deleted successfully!`);
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleDuplicate = async (taskId: string, title: string) => {
    try {
      await duplicateSingleTask(taskId).unwrap();
      toast.success(`${title} duplicated successfully!`);
    } catch {
      toast.error("Failed to duplicated task");
    }
  };

  return (
    <>
      {openModal && <Modal setOpenModal={setOpenModal} task={task} />}

      <motion.div
        className="h-48 px-4 py-3 flex flex-col gap-4 shadow-sm bg-[#f9f9f9] rounded-lg border-2 border-white"
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 0.9 }}
        exit={{ opacity: 0, scale: 0.7 }}
        whileHover={{ scale: 1 }}
      >
        <div
          className="cursor-pointer"
          onClick={() => navigate(`/project/${task._id}`)}
        >
          <h4 className="font-bold text-2xl">
            {task.title ? task.title : "Untitled task"}
          </h4>
          <p className="break-words whitespace-normal">
            {task.description && task.description.length > 130
              ? task.description.substring(0, 130) + "..."
              : task.description || "No description"}
          </p>
        </div>
        <div className="mt-auto border-t pt-2 border-gray-300 flex justify-between items-center">
          <Tooltip title="Due Date" color="black">
            <p className="text-sm text-gray-400">
              {task?.dueDate?.split("T")[0]}
            </p>
          </Tooltip>
          <Tooltip title="Priority" color="black">
            <p
              className={`text-sm font-bold ${getPriorityColor(
                task?.priority
              )}`}
            >
              {task.priority.charAt(0).toUpperCase() +
                task.priority.slice(1).toLowerCase()}
            </p>
          </Tooltip>
          <div className="flex items-center gap-3 text-gray-400 text-[1.2rem]">
            <Tooltip
              title={`${
                task?.completed
                  ? "Completed"
                  : new Date(task.dueDate) < new Date()
                  ? "Overdue"
                  : "Pending"
              }`}
              color={`${
                task?.completed
                  ? "green"
                  : new Date(task.dueDate) < new Date()
                  ? "red"
                  : "yellow"
              }`}
            >
              <p
                className={`${
                  task.completed ? "text-green-500" : "text-gray-400"
                }`}
              >
                <IoMdDoneAll size={20} />
              </p>
            </Tooltip>
            <Tooltip title="Edit" color="blue">
              <button
                className="text-[#00A1F1]"
                onClick={() => setOpenModal(true)}
              >
                <FaPen size={15.5} />
              </button>
            </Tooltip>
            <Tooltip title="Duplicate" color="gray">
              <button
                className=""
                onClick={() => handleDuplicate(task?._id, task?.title)}
              >
                <IoDuplicate size={17} />
              </button>
            </Tooltip>
            <Tooltip title="Delete" color="red">
              <button
                className="text-[#F65314]"
                onClick={() => deleteTask(task._id, task.title)}
              >
                <FaTrash size={17} />
              </button>
            </Tooltip>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default TaskItem;
