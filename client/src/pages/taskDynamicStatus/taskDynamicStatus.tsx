import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGetTasksQuery } from "../../redux/features/tasks/tasksApi";
import TaskItem from "../../components/taskItem/TaskItem";
import { TTask } from "../../types/types";
import { Select, Tooltip } from "antd";
import { useEffect, useState } from "react";
const TaskDynamicStatus = () => {
  const { status } = useParams();

  const { data, isLoading } = useGetTasksQuery(status);
  const [filter, setFilter] = useState<string>("all");
  useEffect(() => {
    setFilter("all");
  }, [status]);

  const handleChange = (value: string) => {
    setFilter(value);
  };

  type ft = {
    value: string;
    label: string;
  };

  const options: ft[] = [
    {
      value: "all",
      label: "All",
    },
    {
      value: "low",
      label: "Low",
    },
    {
      value: "medium",
      label: "Medium",
    },
    {
      value: "high",
      label: "High",
    },
  ];
  const filteredTasks =
    filter === "all"
      ? data?.tasks
      : data?.tasks?.filter((task: TTask) => task.priority === filter);
  return (
    <>
      {isLoading ? (
        <div className="relative top-1/2 left-1/2 w-12 h-12 border-4 border-t-4 border-gray-300 border-t-[#3aafae] rounded-full animate-spin"></div>
      ) : (
        <main className="m-6 h-full">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">
              {status && status?.charAt(0).toUpperCase() + status?.slice(1)}{" "}
              Tasks
            </h1>

            <Tooltip title="Filter by Priority" color="green">
              <Select
                placeholder="Priority"
                style={{ width: 120 }}
                onChange={handleChange}
                defaultValue="all"
                options={options}
                allowClear
              />
            </Tooltip>
          </div>

          <motion.div
            className="pb-[2rem] mt-6 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap- overflow-x-auto"
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {filteredTasks?.map((task: TTask) => (
                <TaskItem key={task._id} task={task} />
              ))}
            </AnimatePresence>
          </motion.div>
        </main>
      )}
    </>
  );
};
export default TaskDynamicStatus;
