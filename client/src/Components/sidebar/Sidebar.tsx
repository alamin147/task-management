import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { FaClock, FaCheckCircle, FaTrash } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";
import { TbLayoutListFilled } from "react-icons/tb";
import "./sidebar.css";
import Tooltip from "../uis/customTooltip";

const Sidebar = () => {
  type TIcons = {
    icon: ReactNode;
    title: string;
    link: string;
  };

  const navItems: TIcons[] = [
    {
      icon: <TbLayoutListFilled />,
      title: "All",
      link: "/",
    },
    {
      icon: <FaCheckCircle />,
      title: "Completed",
      link: "/completed",
    },
    {
      icon: <FaClock />,
      title: "Pending",
      link: "/pending",
    },
    {
      icon: <FaClockRotateLeft />,
      title: "Overdue",
      link: "/due",
    },
  ];

  return (
    <div className="basis-[5rem] flex flex-col bg-[#f9f9f9] h-screen">
      <div className="flex items-center justify-center h-[5rem]">
        <img src="/vite.svg" className="h-28 w-28" alt="logo" />
      </div>

      <div className="mt-8 flex-1 flex flex-col items-center justify-between">
        <ul className="flex flex-col gap-10">
          {navItems.map((item, index) => (
            <li key={index} className="relative group">
              <NavLink
                id="sidebarLink"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""
                }
                to={item.link}
              >
                {item.icon}
              </NavLink>

              {/* Hover Tooltip */}
              <Tooltip title={item.title} />
            </li>
          ))}
        </ul>

        <div className="mb-[1.5rem]">
          <button className="w-12 h-12 flex justify-center items-center p-2 rounded-full group relative">
            <FaTrash color="red" />
            <Tooltip title="Delete All" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
