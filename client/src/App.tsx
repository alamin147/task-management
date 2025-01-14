import "./App.css";
import Filters from "./components/filter/Filters";
import { motion, AnimatePresence } from "framer-motion";
import { useGetTasksQuery } from "./redux/features/tasks/tasksApi";
import TaskItem from "./components/taskItem/TaskItem";
import { TTask } from "./types/types";

const App = () => {
  const { data, isLoading } = useGetTasksQuery(undefined);

  return (
    <>
      {isLoading ? (
        <div className="relative top-1/2 left-1/2 w-12 h-12 border-4 border-t-4 border-gray-300 border-t-[#3aafae] rounded-full animate-spin"></div>
      ) : (
        <main className="m-6 h-full">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">All Tasks</h1>
            <Filters />
          </div>

          <motion.div
            className="pb-[2rem] mt-6 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap- overflow-x-auto"
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {data?.tasks?.map((task: TTask) => (
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
