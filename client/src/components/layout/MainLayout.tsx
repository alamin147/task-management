import { FaClock, FaCheckCircle } from "react-icons/fa";
import { FaClockRotateLeft, FaUserGroup } from "react-icons/fa6";
import { TbLayoutListFilled } from "react-icons/tb";
import { ReactNode, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Avatar, Button, Layout, Menu, Tooltip } from "antd";
import { getUserInfo } from "../auth/utils/authUlits";
import CreateTask from "../createTask/CreateTask";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileMenu from "../profileMenu/ProfileMenu";
const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }: { children?: ReactNode }) => {
  const user = getUserInfo();
  // console.log(user)
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openModal, setOpenModal] = useState(false);

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
    {
      key: "5",
      icon: <FaUserGroup />,
      label: "Shared with me",
      link: "/shared",
    },
  ];

  const getSelectedKey = () => {
    const currentPath = location.pathname;
    const matchedItem = navItems.find((item) => item.link === currentPath);
    return matchedItem ? matchedItem.key : "1";
  };
  const [openProfileSetting, setOpenProfileSetting] = useState(false);
  const hendleProfileModal = () => {
    setOpenProfileSetting(!openProfileSetting);
  };
  return (
    <>
      <Layout className=" min-h-[100vh] overflow-hidden">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="mb-5 bg-gradient-to-r from-green-400 to-green-600 py-1">
            <div className=" text-white ms-5 my-5 font-bold text-lg">
              {collapsed?"TM":"Task Management"}
            </div>    
          </div>
          <div className="flex flex-col gap-32">
            <div className="">
              <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={["1"]}
                selectedKeys={[getSelectedKey()]}
                items={navItems.map((item) => ({
                  key: item.key,
                  icon: item.icon,
                  label: item.label,
                  onClick: () => {
                    navigate(item.link);
                  },
                }))}
              />
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
                className="bg-custom-green text-white rounded-md hover:bg-[#1abc9c] transition-colors"
                type="primary"
                onClick={() => setOpenModal(true)}
                style={{ marginRight: 16 }}
              >
                Create Task
              </Button>
            </div>
            <div></div>
            <div className="flex items-center justify-center gap-3">
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
                className=" text-white"
              >
                {user ? `Welcome, ${user.name}!` : "Welcome to Task Manager"}
                {openProfileSetting && <ProfileMenu />}
              </div>
              <Tooltip title={user?.name}>
                {user?.photo ? (
                  <Avatar
                    onClick={hendleProfileModal}
                    className="cursor-pointer"
                    size="large"
                    src={user?.photo}
                  />
                ) : (
                  <Avatar
                    size="large"
                    onClick={hendleProfileModal}
                    style={{ backgroundColor: "#f56a00" }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                )}
              </Tooltip>
            </div>
          </Header>

          <Content
            onClick={() => setOpenProfileSetting(false)}
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
    </>
  );
};

export default MainLayout;
