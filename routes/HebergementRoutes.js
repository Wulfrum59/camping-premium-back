import { Router } from "express";
import { HebergementController } from "../controllers/HebergementController.js";

const router = Router();

// Routes hébergement

router.get("/", HebergementController.getAll);
router.post("/", HebergementController.create);
router.get("/:id", HebergementController.getOne);
router.put("/:id", HebergementController.update);
router.delete("/:id", HebergementController.delete);

export default router;
