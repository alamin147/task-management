import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { TUser } from "@/types/types";
import { getUserInfo } from "@/components/auth/utils/authUlits";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useSelector((state: any) => state.auth);
  const user = getUserInfo();
  // Check if user exists and has admin role
  if (!token) {
    toast.error("You need to login first!", { id: "admin-login-error" });
    return <Navigate to="/login" replace />;
  }

  // Verify user has admin role
  const currentUser = user as TUser;
  if (currentUser?.role !== "admin") {
    toast.error("Admin access required", { id: "admin-access-error" });
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
