import mongoose from "mongoose";

const subCardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Untitled task",
    },
    miniTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "miniTask",
      },
    ],
  },
  { timestamps: true }
);

const subCardModel = mongoose.model("subCard", subCardSchema);

export default subCardModel;