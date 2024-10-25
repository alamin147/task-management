import { useUserVerification } from "../components/auth/utils/authUlits";
import Rightsidebar from "../components/rightSidebar/Rightsidebar";

const SidebarProvider = () => {


    const user = useUserVerification()
    return <>{user && <Rightsidebar />}</>;

}
export default SidebarProvider;


