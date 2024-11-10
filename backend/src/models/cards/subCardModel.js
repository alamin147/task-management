import mongoose from "mongoose";

const subCardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Untitled task",
    },
    // singleCard: [{ type: mongoose.Schema.ObjectId, ref: "singleCard" }],
    // default: [],
  },
  { timestamps: true }
);

const subCardModel = mongoose.model("subCard", subCardSchema);

export default subCardModel;
