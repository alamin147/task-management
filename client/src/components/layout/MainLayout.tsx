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
  const [openProfileSetting, setOpenProfileSetting] = useState(false);

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

  const hendleProfileModal = (e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (e) e.stopPropagation();
    setOpenProfileSetting(!openProfileSetting);
  };

  return (
    <>
      <Layout className="min-h-[100vh] overflow-hidden">
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="bg-custom-sidebar transition-all duration-300"
          style={{ boxShadow: '2px 0 10px rgba(0,0,0,0.1)' }}
        >
          <div className="mb-5 bg-gradient-to-r from-custom-green to-custom-green-dark py-2 md:py-3 shadow-md">
            <div className="text-white ms-2 md:ms-5 my-2 md:my-3 font-bold text-lg md:text-xl flex items-center justify-center md:justify-start">
              {collapsed ? (
                <span className="text-xl md:text-2xl flex items-center justify-center">
                  📋
                </span>
              ) : (
                <>
                  <span className="text-xl md:text-2xl mr-2">📋</span>
                  <span className="hidden md:block">Task Management</span>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-32">
            <div>
              <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={["1"]}
                selectedKeys={[getSelectedKey()]}
                style={{ backgroundColor: 'var(--custom-sidebar, #0e3326)' }}
                className="border-r-0"
                items={navItems.map((item) => ({
                  key: item.key,
                  icon: item.icon,
                  label: item.label,
                  onClick: () => navigate(item.link),
                }))}
              />
            </div>
          </div>
        </Sider>
        <Layout>
          <Header
            className="bg-custom-header px-3 md:px-4"
            style={{
              padding: "0 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              overflow: 'hidden'
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 48,
                height: 48,
                color: 'white'
              }}
              className="hover:bg-custom-green-dark transition-colors"
            />

            <div className="hidden sm:block">
              <Button
                className=" bg-custom-green text-white rounded-md hover:bg-custom-green-hover transition-colors border-none flex items-center gap-2 text-base h-10"
                type="primary"
                onClick={() => setOpenModal(true)}
                style={{ marginRight: 16, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
              >
                <span className="text-lg">+</span> Create Task
              </Button>
            </div>

            {/* Mobile create task button */}
            <div className="sm:hidden">
              <Button
                className="bg-custom-green text-white rounded-full hover:bg-custom-green-hover transition-colors border-none flex items-center justify-center w-10 h-10"
                type="primary"
                onClick={() => setOpenModal(true)}
                style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
              >
                <span className="text-lg">+</span>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 md:gap-4 relative">
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: "500",
                }}
                className="text-white relative"
              >
                <span className="">
                  {user ? `Welcome, ${user.name}!` : "Welcome to Task Manager"}
                </span>
              </div>
                {user?.photo ? (
                  <Avatar
                    onClick={hendleProfileModal}
                    className="cursor-pointer border-2 border-custom-green-light"
                    size="large"
                    src={user?.photo}
                  />
                ) : (
                  <Avatar
                    size="large"
                    onClick={hendleProfileModal}
                    style={{
                      backgroundColor: "var(--custom-green-dark, #27ae60)",
                      borderColor: "white",
                      borderWidth: "2px",
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}
                    className="cursor-pointer"
                  >
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                )}
            </div>
              {openProfileSetting && <ProfileMenu />}
          </Header>

          <Content
            onClick={() => setOpenProfileSetting(false)}
            className="bg-custom-bg border-t border-t-custom-green-light"
            style={{
              minHeight: 280,
              padding: "12px",
              borderRadius: "10px",
              boxShadow: "inset 0 2px 5px rgba(0,0,0,0.05)",
              overflowX: "hidden"
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
