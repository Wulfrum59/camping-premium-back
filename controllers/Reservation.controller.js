import ReservationModel from "../models/Reservation.model.js";

// Créer une réservation
export const createReservation = async (req, res) => {
  try {
    const { hebergementId, nom, email, dateDebut, dateFin } = req.body;

    // Vérification des champs obligatoires
    if (!hebergementId || !nom || !email || !dateDebut || !dateFin) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    // Vérifier si les dates sont déjà prises
    const conflicts = await ReservationModel.findOverlapping(
      hebergementId,
      dateDebut,
      dateFin
    );

    if (conflicts.length > 0) {
      return res.status(409).json({ message: "Hébergement déjà réservé sur ces dates" });
    }

    // Création de la réservation
    const reservation = await ReservationModel.create({
      hebergementId,
      nom,
      email,
      dateDebut,
      dateFin,
    });

    return res.status(201).json({
      message: "Réservation confirmée",
      reservation,
    });

  } catch (error) {
    console.error("Erreur serveur lors de la création de réservation:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer toutes les réservations (optionnel)
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await ReservationModel.getAll?.(); // si tu implémente getAll
    res.json(reservations || []);
  } catch (error) {
    console.error("Erreur serveur lors de la récupération des réservations:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer une réservation par ID (optionnel)
export const getReservationById = async (req, res) => {
  try {
    const reservation = await ReservationModel.getById?.(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Réservation introuvable" });
    }
    res.json(reservation);
  } catch (error) {
    console.error("Erreur serveur lors de la récupération de la réservation:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export default { createReservation, getAllReservations, getReservationById };
