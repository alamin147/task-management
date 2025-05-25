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
  const [updateUser] = useUpdateUserMutation();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name,
      bio: user?.bio,
    },
  });
  const [isPreview, setIsPreview] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState(user?.photo || null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size exceeds 5MB limit.");
            return;
        }
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

    const datas: any = {};
    if (data.name) datas.name = data.name;
    if (data.bio) datas.bio = data.bio;

    if (datas) formData.append("data", JSON.stringify(datas));

    if (imageFile) {
      formData.append("img", imageFile);
    }

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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative max-w-[90%] max-h-[90%] rounded-lg shadow-2xl">
            <button
              onClick={() => setIsPreview(false)}
              className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 p-2 rounded-full transition-colors focus:outline-none"
            >
              <RxCross2 size={22} />
            </button>
            <img
              className="w-full h-full object-contain rounded-lg max-h-[90vh]"
              src={uploadedImagePreview ? uploadedImagePreview : user?.photo}
              alt="Profile preview"
            />
          </div>
        </motion.div>
      )}
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Edit Profile</h1>
          <p className="text-gray-500 mt-1">Customize your profile information</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-0">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Photo Section */}
            <div className="mb-6 relative">
              <div className="relative w-52 h-52 mx-auto md:mx-0">
                {uploadedImagePreview || user?.photo ? (
                  <>
                    <img
                      className="w-full h-full rounded-full object-cover border-4 border-gray-100 shadow-md"
                      src={uploadedImagePreview || user?.photo}
                      alt="Profile"
                    />
                  </>
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-4xl font-bold shadow-inner">
                    <Avatar className="w-full h-full rounded-full">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </Avatar>
                  </div>
                )}

                {/* Hover effect for image upload */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full">
                  <label
                    htmlFor="imageUpload"
                    className="cursor-pointer flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-lg"
                  >
                    <FaPlus size={24} />
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

              <div className="text-center md:text-left mt-4">
                <Tooltip placement="top" title="Can upload one image only">
                  <p className="text-xs text-gray-500 mb-2">Maximum size: 5MB</p>
                </Tooltip>

                {(uploadedImagePreview || user?.photo) && (
                  <button
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                    type="button"
                    onClick={() => setIsPreview(true)}
                  >
                    Preview Full Image
                  </button>
                )}
              </div>
            </div>

            {/* Form Fields Section */}
            <div className="flex-1">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    {...register("name")}
                    className="w-full px-4 py-3 border rounded-lg bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    defaultValue={user?.name}
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border rounded-lg bg-gray-50 cursor-not-allowed text-gray-600 focus:outline-none"
                    value={user?.email}
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500">Email address cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    {...register("bio")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg min-h-32 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    defaultValue={user?.bio || ""}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="pt-3">
                  {sendBtn ? (
                    <button
                      type="submit"
                      className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium cursor-not-allowed opacity-80"
                      disabled
                    >
                      <Spin size="small" className="mr-2" /> Updating...
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                    >
                      Update Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileSettings;
