import { useForm } from "react-hook-form";
import SelectField from "./SelectField";
import { useState } from "react";
import { useShareSingleTaskMutation } from "@/redux/features/tasks/tasksApi";
import toast from "react-hot-toast";

const ShareModal = ({
  taskId,
  users,
  setOpenModal,
}: {
  taskId: any;
  users: any;
  setOpenModal: any;
}) => {
  const [shareSingleTask, {}] = useShareSingleTaskMutation();
  const [value, setValue] = useState([]);
  const { handleSubmit } = useForm();
  const onSubmit = async () => {
    if (value.length) {
      let user = [];
      user = value?.map((i: any) => {
        return i.value;
      });
      // console.log("data:", users);
      const res = await shareSingleTask({ taskId, user });
      // console.log({ res });
      if (res?.data?.status == 200) {
        toast.success(res?.data?.message);
      } else {
        toast.error(res?.data?.message || "Failed to share");
      }
    }

    setOpenModal(false);
  };

  return (
    <>
      <div className="fixed left-0 top-0 z-50 h-full w-full bg-[#333]/30 overflow-hidden">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="py-5 px-6 max-w-[520px] w-full fex flx-col gap-3 bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md"
        >
          {/* Close button */}

          <div className="mt-5 mb-10 flex flex-row-reverse items-center justify-between">
            <button
              type="button"
              className="absolut top-2 right-2 text-white bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => setOpenModal(false)}
            >
              &times;
            </button>

            <h1 className="absoute top-2 left-2 text-2xl font-bold text-center ">
              Share this task with
            </h1>
          </div>

          {/* <Search
            placeholder="input search text"
            allowClear
            enterButton
            size="large"
            onSearch={handleSearch}
          /> */}

          <SelectField users={users} setValues={setValue} />
          {/* Submit Button */}
          <div className="mt-8 flex justify-end items-center gap-3">
            <button
              type="submit"
              className="px-8 py-3 border border-[#3aafae] text-black rounded-[50px]
            hover:bg-[#3aafae] hover:text-white transition-all duration-200 ease-in-out "
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-[#3aafae] text-white rounded-[50px]
            hover:bg-[#00A1F1] hover:text-white transition-all duration-200 ease-in-out "
            >
              Share
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ShareModal;
