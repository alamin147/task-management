import { useState } from "react";
import { Menu } from "antd";
import type { GetProp, MenuProps } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { FaDoorOpen, FaTasks, FaUserEdit, FaUsers } from "react-icons/fa";
import { signOut } from "../auth/utils/authUlits";
import toast from "react-hot-toast";

type MenuTheme = GetProp<MenuProps, "theme">;

type MenuItem = GetProp<MenuProps, "items">[number];

const items: MenuItem[] = [
  {
    key: "/",
    icon: <FaTasks />,
    label: "My Tasks",
  },
  {
    key: "/edit-profile",
    icon: <FaUserEdit />,
    label: "Edit Profile (create page)",
  },

  {
    key: "/shared",
    icon: <FaUsers />,
    label: "Shared Tasks",
  },
  {
    key: "/sign-out",
    icon: <FaDoorOpen />,
    label: "Sign Out",
  },
];

const ProfileMenu = () => {
  const [mode] = useState<"vertical" | "inline">("inline");
  const [theme] = useState<MenuTheme>("dark");
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className="absolute top-16 right-0.5 rounded-lg z-50">
      <Menu
        style={{ width: 256, borderRadius: 11 }}
        mode={mode}
        theme={theme}
        items={items}
        onClick={handleMenuClick}
        selectedKeys={[location.pathname]}
      />
    </div>
  );
};

export default ProfileMenu;
