import { Layout, Menu } from "antd";
import { useState } from "react";
import { FaClock, FaCheckCircle } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";
import { TbLayoutListFilled } from "react-icons/tb";
const { Sider, Content } = Layout;

const LeftSideBar = () => {
  const [collapsed] = useState(false);

  const navItems = [
    {
      key: "1",
      icon: <TbLayoutListFilled />,
      label: "All",
      link: "/",
    },
    {
      key: "2",
      icon: <FaCheckCircle />,
      label: "Completed",
      link: "/completed",
    },
    {
      key: "3",
      icon: <FaClock />,
      label: "Pending",
      link: "/pending",
    },
    {
      key: "4",
      icon: <FaClockRotateLeft />,
      label: "Overdue",
      link: "/due",
    },
  ];

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={navItems}
      />
    </Sider>
  );
};
export default LeftSideBar;
