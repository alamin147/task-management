import { FaGithub } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../auth/utils/authUlits";
import { useState } from "react";
import CreateTask from "../createTask/CreateTask";

const Header = () => {
  const user = getUserInfo();
  const router = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      {openModal && <CreateTask setOpenModal={setOpenModal} />}
      <header className="px-6 my-4 w-full flex items-center justify-between bg-[#f9f9f9]">
        <div>
          <h1 className="text-lg font-medium">
            {user
              ? `Welcome, ${user.name} to Task manager!`
              : "Welcome to Task manager"}
          </h1>
        </div>
        <div className="h-[50px] flex items-center gap-[10.4rem]">
          <button
            className="px-8 py-3 bg-[#3aafae] text-white rounded-[50px]
          hover:bg-[#00A1F1] hover:text-white transition-all duration-200 ease-in-out"
            onClick={() => {
              if (user) {
                setOpenModal(true);
              } else {
                router("/login");
              }
            }}
          >
            {user ? "Add a new Task" : "Login / Register"}
          </button>

          <div className="flex gap-4 items-center">
            <NavLink
              to="https://github.com/Maclinz/taskfyer"
              target="_blank"
              rel="noopener noreferrer"
              className="h-[40px] w-[40px] text-purple-500 rounded-full flex items-center justify-center text-lg border-2 border-[#E6E6E6]"
            >
              <FaGithub />
            </NavLink>

            <NavLink
              to="https://github.com/Maclinz/taskfyer"
              target="_blank"
              rel="noopener noreferrer"
              className="h-[40px] w-[40px] text-purple-500 rounded-full flex items-center justify-center text-lg border-2 border-[#E6E6E6]"
            >
              <FaGithub />
            </NavLink>
            <NavLink
              to="https://github.com/Maclinz/taskfyer"
              target="_blank"
              rel="noopener noreferrer"
              className="h-[40px] w-[40px] text-purple-500 rounded-full flex items-center justify-center text-lg border-2 border-[#E6E6E6]"
            >
              <FaGithub />
            </NavLink>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
