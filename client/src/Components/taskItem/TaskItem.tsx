import { useDeleteSingleTaskMutation } from "@/redux/features/tasks/tasksApi";
import { TTask } from "@/types/types";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaStar, FaPen, FaTrash } from "react-icons/fa";
import Modal from "../modal/Modal";

const TaskItem = ({ task }: { task: TTask }) => {
  const [deleteSingleTask, {}] = useDeleteSingleTaskMutation();
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
      const res = await deleteSingleTask(id).unwrap();
      // console.log(res);
      if (res) toast.success(`${title} deleted successfully!`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete task");
    }
  };

  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      {/*modal start  */}
      {openModal && <Modal setOpenModal={setOpenModal} task={task} />}

      {/* modal end */}
      <motion.div
        className="h-[16rem] px-4 py-3 flex flex-col gap-4 shadow-sm bg-[#f9f9f9] rounded-lg border-2 border-white"
        // variants={item}
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
              <button
                className={`${
                  task.completed ? "text-yellow-400" : "text-gray-400"
                }`}
              >
                <FaStar />
              </button>
              <button
                className="text-[#00A1F1]"
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                <FaPen />
              </button>
              <button
                className="text-[#F65314]"
                onClick={() => {
                  deleteTask(task._id, task.title);
                }}
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
