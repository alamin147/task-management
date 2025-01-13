import { FaClock, FaCheckCircle, FaDoorOpen } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";
import { TbLayoutListFilled } from "react-icons/tb";
import { ReactNode, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import { getUserInfo, signOut } from "../auth/utils/authUlits";
import CreateTask from "../createTask/CreateTask";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }: { children?: ReactNode }) => {
  const user = getUserInfo();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleSignOut = () => {
    signOut();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

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
    <Layout className=" min-h-[100vh] overflow-hidden">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical text-white">logo</div>
        <div className="flex flex-col h-full justify-between">
          <div>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={["1"]}
              items={navItems}
            />
          </div>
          <div className="mb-8 mx-0.5">
            <Button
              type="primary"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleSignOut}
              style={{
                border: "none",
              }}
            >
              <FaDoorOpen color="white" size={20} />
              {!collapsed && <span>Sign Out</span>}
            </Button>
          </div>
        </div>
      </Sider>
      <Layout>
        <Header
          className="bg-gray-600"
          style={{
            padding: "0 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div>
            <Button
              className="bg-[#3aafae]"
              type="primary"
              onClick={() => setOpenModal(true)}
              style={{ marginRight: 16 }}
            >
              Create Task
            </Button>
          </div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
            className="me-5 text-white"
          >
            {user ? `Welcome, ${user.name}!` : "Welcome to Task Manager"}
          </div>
        </Header>

        <Content
          className="bg-gray-700  border-t border-t-gray-700"
          style={{
            minHeight: 280,
          }}
        >
          <CreateTask openModal={openModal} setOpenModal={setOpenModal} />
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
