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
import Layout from "./components/layout/Layout.tsx";
import Completed from "./pages/completed/Completed.tsx";
import Due from "./pages/due/Due.tsx";
import Pending from "./pages/pending/Pending.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout children=<App /> />,
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
    path: "/completed",
    element: <Layout children=<Completed /> />,
  },
  {
    path: "/pending",
    element: <Layout children=<Due /> />,
  },
  {
    path: "/due",
    element: <Layout children=<Pending /> />,
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
