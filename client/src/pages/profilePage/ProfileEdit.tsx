import { useState } from "react";
import { Avatar, Spin, Tooltip } from "antd";
import { FaPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "@/redux/features/users/users";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/auth/authSlice";

const ProfileSettings = () => {
  const { data: user, isLoading } = useGetUserQuery(undefined);
  // useUpdateUserMutation
  const [updateUser] = useUpdateUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      name: user?.name,
      bio: user?.bio,
    },
  });
  const [isPreview, setIsPreview] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<
    string | null
  >(user?.photo || null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [sendBtn, setSendBtn] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async (data: any) => {
    setSendBtn(true);

    const formData = new FormData();

    // Check if form data fields are populated and append them
    const datas: any = {};
    if (data.name) datas.name = data.name;
    if (data.bio) datas.bio = data.bio;

    if (datas) formData.append("data", JSON.stringify(datas));

    if (imageFile) {
      formData.append("img", imageFile);
    }

    // console.dir("FormData:", formData);
    try {
      const res = await updateUser(formData).unwrap();

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
        dispatch(setUser({ user: decoded, token }));
      }

      if (res?.status == 200) toast.success(res?.message || "Profile updated");
      else toast.error(res?.message || "Failed to update profile.");
    } catch (err) {
      toast.error("Failed to update profile.");
      console.error(err);
    } finally {
      setSendBtn(false);
    }
  };
  if (isLoading)
    return (
      <Spin
        className="text-green-500 flex justify-center items-center h-screen w-full"
        size="large"
      />
    );
  return (
    <>
      {isPreview && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative max-w-[80%] max-h-[80%] rounded-lg">
            <button
              onClick={() => setIsPreview(false)}
              className="absolute top-1 right-2  text-3xl font-bold bg-transparent border-none cursor-pointer text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded-full bg-red-500"
            >
              <RxCross2 size={20} />
            </button>
            <img
              className="w-full h-full object-center rounded-lg"
              src={uploadedImagePreview ? uploadedImagePreview : ""}
              alt="uploaded image"
            />
          </div>
        </motion.div>
      )}
      <div className="max-w-7xl m-6">
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <p className="text-gray-500 mb-6">Edit your profile</p>

        <form onSubmit={handleSubmit(onSubmit)} className="p-0">
          <div className="mb-3 relative">
            <div className="relative w-52 h-52">
              {uploadedImagePreview || user?.photo ? (
                <>
                  <img
                    className="w-full h-full rounded-full object-cover"
                    src={uploadedImagePreview || user?.photo}
                    alt="Profile"
                  />
                </>
              ) : (
                <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-4xl font-bold">
                  <Avatar className="w-full h-full rounded-full">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                </div>
              )}

              {/* Hover effect for both image and avatar */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full">
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                >
                  <FaPlus />
                </label>
              </div>

              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Tooltip placement="topLeft" title="Can upload one image only" />
          </div>

          {(uploadedImagePreview || user?.photo) && (
            <button
              className="mb-1"
              type="button"
              onClick={() => setIsPreview(true)}
            >
              Preview Fullscreen
            </button>
          )}

          <div className="mb-3">
            <label className="mt-2 block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              {...register("name")}
              className="max-w-96 w-full px-4 py-2 border rounded-lg bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              defaultValue={user?.name}
            />
          </div>
          <div className="mb-3">
            <label className="mt-2 block text-sm font-medium mb-1">Email</label>
            <input
              type="text"
              className="bg-white cursor-not-allowed max-w-96 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={user?.email}
              disabled
            />
          </div>
          <div className="mb-3">
            <label className="mt-2 block text-sm font-medium mb-1">Bio</label>
            <textarea
              {...register("bio")}
              className="bg-white max-w-96 w-full px-4 py-2 border border-gray-300 rounded-lg max-h-52 min-h-32 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              defaultValue={user?.bio || ""}
            />
          </div>
          <div className="mt-5">
            {sendBtn ? (
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-lg"
                disabled
              >
                <Spin />
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-lg"
              >
                Update Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileSettings;
