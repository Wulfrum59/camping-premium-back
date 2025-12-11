import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

/**
 * Inscription utilisateur
 */
export const register = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    address,
    phone,
    birth_date,
    role = "user"
  } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const [[existingUser]] = await db.query(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser) {
      return res.status(400).json({ error: "Un utilisateur avec cet email existe déjà" });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertion dans la base
    const [result] = await db.query(
      `INSERT INTO users 
      (first_name, last_name, email, password, address, phone, birth_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, hashedPassword, address, phone, birth_date]
    );

    const userId = result.insertId;

    // Génération du token JWT
    const token = jwt.sign(
      { id: userId, email, role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: { user_id: userId, first_name, last_name, email, role, address, phone, birth_date },
      token,
    });
  } catch (error) {
    console.error("Erreur register :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

/**
 * Connexion utilisateur
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [[user]] = await db.query(
      "SELECT user_id, first_name, last_name, email, password, role_id AS role, address, phone, birth_date FROM users WHERE email = ?",
      [email]
    );

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    // Génération du token JWT
    const token = jwt.sign(
      {
        id: user.user_id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Connexion réussie",
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        address: user.address,
        phone: user.phone,
        birth_date: user.birth_date,
      },
      token,
    });
  } catch (error) {
    console.error("Erreur login :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
