import { User } from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
   try {
      const userId = req.cookies.current_user_id;
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
      }
      res.status(400).json({ status: 400, message: "Please Login again" });
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
