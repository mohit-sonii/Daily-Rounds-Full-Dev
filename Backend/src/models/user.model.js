
import mongoose,{ Schema } from "mongoose";

const UserModel = new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    // Read Extension.md to understand below two fields
    assignedToDos:[{
        type:mongoose.Types.ObjectId,
        ref:'ToDo'
    }],
    todos:[
        {
            type:mongoose.Types.ObjectId,
            ref:'ToDo'
        }
    ]
   
},{timestamps:true})

export const User = mongoose.model("User",UserModel)