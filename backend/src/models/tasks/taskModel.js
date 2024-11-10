import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      default: "No description",
    },
    dueDate: {
      type: Date,
      default: Date.now(),
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    subcards: {
      type: [
        {
          _id: {
            type: mongoose.Schema.ObjectId,
            ref: "subCard",
          },
          title: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const TaskModel = mongoose.model("Task", TaskSchema);

export default TaskModel;
