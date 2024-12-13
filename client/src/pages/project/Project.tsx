import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetSingleTaskQuery } from "@/redux/features/tasks/tasksApi";
import { useCreateSubTaskMutation } from "@/redux/features/subtask/subtaskApi";
import { useCreateMiniTaskMutation } from "@/redux/features/minitask/minitaskApi";
import "./project.css";

const Project = () => {
  const { taskId } = useParams();
  const { data } = useGetSingleTaskQuery(taskId as string);
  const [createSubTask] = useCreateSubTaskMutation();
  const [createMiniTask] = useCreateMiniTaskMutation();

  const [newTitle, setNewTitle] = useState("Untitled subtask");

  const handleAddSubTask = async () => {
    try {
      await createSubTask({ taskId, title: newTitle });
      setNewTitle("Untitled subtask");
    } catch (err) {
      console.error("Failed to create subtask:", err);
    }
  };

  // State for each subtask's mini task input
  const [miniTaskInputs, setMiniTaskInputs] = useState<{
    [key: string]: string;
  }>({});

  const handleAddMiniTask = async (id: string) => {
    const miniTaskTitle = miniTaskInputs[id] || "Untitled mini task";
    try {
      await createMiniTask({ subtaskId: id, title: miniTaskTitle });
      setMiniTaskInputs((prev) => ({ ...prev, [id]: "" })); // Clear the input for this specific subtask
    } catch (err) {
      console.error("Failed to create mini task:", err);
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setMiniTaskInputs((prev) => ({ ...prev, [id]: value })); // Update input for this specific subtask
  };

  const deleteCard = (id: any) => {
    console.log("deleted", id);
  };

  return (
    <>
      <main className="m-6 overflow-hidden">
       
        {/* Horizontally scrollable container */}
       <div className="overflow-x-auto">
       <div className=" pb-8 mt-6 flex gap-6"
        style={{ height: 'calc(100vh - 140px)' }}>
          {data?.task?.subcards?.map((card: any, i: number) => (
            //  First Card Section
          <div>
              <div className=" bg-white rounded-lg shadow-md w-72 p-4 border border-gray-200">
              <div className="w-64 mb-4 p-3 bg-gray-50 rounded-lg shadow-sm">
                <div className="flex gap-2 mb-2">
                  <span className="block w-5 h-1 bg-red-500 rounded"></span>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {card?.title}
                </h3>
              </div>

              {/*  */}
              <div className="bg-gray-50 rounded-lg shadow-sm">
                {/* dynamic card here */}

                <div className="space-y-2 ">
                  {data?.task?.subcards[i]?.miniTasks?.map((minicard: any) => (
                    <div
                      key={minicard._id}
                      className={`p-3 rounded-lg shadow-md ${minicard.color}`}
                    >
                      {minicard.title}
                    </div>
                  ))}
                  </div>
              </div>
              {/* add btn  */}
              <div className="mt-6 w-64 mb-4 p-3  rounded-md shadow-md">
                <div className="">
                  <input
                    type="text"
                    placeholder="Add inside mini task..."
                    value={miniTaskInputs[card._id] || ""}
                    onChange={(e) =>
                      handleInputChange(card._id, e.target.value)
                    }
                    className="w-full px-3 py-2 text-black rounded-md shadow-md hover:bg-gray-50  active:border-none"
                  />
                  <button
                    onClick={() => handleAddMiniTask(card._id)}
                    className="mt-2 w-full bg-gray-100 hover:bg-gray-300 text-black px-3 py-2 rounded-lg shadow-md"
                  >
                    Add mini task
                  </button>
                </div>
              </div>
            </div>
          </div>
          ))}
          {/* end of Card Section */}

          {/* Add subtask card */}
          <div className="w-72 h-40 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex-shrink-0 rounded-lg flex flex-col justify-between">
            <input
              type="text"
              placeholder="Add sub task..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="px-3 py-2 rounded-md text-black"
            />
            <button
              onClick={handleAddSubTask}
              className=" w-full bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-lg mt-2"
            >
              Add sub task
            </button>
          </div>
        </div>
       </div>
      </main>
    </>
  );
};

export default Project;
