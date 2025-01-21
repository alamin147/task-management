import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSingleTaskQuery } from "@/redux/features/tasks/tasksApi";
import { useCreateSubTaskMutation } from "@/redux/features/subtask/subtaskApi";
import "./project.css";
import Task from "./Task";
import { FaArrowLeft } from "react-icons/fa";
import { PiShareNetworkFill } from "react-icons/pi";
import { Tooltip } from "antd";
import ShareModal from "@/components/shareModal/ShareModal";
import { useGetUsersQuery } from "@/redux/features/users/users";
const Project = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const { data } = useGetSingleTaskQuery(taskId as string);
  const [createSubTask] = useCreateSubTaskMutation();
  const { data: users } = useGetUsersQuery(undefined);
  const [newTitle, setNewTitle] = useState("Untitled subtask");

  const handleAddSubTask = async () => {
    try {
      await createSubTask({ taskId, title: newTitle });
      setNewTitle("Untitled subtask");
    } catch (err) {
      console.error("Failed to create subtask:", err);
    }
  };
  const [shareOpenModal, setShareOpenModal] = useState(false);
  // console.log("task",data)
  
  return (
    <>
      {shareOpenModal && (
        <ShareModal
          taskId={taskId}
          users={users?.users}
          sharedUsers= {data?.task?.shared}
          setOpenModal={setShareOpenModal}
        />
      )}
      <main className="m-6 overflow-hidden ">
        <div className="overflow-x-auto scrollbar-custom ">
          <div className="flex items-center justify-between ">
            <Tooltip title="Go back">
              <FaArrowLeft
                size={18}
                color="white"
                className="cursor-pointer"
                onClick={() => navigate(`/`)}
              />
            </Tooltip>
            <Tooltip title="Share this with ">
              <PiShareNetworkFill
                size={20}
                className="cursor-pointer me-5"
                color="white"
                onClick={() => setShareOpenModal(true)}
              />
            </Tooltip>
          </div>
          <div
            className="pb-8 mt-3 flex gap-1"
            style={{ height: "calc(100vh - 140px)" }}
          >
            <Task task={data?.task} />

            <div className="pe-5">
              <div className="mt-4  w-64 h-36 bg-white text-black p-3 flex-shrink-0 rounded-lg flex flex-col gap-4">
                <div className="flex flex-col gap-4 p-3 rounded-md border-gray-50 shadow-md border">
                  <input
                    type="text"
                    placeholder="Add sub task..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="px-3 py- py-2 rounded-md text-black shadow-md bg-gray-50 focus:outline-none focus:ring-0 border-none"
                  />
                  <button
                    onClick={handleAddSubTask}
                    className="w-full bg-gray-100 hover:bg-gray-300 text-black px-3 py-2 rounded-lg shadow-md"
                  >
                    Add sub task
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Project;
