import { logout } from "../../redux/features/auth/authSlice";
import Charts from "../chart/Charts";
import Profile from "../profile/Profile";
import { useDispatch } from "react-redux";

const Rightsidebar = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="w-[20rem] mt-[5rem] h-[calc(100%-5rem)] fixed right-0 top-0 bg-[#f9f9f9] flex flex-col">
      <Profile />
      <div className="mt-4 mx-6">
        <Charts />
      </div>

      <button
        className="mt-auto mb-6 mx-6 py-4 px-8 bg-[#EB4E31] text-white rounded-[50px] hover:bg-[#3aafae] transition duration-200 ease-in-out"
        onClick={handleLogout}
      >
        Log Out
      </button>
    </div>
  );
};
export default Rightsidebar;
