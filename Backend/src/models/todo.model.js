import mongoose, { Schema } from "mongoose";

const TodoModel = new Schema(
   {
      title: {
         required: true,
         unique: true,
         type: String,
      },
      description: {
         required: true,
         type: String,
      },
      priority: {
         type: String, // "Low","Medium","High"
         default: "High",
      },
      completed: {
         type: Boolean,
         default: false,
      },
      tags: {
         type: [String],
         default: []
      },

      assignedUsers: {
         // usernames of the asssigned users
         type: [String],
         default: []
      },

      // the user will be the reference to this field, and hence the type of this field will be ObjectID which is not a string its Mongodb Id type ,

      // the purpose to create this field is to mention whois the creator of this task.
      user: {
         type: mongoose.Types.ObjectId,
         // Schema name which we want to connect
         ref: "User",
      },

      notes: [
         {
            content: {
               type: String,
            },
            createdAt: {
               type: Date,
               default: Date.now,
            },
         },
      ],
   },
   { timestamps: true }
);

export const ToDo = mongoose.model("ToDo", TodoModel);
