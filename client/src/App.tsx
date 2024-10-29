import "./App.css";
import Filters from "./components/filter/Filters";
import { motion } from "framer-motion";

import { useGetTasksQuery } from "./redux/features/tasks/tasksApi";
import TaskItem from "./components/taskItem/TaskItem";
import { TTask } from "./types/types";

function App() {
  const { data, isLoading } = useGetTasksQuery(undefined);

  // console.log(user);
  console.log(data, isLoading);
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
            className="pb-[2rem] mt-6 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[1.5rem]"
            // variants={container}
            initial="hidden"
            animate="visible"
          >
            {data?.tasks?.map((task:TTask, i: number) => (
              <TaskItem key={i} task={task} />
            ))}
            {/* <motion.button
              className="h-[16rem] w-full py-2 rounded-md text-lg font-medium text-gray-500 border-dashed border-2 border-gray-400
        hover:bg-gray-300 hover:border-none transition duration-200 ease-in-out"
              // onClick={openModalForAdd}
              // variants={item}
            >
              Add New Task
            </motion.button> */}
          </motion.div>
        </main>
      )}
    </>
  );
}

export default App;
