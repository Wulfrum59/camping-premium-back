import { pool } from "../config/db.js";

// Création du modèle Réservation
export const ReservationModel = {
  checkAvailability: async (hebergementId, startDate, endDate) => { // Vérifier la disponibilité
    const [rows] = await pool.query(
      `SELECT * FROM reservations
       WHERE hebergementId = ?
       AND status = 'confirmed'
       AND (
         startDate BETWEEN ? AND ?
         OR endDate BETWEEN ? AND ?
       )`,
      [hebergementId, startDate, endDate, startDate, endDate]
    );
// Si aucune réservation conflictuelle n'est trouvée, l'hébergement est disponible
    return rows.length === 0;
  },

  // Créer une nouvelle réservation
  create: async (data) => {
    const { userId, hebergementId, startDate, endDate, total } = data;
    const [res] = await pool.query(
      `INSERT INTO reservations (userId, hebergementId, startDate, endDate, total)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, hebergementId, startDate, endDate, total]
    );
    return res.insertId;
  },

  // Récupérer toutes les réservations
  getAll: async () => {
    const [rows] = await pool.query("SELECT * FROM reservations");
    return rows;
  },

    // Annuler une réservation
  cancel: async (id) => {
    await pool.query("UPDATE reservations SET status='cancelled' WHERE id=?", [id]);
  }
};


export default ReservationModel;