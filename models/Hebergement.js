import { pool } from "../config/db.js";


// Création du modèle Hébergement
export const HebergementModel = {
  getAll: async () => {
    const [rows] = await pool.query("SELECT * FROM hebergements");
    return rows;
  },

  // Créer un nouvel hébergement
  create: async (data) => {
    const { title, type, description, price, stock } = data;
    const [res] = await pool.query(
      "INSERT INTO hebergements (title, type, description, price, stock) VALUES (?, ?, ?, ?, ?)",
      [title, type, description, price, stock]
    );
    return res.insertId;
  },

  // Trouver un hébergement par ID
  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT * FROM hebergements WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  // Mettre à jour un hébergement
  update: async (id, data) => {
    const { title, type, description, price, stock } = data;
    await pool.query(
      "UPDATE hebergements SET title=?, type=?, description=?, price=?, stock=? WHERE id=?",
      [title, type, description, price, stock, id]
    );
  },

  // Supprimer un hébergement
  delete: async (id) => {
    await pool.query("DELETE FROM hebergements WHERE id=?", [id]);
  }
};

export default HebergementModel;