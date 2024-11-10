import mongoose from "mongoose";

const singleCardSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const singleCardModel = mongoose.model("singleCard", singleCardSchema);

export default singleCardModel;
