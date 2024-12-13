import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../auth/utils/authUlits";
import { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout,theme } from "antd";
import { useCreateTaskMutation } from "@/redux/features/tasks/tasksApi";

const { Header } = Layout;

const Headers = ({ openModal ,setOpenModal }: { setOpenModal: any , openModal:any}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [collapsed, setCollapsed] = useState(false);
  const [createTask] = useCreateTaskMutation();
  const user = getUserInfo();
  const router = useNavigate();
;

  return (
    <>
      <Header
        style={{
          padding: "0 16px",
          background: colorBgContainer,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
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
            color: "rgba(0, 0, 0, 0.85)",
          }}
          className="me-5"
        >
          {user ? `Welcome, ${user.name}!` : "Welcome to Task Manager"}
        </div>
      </Header>
    </>
  );
};

export default Headers;
