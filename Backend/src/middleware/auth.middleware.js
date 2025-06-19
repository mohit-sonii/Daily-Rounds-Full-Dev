import { User } from "../models/user.model.js";

// this middlware is responsible for validating the cookie that there should be a user inthe cookie, it is just an additional functionality and the cookie stores the ID of the current user which is also good when we need to have it at some point of the code.
export const authMiddleware = async (req, res, next) => {
   try {
      const userId = req.cookies.current_user_id;
      console.log(userId)
      if (userId) {
         const isUser = await User.findById(userId);
         if (!isUser) {
            res.status(404).json({
               status: 404,
               message: "User with this username does not exists",
            });
            return;
         }
         req.id = userId;
         next();
         return
      }
      res.status(400).json({ status: 400, message: "Session Expired !! Please Login again" });
      return;
   } catch (err) {
      console.log(err);
      res.status(500).json({
         status: 500,
         message: "Authentication Failed, Internal Server Error",
      });
      return;
   }
};
