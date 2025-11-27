import { Router } from "express";
import { ReservationController } from "../controllers/ReservationController.js";

const router = Router();

// Routes réservation
router.get("/", ReservationController.getAll);
router.post("/", ReservationController.create);
router.put("/:id/cancel", ReservationController.cancel);

export default router;
