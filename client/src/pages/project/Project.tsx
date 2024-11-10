import { useState } from "react";
import { useParams } from "react-router-dom";
import { FaPen, FaTrash } from "react-icons/fa";
import { IoMdDoneAll } from "react-icons/io";
import { useGetSingleTaskQuery } from "@/redux/features/tasks/tasksApi";
import { useCreateSubTaskMutation } from "@/redux/features/subtask/subtaskApi";

const Project = () => {
  const { taskId } = useParams();
  const { data, isLoading } = useGetSingleTaskQuery(taskId as string);
  const [createSubTask] = useCreateSubTaskMutation();

  console.log(data?.task?.subcards);
  const [newTitle, setNewTitle] = useState("Untitled subtask");

  const handleAddSubTask = async () => {
    try {
      await createSubTask({ taskId, title: newTitle });
      setNewTitle("");
    } catch (err) {
      console.error("Failed to create subtask:", err);
    }
  };

  const deleteCard = (id: any) => {
    console.log("deleted", id);
  };

  return (
    <>
      <main className="m-6 h-full">
        <div>
          <h2 className="text-2xl font-bold">Project Tasks</h2>
        </div>

        <div className="pb-8 mt-6 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          {data?.task?.subcards?.map((card: any) => (
            <div
              key={card._id}
              className="h-64 px-4 py-3 flex flex-col gap-4 shadow-sm bg-gray-50 rounded-lg border border-gray-200"
            >
              <div>
                <h4 className="font-bold text-2xl">{card.title}</h4>
              </div>
              <div className="mt-auto flex justify-between items-center">
                <p className="text-sm text-gray-400">{card.time}</p>
                <div className="flex items-center gap-3 text-gray-400 text-lg">
                  <button>
                    <IoMdDoneAll />
                  </button>
                  <button className="text-blue-500">
                    <FaPen />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => deleteCard(card.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {
          <div className="mt-4 w-72 px-4 py-3 flex flex-col gap-4 shadow-sm bg-gray-50 rounded-lg border border-gray-200">
            <input
              type="text"
              placeholder="Enter task title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleAddSubTask}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add Task
            </button>
          </div>
        }
      </main>
    </>
  );
};
export default Project;