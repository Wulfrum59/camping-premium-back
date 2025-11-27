import { ReservationModel } from "../models/reservationModel.js";


// Contrôleur Réservation
export const ReservationController = {

    // Créer une nouvelle réservation
  create: async (req, res) => {
    const { userId, hebergementId, startDate, endDate, total } = req.body;

    const available = await ReservationModel.checkAvailability(
      hebergementId,
      startDate,
      endDate
    ); // Vérifier la disponibilité

    if (!available)
      return res.status(400).json({ error: "Hébergement indisponible" });

    const id = await ReservationModel.create({
      userId,
      hebergementId,
      startDate,
      endDate,
      total
    }); 

    res.json({ message: "Réservation créée", id });
  },

  // Récupérer toutes les réservations
  getAll: async (req, res) => {
    res.json(await ReservationModel.getAll());
  },
  // Annuler une réservation
  cancel: async (req, res) => {
    await ReservationModel.cancel(req.params.id);
    res.json({ message: "Réservation annulée" });
  }
};


export default ReservationController;