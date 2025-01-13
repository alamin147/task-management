import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const PrivateRoute = ({ children }: { children: any }) => {
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    if (!token) {
      toast.error("Please Login!", { id: "login-error" });
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
