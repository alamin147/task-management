import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaPen, FaTrash } from "react-icons/fa";
import { IoMdDoneAll } from "react-icons/io";
import Modal from "../modal/Modal";
import {
  useDeleteSingleTaskMutation,
  useUpdateSingleTaskMutation,
} from "@/redux/features/tasks/tasksApi";
import { TTask } from "@/types/types";

const TaskItem = ({ task }: { task: TTask }) => {
  const [deleteSingleTask] = useDeleteSingleTaskMutation();
  const [updateSingleTask] = useUpdateSingleTaskMutation();
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

  const handleTaskComplete = async () => {
    const data = { completed: true };
    const res = await updateSingleTask({ id: task._id, data });
    if (res) toast.success(`${task.title} Done successfully!`);
  };

  return (
    <>
      {openModal && <Modal setOpenModal={setOpenModal} task={task} />}

      <motion.div
        className="h-[16rem] px-4 py-3 flex flex-col gap-4 shadow-sm bg-[#f9f9f9] rounded-lg border-2 border-white"
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div>
          <h4 className="font-bold text-2xl">{task.title}</h4>
          <p>{task.description}</p>
        </div>
        <div className="mt-auto flex justify-between items-center">
          <p className="text-sm text-gray-400">9.04pm</p>
          <p className={`text-sm font-bold ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </p>
          <div>
            <div className="flex items-center gap-3 text-gray-400 text-[1.2rem]">
              <p
                title={`${
                  task.completed ? "Completed Task" : "Incomplete Task"
                }`}
                onClick={handleTaskComplete}
                className={`${
                  task.completed ? "text-green-500" : "text-gray-400"
                } cursor-text`}
              >
                <IoMdDoneAll />
              </p>
              <button
                className="text-[#00A1F1]"
                onClick={() => setOpenModal(true)}
              >
                <FaPen />
              </button>
              <button
                className="text-[#F65314]"
                onClick={() => deleteTask(task._id, task.title)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default TaskItem;
