import { pool } from "../config/db.js";


// Modèle utilisateur
export const UserModel = {
  create: async (email, password, name) => {
    const [res] = await pool.query(
      "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
      [email, password, name]
    );
    return res.insertId;
  },

  // Trouver un utilisateur par email
  findByEmail: async (email) => {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows[0];
  }
};

export default UserModel;