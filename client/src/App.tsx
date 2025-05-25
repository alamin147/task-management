import "./App.css";
import { motion, AnimatePresence } from "framer-motion";
import { useGetTasksQuery } from "./redux/features/tasks/tasksApi";
import TaskItem from "./components/taskItem/TaskItem";
import { TTask } from "./types/types";
import { Select, Tooltip } from "antd";
import { useState } from "react";

const App = () => {
  const { data, isLoading } = useGetTasksQuery(undefined);
  const [filter, setFilter] = useState<string>("all");

  const handleChange = (value: string) => {
    setFilter(value);
    // console.log(`selected ${value}`);
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
        <div className="flex items-center justify-center h-[80vh]">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-custom-green rounded-full animate-spin"></div>
        </div>
      ) : (
        <main className="m-6 h-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-custom-green-dark mb-4 sm:mb-0">
              <span className="border-b-4 border-custom-green pb-1">All Tasks</span>
            </h1>

            <Tooltip title="Filter by Priority" color="green">
              <Select
                placeholder="Filter by Priority"
                style={{ width: 160 }}
                onChange={handleChange}
                defaultValue="all"
                options={options}
                className="rounded-md shadow-sm border-custom-green-light"
                allowClear
              />
            </Tooltip>
          </div>

          <motion.div
            className="pb-8 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-x-auto"
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

export default App;
