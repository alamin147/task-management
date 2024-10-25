import { useUserVerification } from "../Components/auth/utils/authUlits";
import Rightsidebar from "../Components/rightSidebar/Rightsidebar";

const SidebarProvider = () => {


    const user = useUserVerification()
    return <>{user && <Rightsidebar />}</>;

}
export default SidebarProvider;


