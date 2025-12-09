import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

/**
 * Inscription utilisateur
 */
export const register = async (req, res) => {
  const { name, email, password, role = "user" } = req.body;

  try {
    const [[existingUser]] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser) {
      return res.status(400).json({
        error: "Un utilisateur avec cet email existe déjà",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    const userId = result.insertId;

    const token = jwt.sign(
      { id: userId, email, role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

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

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [[user]] = await db.query(
      "SELECT id, name, email, password, role FROM users WHERE email = ?",
      [email]
    );

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Connexion réussie",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Erreur login :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

