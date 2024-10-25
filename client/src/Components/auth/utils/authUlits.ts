import { jwtDecode } from "jwt-decode";
// import { decodedUser } from "../types/types";
import { useEffect, useState } from "react";

// const redirect = useNavigate();

export const getUserLocalStorage = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    const token = localStorage.getItem("persist:auth");
    if (!token) return null;

    // console.log(token);
    return JSON.parse(token);
  }
  return null;
};

export const verifyToken = (token: string) => {
  const decodedUser = jwtDecode(token);
  return decodedUser;
};

export const useUserVerification = () => {
  const [user, setUser] = useState<TUser | null>(null);

  useEffect(() => {
    const token = getUserLocalStorage();
    const pasrsedToken = JSON.parse(token.token);
    // console.log()
    setUser(pasrsedToken);
  }, []);

  return user;
};

// export const signOut: any = () => {
//   if (typeof window !== "undefined" && window.localStorage) {
//     localStorage.removeItem("persist:auth");
//     // redirect("/");
//   }
// };

// const router = useRouter()
//   const user: any  = useUserVerification();
//   console.log(user.role);
//   if(user?.role=="USER"){
//    removeUserLocalStorage()
//   }
