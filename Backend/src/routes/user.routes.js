import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getUsers } from "../controllers/user.controller.js";

const router = Router();

router.route("/get-users").get(authMiddleware, getUsers);

export default router;
