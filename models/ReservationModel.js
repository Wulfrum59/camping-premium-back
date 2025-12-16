import db from "../config/db.js";

const ReservationModel = {
  // Créer une réservation
  create: async (reservation) => {
    const { hebergementId, nom, email, dateDebut, dateFin } = reservation;

    try {
      const sql = `
        INSERT INTO reservations 
          (hebergement_id, nom, email, start_date, end_date)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [result] = await db.execute(sql, [
        hebergementId,
        nom,
        email,
        dateDebut, // date du front
        dateFin,   // date du front
      ]);

      return {
        id: result.insertId,
        ...reservation,
      };
    } catch (error) {
      console.error("Erreur lors de la création de réservation:", error);
      throw error;
    }
  },

  // Vérifier si les dates se chevauchent
  findOverlapping: async (hebergementId, dateDebut, dateFin) => {
    try {
      const sql = `
        SELECT * FROM reservations
        WHERE hebergement_id = ?
        AND NOT (end_date < ? OR start_date > ?)
      `;
      const [rows] = await db.execute(sql, [
        hebergementId,
        dateDebut,
        dateFin,
      ]);

      return rows;
    } catch (error) {
      console.error("Erreur lors de la vérification des chevauchements:", error);
      throw error;
    }
  },
};

export default ReservationModel;
