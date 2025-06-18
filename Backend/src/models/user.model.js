import mongoose, { Schema } from "mongoose";

const UserModel = new Schema(
   {
      username: {
         type: String,
         unique: true,
         required: true,
      },
      email: {
         type: String,
         unique: true,
         required: true,
      },
      // Read Extension.md to understand below two fields
      assignedToDos: {
         type: [
            {
               type: mongoose.Types.ObjectId,
               ref: "ToDo",
            },
         ],
         default: [],
      },
      todos: {
         type: [
            {
               type: mongoose.Types.ObjectId,
               ref: "ToDo",
            },
         ],
         default: [],
      },
   },
   { timestamps: true }
);

export const User = mongoose.model("User", UserModel);
