import express from "express";
import { getCurrentUser, updateUser } from "../controllers/UserController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", auth, getCurrentUser);
router.put("/me", auth, updateUser); // pour mettre à jour les infos

export default router;
