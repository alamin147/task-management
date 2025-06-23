import { useState } from "react";
import { Menu } from "antd";
import type { GetProp, MenuProps } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { FaDoorOpen, FaTasks, FaUserEdit, FaUsers } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { signOut, getUserInfo } from "../auth/utils/authUlits";
import toast from "react-hot-toast";

type MenuTheme = GetProp<MenuProps, "theme">;

type MenuItem = GetProp<MenuProps, "items">[number];

const ProfileMenu = () => {
  const [mode] = useState<"vertical" | "inline">("inline");
  const [theme] = useState<MenuTheme>("dark");
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserInfo();

  // Create dynamic menu items based on user role
  const menuItems: MenuItem[] = [
    {
      key: "/",
      icon: <FaTasks />,
      label: "My Tasks",
    },
    {
      key: "/profile-edit",
      icon: <FaUserEdit />,
      label: "Edit Profile",
    },
    {
      key: "/shared",
      icon: <FaUsers />,
      label: "Shared Tasks",
    },
    // Only show admin dashboard for admin users
    ...(user?.role === "admin" ? [
      {
        key: "/admin",
        icon: <MdAdminPanelSettings />,
        label: "Admin Dashboard",
      }
    ] : []),
    {
      key: "/sign-out",
      icon: <FaDoorOpen />,
      label: "Sign Out",
    },
  ];

  const handleMenuClick = (e: { key: string }) => {
    if (e.key === "/sign-out") {
      signOut();
      toast.success("Logged out successfully!");
      navigate("/login");
      return;
    }
    navigate(e.key);
  };

  return (
    <div
      className="fixed md:absolute top-14 sm:top-16 right-2 sm:right-0 rounded-lg z-50 shadow-xl animate-fadeIn"
      onClick={(e) => e.stopPropagation()}
    >
      <Menu
        style={{
          borderRadius: 8,
          width: 'auto',
          minWidth: '180px',
          backgroundColor: 'var(--custom-sidebar, #0e3326)',
        }}
        className="w-48 sm:w-56 lg:w-64"
        mode={mode}
        theme={theme}
        items={menuItems}
        onClick={handleMenuClick}
        selectedKeys={[location.pathname]}
      />
    </div>
  );
};

export default ProfileMenu;
