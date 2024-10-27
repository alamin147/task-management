import { ReactNode } from "react";
import './mainlayout.css'
const MainLayout = ({ children }: { children: ReactNode }) => {
  return <div className="main-layout flex-1 bg-[#EDEDED] border-2 border-white rounded-[1.5rem] overflow-auto">{children}</div>;
};
export default MainLayout;
