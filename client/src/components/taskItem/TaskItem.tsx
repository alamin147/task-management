import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaPen, FaTrash, FaArrowRight } from "react-icons/fa";
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
import Swal from "sweetalert2";
const TaskItem = ({ task }: { task: TTask }) => {
  const navigate = useNavigate();
  const [deleteSingleTask] = useDeleteSingleTaskMutation();
  const [duplicateSingleTask] = useDuplicateSingleTaskMutation();
  const [openModal, setOpenModal] = useState(false);

  const deleteTask = async (id: string, title: string) => {
    try {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton:
            "px-4 py-2 bg-green-500 rounded-lg text-white border-none cursor-pointer",
          cancelButton:
            "px-4 py-2 bg-red-500 rounded-lg text-white border-none me-2 cursor-pointer",
        },
        buttonsStyling: false,
      });
      swalWithBootstrapButtons
        .fire({
          title: "Delete this task?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            const res = await deleteSingleTask(id).unwrap();
            if (res?.status == 200) {
              swalWithBootstrapButtons.fire({
                title: "Deleted!",
                text: `${title} task has been deleted.`,
                icon: "success",
              });
            } else if (res?.status != 200) {
              swalWithBootstrapButtons.fire({
                title: "Could not delete!",
                text: `${res?.message}`,
                icon: "error",
              });
            }
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
              title: "Cancelled",
              icon: "error",
            });
          }
        });
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
        className="min-h-[192px] h-auto px-3 sm:px-4 md:px-5 py-3 sm:py-4 flex flex-col gap-3 sm:gap-4 shadow-task bg-white rounded-lg border-l-4 w-full"
        style={{
          borderLeftColor: task?.priority === "high"
            ? "#e74c3c"
            : task?.priority === "medium"
            ? "#f39c12"
            : "#2ecc71"
        }}
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 0.95 }}
        exit={{ opacity: 0, scale: 0.7 }}
        whileHover={{
          scale: 1,
          boxShadow: "0 10px 15px rgba(46, 204, 113, 0.15), 0 4px 6px rgba(46, 204, 113, 0.1)",
          transition: { duration: 0.2 }
        }}
      >        <div
          className="cursor-pointer group flex-1"
          onClick={() => navigate(`/project/${task._id}`)}
        >
          <div className="flex items-start justify-between mb-2 gap-2">
            <h4 className="font-bold text-lg sm:text-xl md:text-2xl text-gray-800 group-hover:text-custom-green-dark transition-colors line-clamp-2 break-words min-w-0 flex-1">
              {task.title ? task.title : "Untitled task"}
            </h4>
            <FaArrowRight className="text-gray-400 group-hover:text-custom-green group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" size={16} />
          </div>
          <p className="break-words whitespace-normal text-gray-600 leading-relaxed text-sm sm:text-base line-clamp-3 overflow-hidden">
            {task.description && task.description.length > 100
              ? task.description.substring(0, 100) + "..."
              : task.description || "No description"}
          </p>
        </div>
        <div className="mt-auto border-t pt-2 sm:pt-3 border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <Tooltip title="Due Date" color="green">
                <p className="text-xs sm:text-sm bg-custom-bg px-2 py-1 rounded-md text-custom-green-dark font-medium whitespace-nowrap">
                  {task?.dueDate?.split("T")[0]}
                </p>
              </Tooltip>
              <Tooltip title="Priority" color={task?.priority === "high" ? "red" : task?.priority === "medium" ? "orange" : "green"}>
                <p
                  className={`text-xs sm:text-sm font-bold px-2 py-1 rounded-md whitespace-nowrap ${
                    task?.priority === "high"
                      ? "bg-red-100 text-red-600"
                      : task?.priority === "medium"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {task.priority.charAt(0).toUpperCase() +
                    task.priority.slice(1).toLowerCase()}
                </p>
              </Tooltip>
            </div>
            <div className="flex items-center justify-end gap-2 sm:gap-3 flex-shrink-0">
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
                <div
                  className={`p-1 sm:p-1.5 rounded-full ${
                    task.completed
                      ? "bg-green-100"
                      : new Date(task.dueDate) < new Date()
                      ? "bg-red-100"
                      : "bg-yellow-100"
                  }`}
                >
                  <IoMdDoneAll size={14}
                    className={`${
                      task.completed
                        ? "text-green-600"
                        : new Date(task.dueDate) < new Date()
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  />
                </div>
              </Tooltip>
              <Tooltip title="Edit" color="blue">
                <button
                  className="text-blue-500 p-1 sm:p-1.5 hover:bg-blue-50 rounded-full transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenModal(true);
                  }}
                >
                  <FaPen size={12} className="sm:w-3.5 sm:h-3.5" />
                </button>
              </Tooltip>
              <Tooltip title="Duplicate" color="gray">
                <button
                  className="text-gray-500 p-1 sm:p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicate(task?._id, task?.title);
                  }}
                >
                  <IoDuplicate size={13} className="sm:w-3.5 sm:h-3.5" />
                </button>
              </Tooltip>
              <Tooltip title="Delete" color="red">
                <button
                  className="text-red-500 p-1 sm:p-1.5 hover:bg-red-50 rounded-full transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task._id, task.title);
                  }}
                >
                  <FaTrash size={12} className="sm:w-3.5 sm:h-3.5" />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default TaskItem;
