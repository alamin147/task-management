import { useState } from "react";
import { Flex, Radio, Tooltip } from "antd";
import { useUpdateMiniTaskMutation } from "@/redux/features/minitask/minitaskApi";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { FaPlus } from "react-icons/fa6";
const MiniTaskModal = ({
  onClose,
  miniTaskData,
}: {
  onClose: () => void;
  miniTaskData: {
    _id: string;
    title?: string;
    description?: string;
    dueDate?: string;
    img?: any;
    completed?: string;
  } | null;
}) => {
  const [updateMiniTask] = useUpdateMiniTaskMutation();

  const formattedDueDate = miniTaskData?.dueDate
    ? new Date(miniTaskData.dueDate).toISOString().split("T")[0]
    : "";

  const options = [
    { label: "Completed", value: "completed" },
    { label: "Pending", value: "pending" },
    { label: "In progress", value: "in progress" },
  ];
  const [loading, setLoading] = useState(false);
  // console.log("id ? obj",miniTaskData)
  const [taskTitle, setTaskTitle] = useState(miniTaskData?.title || "");
  const [taskDescription, setTaskDescription] = useState(
    miniTaskData?.description || ""
  );
  const [taskDueDate, setTaskDueDate] = useState(formattedDueDate);
  const [taskCompleted, setTaskCompleted] = useState(
    miniTaskData?.completed || "pending"
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<
    string | null
  >(miniTaskData?.img || null);

  // Handle Image Upload
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

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();
    const data = {
      _id: miniTaskData?._id,
      title: taskTitle,
      description: taskDescription,
      duedate: taskDueDate,
      completed: taskCompleted,
    };
    formData.append("data", JSON.stringify(data));

    if (imageFile) {
      formData.append("img", imageFile);
    }

    try {
      const res = await updateMiniTask(formData).unwrap();

      if (res?.status == 200)
        toast.success(res?.message || "Mini Task updated");
      else toast.error(res?.message || "Failed to update task.");
    } catch (err) {
      toast.error("Failed to update task.");
      console.error(err);
    } finally {
      onClose();
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded-full bg-red-500"
          >
            <RxCross2 color="white" size={20}/>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          {/* Task Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image
            </label>

            <div className="relative group">
              {uploadedImagePreview ? (
                <div className="relative">
                  <img
                    className="w-full h-48 object-cover rounded-lg"
                    src={uploadedImagePreview}
                    alt="uploaded image"
                  />
                  {/* Plus icon appears on hover */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <label
                      htmlFor="imageUpload"
                      className="cursor-pointer flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                    >
                      <FaPlus />
                    </label>
                  </div>
                </div>
              ) : (
                miniTaskData?.img?
                (<div className="relative">
                  <img
                    className="w-full h-48 object-cover rounded-lg "
                    src={miniTaskData?.img}
                    alt=""
                  />
                  {/* Plus icon appears on hover */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                    <label
                      htmlFor="imageUpload"
                      className="cursor-pointer flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full  hover:bg-blue-600"
                    >
                      <FaPlus />
                    </label>
                  </div>
                </div>):

                // always on hover
                (<div className="relative">
                  <img
                    className="w-full h-48 object-cover rounded-lg"
                    src={miniTaskData?.img}
                    alt=""
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg">
                    <label
                      htmlFor="imageUpload"
                      className="cursor-pointer flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                    >
                      <FaPlus />
                    </label>
                  </div>
                </div>)





              )}
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <Tooltip placement="topLeft" title={"Can upload one image only"} />
          </div>

          {/* Task Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Task Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg max-h-64"
            />
          </div>

          {/* Due Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="">
              <Flex vertical gap="middle">
                <Radio.Group
                  options={options}
                  value={taskCompleted}
                  optionType="button"
                  buttonStyle="solid"
                  onChange={(e) => setTaskCompleted(e.target.value)}
                />
              </Flex>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MiniTaskModal;
