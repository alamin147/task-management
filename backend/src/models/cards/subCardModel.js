import mongoose from "mongoose";

const subCardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Untitled task",
    },
  },
  { timestamps: true }
);

const subCardModel = mongoose.model("subCard", subCardSchema);

export default subCardModel;



// singleCard: [{ type: mongoose.Schema.ObjectId, ref: "singleCard" }],
// default: [],
