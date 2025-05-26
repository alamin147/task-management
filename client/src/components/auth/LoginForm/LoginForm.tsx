import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../../../redux/features/auth/authApi";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { setUser } from "../../../redux/features/auth/authSlice";
import { useDispatch } from "react-redux";

interface IFormInput {
  email: string;
  password: string;
}

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      email: "aabcd@gm.c",
      password: "123456",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);
  const [loginUser] = useLoginUserMutation();
  const dispatch = useDispatch();

  const onSubmit = async (data: IFormInput) => {
    try {
      const res: any = await loginUser(data).unwrap();
      if (res && res.token) {
        const token = res.token;

        let decoded;
        try {
          decoded = jwtDecode(token);
        } catch (err) {
          console.error("Failed to decode token:", err);
          toast.error("Invalid token received");
          return;
        }
        navigate("/");
        dispatch(setUser({ user: decoded, token }));
        toast.success("User logged in successfully!");
      } else {
        toast.error("Login failed: No token received");

        throw new Error("Login failed: No token received");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative m-[2rem] px-10 py-14 rounded-lg bg-white w-full max-w-[520px]"
      >
        <div className="relative z-10">
          <h1 className="mb-2 text-center text-[1.35rem] font-medium">
            Login to Your Account
          </h1>
          <p className="mb-8 px-[2rem] text-center text-[#999] text-[14px]">
            Login Now. Don't have an account?{" "}
            <a
              href="/register"
              className="font-bold text-[#2ECC71] hover:text-[#7263F3] transition-all duration-300"
            >
              Register here
            </a>
          </p>

          {/* Email Field */}
          <div className="mt-[1rem] flex flex-col">
            <label htmlFor="email" className="mb-1 text-[#999]">
              Email
            </label>
            <input
              id="email"
              {...register("email", {
                required: "Email is required",
                // pattern: {
                //   value: /^[^@]+@[^@]+\.[^@]+$/,
                //   message: "Please enter a valid email",
                // },
              })}
              className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
              placeholder="johndoe@gmail.com"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className="relative mt-[1rem] flex flex-col">
            <label htmlFor="password" className="mb-1 text-[#999]">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
              placeholder="***************"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
            <button
              type="button"
              className="absolute p-1 right-4 top-[43%] text-[22px] text-[#999] opacity-45"
              onClick={togglePassword}
            >
              {showPassword ? (
                <i className="fas fa-eye-slash"></i>
              ) : (
                <i className="fas fa-eye"></i>
              )}
            </button>
          </div>
          <div className="flex">
            <button
              type="submit"
              className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-[#2ECC71] text-white rounded-md hover:bg-[#1abc9c] transition-colors"
            >
              Login Now
            </button>
          </div>
        </div>
        {/* <img src="/flurry.png" alt="" /> */}
      </form>
    </>
  );
};

export default LoginForm;
