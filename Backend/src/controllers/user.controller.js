import { User } from "../models/user.model";


// method to get all the users from the database
export const getUsers = async(req, res) => {
   try {
    const id= req.id;
    const allUsers = await User.find({});
    const filteredUsers = allUsers.filter((item)=>item._id!=id)
    res.status(200).json({status:200,message:"Users Fethced Successfully",data:filteredUsers})
    return
   } catch (err) {
      console.log(err);
      res.status(500).json({
         status: 500,
         message: "Error while Creating a Todo",
      });
   }
};
