import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for fast per-user note lookups
    },
  },
  {
    timestamps: true,
  },
);

const Note = mongoose.model("Note", noteSchema); //to create a model based on the schema we created above

export default Note;
