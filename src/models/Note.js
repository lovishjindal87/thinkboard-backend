import mongoose from "mongoose";

const noteSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: false, // description is optional
    },
    // priority of the note: low, medium, or high
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    // status of the note: todo, in-progress, or done
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    // optional due date
    dueDate: {
      type: Date,
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;