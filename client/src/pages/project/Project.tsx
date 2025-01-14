import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSingleTaskQuery } from "@/redux/features/tasks/tasksApi";
import { useCreateSubTaskMutation } from "@/redux/features/subtask/subtaskApi";
import "./project.css";
import Task from "./Task";
import { FaArrowLeft } from "react-icons/fa";

const Project = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const { data } = useGetSingleTaskQuery(taskId as string);
  const [createSubTask] = useCreateSubTaskMutation();

  const [newTitle, setNewTitle] = useState("Untitled subtask");

  const handleAddSubTask = async () => {
    try {
      await createSubTask({ taskId, title: newTitle });
      setNewTitle("Untitled subtask");
    } catch (err) {
      console.error("Failed to create subtask:", err);
    }
  };

  return (
    <>
      <main className="m-6 overflow-hidden">
        <div className="overflow-x-auto">
          <FaArrowLeft
            size={18}
            color="white"
            className="cursor-pointer"
            onClick={() => navigate(`/`)}
          />

          <div
            className="pb-8 mt-3 flex gap-4"
            style={{ height: "calc(100vh - 140px)" }}
          >
            <Task task={data?.task} />

            <div className="mt-4 w-64 h-36 bg-white text-black p-3 flex-shrink-0 rounded-lg flex flex-col gap-4 ">
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
      </main>
    </>
  );
};

export default Project;
