import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetSingleTaskQuery } from "@/redux/features/tasks/tasksApi";
import { useCreateSubTaskMutation } from "@/redux/features/subtask/subtaskApi";
import { useCreateMiniTaskMutation } from "@/redux/features/minitask/minitaskApi";
import { FaPencil } from "react-icons/fa6";
import "./project.css";
import MiniTaskModal from "@/components/miniTaskModal/MiniTaskModal";
import { Tooltip } from "antd";
import SubCardTaskModal from "@/components/subCardModal/SubCardTaskModal";
import { FaClock } from "react-icons/fa";
import { PiDotsSixVertical } from "react-icons/pi";

const Project = () => {
  const { taskId } = useParams();
  const { data } = useGetSingleTaskQuery(taskId as string);
  const [createSubTask] = useCreateSubTaskMutation();
  const [createMiniTask] = useCreateMiniTaskMutation();

  // console.log(data)
  const [miniTaskModal, setMiniTaskModal] = useState(false);
  const [selectedMiniTask, setSelectedMiniTask] = useState<any>(null);
  const [selectedSubTask, setSelectedSubTask] = useState<any>(null);
  const [newTitle, setNewTitle] = useState("Untitled subtask");

  const handleAddSubTask = async () => {
    try {
      await createSubTask({ taskId, title: newTitle });
      setNewTitle("Untitled subtask");
    } catch (err) {
      console.error("Failed to create subtask:", err);
    }
  };

  const [miniTaskInputs, setMiniTaskInputs] = useState<{
    [key: string]: string;
  }>({});

  const handleAddMiniTask = async (id: string) => {
    const miniTaskTitle = miniTaskInputs[id] || "Untitled mini task";
    try {
      await createMiniTask({ subtaskId: id, title: miniTaskTitle });
      setMiniTaskInputs((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error("Failed to create mini task:", err);
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setMiniTaskInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleOpenMiniTaskModal = (minicard: any, subcard: any) => {
    setSelectedMiniTask(minicard);
    setSelectedSubTask(subcard);
    setMiniTaskModal(true);
  };

  const [subtaskModal, setSubtaskModal] = useState(false);
  const [selectedSubTaskForSub, setSelectedSubTaskForSub] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<string | any>(null);
  const handleOpenSubTaskModal = (subcard: any, taskId: string) => {
    setSelectedSubTaskForSub(subcard);
    setSelectedTask(taskId);
    setSubtaskModal(true);
  };

  return (
    <>
      {subtaskModal && (
        <SubCardTaskModal
          onClose={() => setSubtaskModal(false)}
          subTask={selectedSubTaskForSub}
          taskId={selectedTask}
        />
      )}
      {miniTaskModal && (
        <MiniTaskModal
          onClose={() => setMiniTaskModal(false)}
          miniTaskData={selectedMiniTask}
          subTask={selectedSubTask}
        />
      )}
      <main className="m-6 overflow-hidden">
        <div className="overflow-x-auto">
          <div
            className="pb-8 mt-6 flex gap-4"
            style={{ height: "calc(100vh - 140px)" }}
          >
            {data?.task?.subcards?.map((card: any, i: number) => (
              <div key={card._id}>
                <div className="cngbg-white rounded-lg cngshadow-md w-72 p-4 cngborder cngborder-gray-200">
                  <div className="w-64 mb-4 p-3 bg-gray-50 rounded-lg shadow-sm flex items-center justify-between">
                    <PiDotsSixVertical />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {card?.title}
                    </h3>
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        handleOpenSubTaskModal(card, data?.task?._id)
                      }
                    >
                      <FaPencil />
                    </div>
                  </div>
                  <div className="cngbg-gray-50 rounded-lg shadow-sm">
                    <div className="space-y-6">
                      {data?.task?.subcards[i]?.miniTasks?.map(
                        (minicard: any) => (
                          <div
                            key={minicard._id}
                            className={` rounded-lg shadow-md bg-white flex flex-col `}
                          >
                            {minicard.img && (
                              <img
                                src={minicard.img}
                                alt={minicard.title}
                                className="w-full h-32 object-cover rounded-t-md"
                              />
                            )}

                            {/* tags */}

                            <div className="p-3 ps-2">
                              <div className="flex items-center gap-2">
                                {/* {minicard?.tags &&
                                  minicard?.tags.map((tag: any) => ( */}
                                <span
                                  // key={tag.title}
                                  className="px-[10px] py-[2px] text-[13px] font-medium rounded-md "
                                  style={{
                                    backgroundColor: "rgb(207, 250, 254)",
                                    color: "rgb(8, 145, 178)",
                                  }}
                                >
                                  tags
                                </span>
                                {/* ))} */}
                              </div>
                            </div>

                            {/* title */}

                            <div className="p-3 pt-0">
                              <div className="flex justify-between items-center">
                                <span
                                  className={`text-gray-800 font-semibold text-lg ${
                                    minicard?.completed === "completed"
                                      ? "line-through"
                                      : ""
                                  }`}
                                >
                                  {minicard.title}
                                </span>

                                <div
                                  className="cursor-pointer"
                                  onClick={() =>
                                    handleOpenMiniTaskModal(minicard, card)
                                  }
                                >
                                  <FaPencil />
                                </div>
                              </div>
                            </div>
                            <div className="p-3 pt-0">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-[13px]">
                                  {minicard?.description?.length > 30
                                    ? `${minicard.description.substring(
                                        0,
                                        30
                                      )}...`
                                    : minicard?.description}
                                </span>
                              </div>
                            </div>
                            <div className="p-3 pt-0">
                              <div className="flex justify-between items-center">
                                <Tooltip
                                  title="Due Date"
                                  color="red"
                                  key={"dd"}
                                  className=""
                                >
                                  <div className="flex items-center gap-2">
                                    <FaClock className="" size={18} />
                                    <div className="pt-0.5">
                                      {minicard?.dueDate.split("T")[0]}
                                    </div>
                                  </div>
                                </Tooltip>
                                <div className="flex gap-2 mb">
                                  {minicard?.completed == "completed" ? (
                                    <Tooltip
                                      title="Completed"
                                      color={"green"}
                                      key={"green"}
                                    >
                                      <span className="block w-5 h-1 bg-green-500 rounded"></span>
                                    </Tooltip>
                                  ) : minicard?.completed == "pending" ? (
                                    <Tooltip
                                      title="Pending"
                                      color={"red"}
                                      key={"red"}
                                    >
                                      <span className="block w-5 h-1 bg-red-500 rounded"></span>
                                    </Tooltip>
                                  ) : (
                                    <Tooltip
                                      title="In Progress"
                                      color={"yellow"}
                                      key={"yellow"}
                                    >
                                      <span className="block w-5 h-1 bg-yellow-500 rounded"></span>
                                    </Tooltip>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="cng mt-6 w-64 mb-4 p-5 rounded-md shadow-md bg-white ">
                    <input
                      type="text"
                      placeholder="Add inside mini task..."
                      value={miniTaskInputs[card._id] || ""}
                      onChange={(e) =>
                        handleInputChange(card._id, e.target.value)
                      }
                      className="w-full px-3 py-2 text-black rounded-md shadow-md hover:bg-gray-50 focus:outline-none focus:ring-0 border-none"
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
            ))}
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
