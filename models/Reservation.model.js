import db from "../config/db.js";

const ReservationModel = {
  create: async (reservation) => {
    const { hebergementId, nom, email, dateDebut, dateFin } = reservation;

    const sql = `
      INSERT INTO reservations (hebergement_id, nom, email, start_date, end_date)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      hebergementId,
      nom,
      email,
      dateDebut, // correspond à start_date
      dateFin,   // correspond à end_date
    ]);

    return {
      id: result.insertId,
      ...reservation,
    };
  },

  findOverlapping: async (hebergementId, dateDebut, dateFin) => {
    const sql = `
      SELECT * FROM reservations
      WHERE hebergement_id = ?
      AND NOT (
        end_date < ? OR start_date > ?
      )
    `;

    const [rows] = await db.execute(sql, [
      hebergementId,
      dateDebut,
      dateFin,
    ]);

    return rows;
  },
};

export default ReservationModel;
