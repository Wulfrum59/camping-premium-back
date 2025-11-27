import { Router } from "express";
import { PaymentController } from "../controllers/PaymentController.js";

const router = Router();

router.post("/", PaymentController.createPayment);          // Créer un paiement
router.get("/", PaymentController.getAllPayments);          // Lister les paiements
router.get("/:id", PaymentController.getPaymentById);       // Détails paiement
router.put("/:id/status", PaymentController.updatePaymentStatus); // Mettre à jour status (webhook simulate)

export default router;
