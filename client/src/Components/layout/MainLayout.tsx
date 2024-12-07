import { ReactNode, useState } from "react";
import { Layout } from "antd";
import { useForm } from "react-hook-form";
import Headers from "../header/Header";
import CreateTask from "../createTask/CreateTask";
import LeftSideBar from "../leftsidebar/LeftSideBar";

const { Content } = Layout;

const MainLayout = ({ children }: { children?: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    formState: {},
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: "low",
      dueDate: "",
      completed: "false",
    },
  });

  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        {/* sidebar */}
        <LeftSideBar />
        <Layout>
          <Headers openModal={isModalOpen} setOpenModal={setIsModalOpen} />
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: "#fff",
            }}
          >
            <CreateTask openModal={isModalOpen} setOpenModal={setIsModalOpen} />
            {/* content here */}
            Content
            {children}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default MainLayout;
