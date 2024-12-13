import mongoose from "mongoose";

const miniTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    img: {
      type: String,
    },
    description: {
      type: String,
      default: "No description",
    },
    dueDate: {
      type: Date,
      default: Date.now(),
    },
    completed: {
      type: String,
      enum: ["completed", "pending", "in progress"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const miniTaskModel = mongoose.model("miniTask", miniTaskSchema);

export default miniTaskModel;
