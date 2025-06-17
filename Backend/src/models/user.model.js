
import mongoose,{ Schema } from "mongoose";

const UserModel = new Schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
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