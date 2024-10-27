import { getUserInfo } from "../components/auth/utils/authUlits";
import Rightsidebar from "../components/rightSidebar/RightSidebar";

const SidebarProvider = () => {
  const user = getUserInfo();
  return <>{user && <Rightsidebar user={user} />}</>;
};
export default SidebarProvider;
