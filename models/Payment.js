import { pool } from "../config/db.js";


// Création du modèle Paiement
export const PaymentModel = {
  create: async ({ reservationId, amount, provider = null, status = "pending" }) => {
    const [res] = await pool.query(
      `INSERT INTO payments (reservationId, amount, provider, status)
       VALUES (?, ?, ?, ?)`,
      [reservationId, amount, provider, status]
    );
    return res.insertId;
  },

  // Trouver un paiement par ID

  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM payments WHERE id = ?", [id]);
    return rows[0];
  },

  // Trouver les paiements par ID de réservation

  findByReservationId: async (reservationId) => {
    const [rows] = await pool.query(
      "SELECT * FROM payments WHERE reservationId = ?",
      [reservationId]
    );
    return rows;
  },
 
  // Récupérer tous les paiements

  getAll: async () => {
    const [rows] = await pool.query("SELECT * FROM payments ORDER BY createdAt DESC");
    return rows;
  },

  // Mettre à jour le statut d'un paiement

  updateStatus: async (id, status) => {
    await pool.query("UPDATE payments SET status = ?, updatedAt = NOW() WHERE id = ?", [status, id]);
  },

  // Supprimer un paiement
  delete: async (id) => {
    await pool.query("DELETE FROM payments WHERE id = ?", [id]);
  }
};

export default PaymentModel;