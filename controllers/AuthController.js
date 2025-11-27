import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

/**
 * Inscription utilisateur
 * Étapes :
 * 1. Vérifier si l'email existe déjà
 * 2. Hasher le mot de passe
 * 3. Insérer l'utilisateur en base
 * 4. Générer un token JWT automatique après inscription
 */
export const register = async (req, res) => {
  const { name, email, password, role = "user" } = req.body;

  try {
    // 1. Vérifier si un utilisateur existe déjà avec cet email
    const [[existingUser]] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser) {
      return res.status(400).json({
        error: "Un utilisateur avec cet email existe déjà",
      });
    }

    // 2. Hasher le mot de passe avant insertion
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insérer l’utilisateur dans la base de données
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    // Récupération de l'ID nouvellement créé
    const userId = result.insertId;

    // 4. Génération d’un token automatique après inscription
    const token = jwt.sign(
      {
        id: userId,
        email,
        role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // 4. Réponse finale
    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        id: userId,
        name,
        email,
        role,
      },
      token,
    });
  } catch (error) {
    console.error("Erreur register :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
