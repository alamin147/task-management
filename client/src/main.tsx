import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import RegisterPage from "./register/Register.tsx";
import LoginPage from "./login/Login.tsx";
import TaskDynamicStatus from "./pages/taskDynamicStatus/taskDynamicStatus.tsx";
import Project from "./pages/project/Project.tsx";
import MainLayout from "./components/layout/MainLayout.tsx";
import PrivateRoute from "./routes/PrivateRoute.tsx";
import AdminRoute from "./routes/AdminRoute.tsx";
import ShareTasks from "./pages/sharePage/ShareTasks.tsx";
import ProfileEdit from "./pages/profilePage/ProfileEdit.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
// Import APIs to ensure they are loaded
import "./redux/api/index.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute children=<MainLayout children=<App /> /> />,
    errorElement: <h1>Error</h1>,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/:status",
    element: (
      <PrivateRoute children=<MainLayout children=<TaskDynamicStatus /> /> />
    ),
  },
  {
    path: "/shared",
    element: <PrivateRoute children=<MainLayout children=<ShareTasks /> /> />,
  },
  {
    path: "/project/:taskId",
    element: <PrivateRoute children=<MainLayout children=<Project /> /> />,
  },
  {
    path: "/profile-edit",
    element: <PrivateRoute children=<MainLayout children=<ProfileEdit /> /> />,
  },
  {
    path: "/admin",
    element: <AdminRoute children=<MainLayout children=<AdminDashboard /> /> />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Toaster />
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router}></RouterProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
