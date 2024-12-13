import { ReactNode } from "react";
import { useUserVerification } from "../components/auth/utils/authUlits";

const ContentProvider = ({ children }: { children: ReactNode }) => {
  const user = useUserVerification();

  return (
    <div className={`${user ? "pr-[20rem]" : "pb-[1.5rem]"} flex h-full`}>
      {children}
    </div>
  );
};
export default ContentProvider;
