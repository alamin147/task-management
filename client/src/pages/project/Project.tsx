import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetSingleTaskQuery } from "@/redux/features/tasks/tasksApi";
import { useCreateSubTaskMutation } from "@/redux/features/subtask/subtaskApi";
import { useCreateMiniTaskMutation } from "@/redux/features/minitask/minitaskApi";

const Project = () => {
  const { taskId } = useParams();
  const { data } = useGetSingleTaskQuery(taskId as string);
  const [createSubTask] = useCreateSubTaskMutation();
  const [createMiniTask] = useCreateMiniTaskMutation();

  // console.log({data});
  const [newTitle, setNewTitle] = useState("Untitled subtask");

  const handleAddSubTask = async () => {
    try {
      await createSubTask({ taskId, title: newTitle });
      setNewTitle("Untitled subtask");
    } catch (err) {
      console.error("Failed to create subtask:", err);
    }
  };



const [newTask, setNewTask] = useState("Untitled mini task");
  const handleAddMiniTask = async (id) => {

    console.log(id, newTask);
    try {
      await createMiniTask({ subtaskId:id, title: newTask });
      setNewTask("Untitled mini task");
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
          <h2 className="text-2xl font-bold"> {data?.task?.title}</h2>
        </div>

        <div className="pb-8 mt-6 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          {data?.task?.subcards?.map((card: any, i: number) => (
            <div  key={card._id} title={card._id} className="bg-gradient-to-r from-slate-500 to-slate-500 p-6 text-white rounded-lg max-w-sm">
              <h1 className="text-lg font-bold mb-4">{card?.title}</h1>
              <div className="space-y-2">
                {data?.task?.subcards[i]?.miniTasks?.map((minicard) => (
                  <div
                    key={minicard._id}
                    className={`p-3 rounded-lg shadow-md ${minicard.color}`}
                  >
                    {minicard.title}
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Add inside mini task..."
                  // value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="w-full px-3 py-2 text-black rounded-md"
                />
                <button 
                onClick={() => handleAddMiniTask(card._id)}
                className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg">
                  Add mini task
                </button>
              </div>
            </div>
          ))}

          <div className="mt-4">
            <input
              type="text"
              placeholder="Add sub task..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 text-black rounded-md"
            />
            <button
              onClick={handleAddSubTask}
              className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
            >
              Add sub task
            </button>
          </div>
        </div>
      </main>
    </>
  );
};
export default Project;
