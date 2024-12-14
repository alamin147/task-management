import { useState } from "react";
import { Flex, Radio, Tooltip } from "antd";
import { Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import toast from "react-hot-toast";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const MiniTaskModal = ({
  onClose,
  miniTaskData,
}: {
  onClose: () => void;
  miniTaskData: {
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

  const [taskTitle, setTaskTitle] = useState(miniTaskData?.title || "");
  const [taskDescription, setTaskDescription] = useState(
    miniTaskData?.description || ""
  );
  const [taskDueDate, setTaskDueDate] = useState(formattedDueDate);
  const [taskCompleted, setTaskCompleted] = useState(
    miniTaskData?.completed || "pending"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      title: taskTitle,
      description: taskDescription,
      dueDate: taskDueDate,
      completed: taskCompleted,
      img: fileList.length > 0 ? fileList[0].originFileObj : null,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    if (data.img) {
      formData.append("image", data.img);
    }

    try {
      await updateMiniTask(formData).unwrap();

      toast.success("Task updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  // image upload
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✖
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          {/* Task Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image
            </label>
            <ImgCrop rotationSlider>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
                maxCount={1}
              >
                <Tooltip
                  placement="topLeft"
                  title={"Can upload one image only"}
                >
                  {fileList.length < 5 && "+ Upload"}
                </Tooltip>
              </Upload>
            </ImgCrop>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              placeholder="Enter task description"
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Flex vertical gap="middle">
              <Radio.Group
                block
                options={options}
                defaultValue={taskCompleted}
                optionType="button"
                buttonStyle="solid"
                onChange={(e) => setTaskCompleted(e.target.value)}
              />
            </Flex>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MiniTaskModal;
