import { PaymentModel } from "../models/paymentModel.js";
import { ReservationModel } from "../models/reservationModel.js";

export const PaymentController = {
  // Créer un paiement (ex : après tentative de paiement côté client)
  createPayment: async (req, res) => {
    try {
      const { reservationId, amount, provider } = req.body;
      if (!reservationId || !amount) return res.status(400).json({ error: "reservationId et amount requis" });

      // Optionnel : vérifier que la réservation existe
      const reservation = await ReservationModel.getById
        ? await ReservationModel.getById(reservationId)
        : null;
      if (reservation === undefined) {
        // si model n'a pas getById, on skip la vérif
      } else if (reservation === null) {
        return res.status(404).json({ error: "Réservation introuvable" });
      }

      const id = await PaymentModel.create({ reservationId, amount, provider, status: "pending" });
      const payment = await PaymentModel.findById(id);
      res.status(201).json(payment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // Récupérer un paiement par id
  getPaymentById: async (req, res) => {
    try {
      const payment = await PaymentModel.findById(req.params.id);
      if (!payment) return res.status(404).json({ error: "Paiement introuvable" });
      res.json(payment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // Récupérer tous les paiements
  getAllPayments: async (req, res) => {
    try {
      const list = await PaymentModel.getAll();
      res.json(list);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // Webhook ou callback pour confirmer le paiement (ex : Stripe webhook)
  updatePaymentStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body; // expected 'paid' | 'failed' | 'pending'
      if (!["pending", "paid", "failed"].includes(status))
        return res.status(400).json({ error: "Status invalide" });

      await PaymentModel.updateStatus(id, status);

      // Optionnel : si payment confirmé, mettre la réservation en confirmed
      if (status === "paid") {
        if (ReservationModel && typeof ReservationModel.confirm === "function") {
          try {
            await ReservationModel.confirm(id); // selon implémentation
          } catch {}
        }
      }

      const updated = await PaymentModel.findById(id);
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
};

export default PaymentController;