import { ReactNode } from "react";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";
import ContentProvider from "../../provider/ContentProvider";
import SidebarProvider from "../../provider/SidebarProvider";
import MainLayout from "./MainLayout";


const Layout = ({ children }: { children: ReactNode }) => {


  return (
    <>
      <div className="h-full flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <ContentProvider>
            <MainLayout>{children}</MainLayout>
            <SidebarProvider />
          </ContentProvider>
        </div>
      </div>
      {/* {children} */}
    </>
  );
};
export default Layout;
