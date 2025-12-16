import { Router } from "express";
import { ReservationController } from "../controllers/ReservationController.js";
import { createReservation } from "../controllers/Reservation.controller.js";




const router = Router();

// Routes réservation
router.post("/", createReservation);
router.get("/", ReservationController.getAll);
router.post("/", ReservationController.create);
router.put("/:id/cancel", ReservationController.cancel);

export default router;
