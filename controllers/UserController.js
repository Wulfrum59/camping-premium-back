import db from "../config/db.js";

// Middleware auth doit avoir mis req.user.id
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const [[user]] = await db.query(
      "SELECT user_id, first_name, last_name, email, address, phone, birth_date FROM users WHERE user_id = ?",
      [userId]
    );

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, address, phone, birth_date } = req.body;
    await db.query(
      "UPDATE users SET first_name = ?, last_name = ?, address = ?, phone = ?, birth_date = ? WHERE user_id = ?",
      [first_name, last_name, address, phone, birth_date, userId]
    );
    res.json({ message: "Informations utilisateur mises à jour avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};