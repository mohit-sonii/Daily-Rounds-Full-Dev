import { User } from "../models/user.model.js";

export const register = async (req, res) => {
   try {
      // if a user is already register and logged in it will not reach to this route as redux will handle that part
      const { username, email } = req.body;
      const userExists = await User.findOne({
         $or: [{ username }, { email }],
      });
      if (userExists) {
         res.status(409).json({
            status: 409,
            message: "User with these credentials already exists",
         });
         return;
      }
      const user = new User({
         username,
         email,
      });
      await user.save();
      res.status(200).json({
         status: 200,
         message: "User registerd successfully !!",
      });
      return;
   } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Internal Server Error" });
      return;
   }
};

export const login = async (req, res) => {
   try {
      const { username } = req.body;
      const isUser = await User.findOne({username});
      if (!isUser) {
         res.status(404).json({
            status: 404,
            message: "User with this credentials is not found",
         });
         return;
      }
      res.cookie("current_user_id", isUser._id.toString(), {
         httpOnly: true,
         maxAge: 1000 * 24 * 60 * 60,
         sameSite: "none",
      });
      res.status(200).json({
         status: 200,
         message: "User Logged in Successfully",
      });
      return;
   } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Internal Server Error" });
      return;
   }
};
