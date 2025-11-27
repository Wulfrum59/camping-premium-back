import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";

// Contrôleur utilisateur
export const UserController = {

    // Inscription utilisateur
  register: async (req, res) => {
    const { email, password, name } = req.body;

    const exists = await UserModel.findByEmail(email);
    if (exists) return res.status(400).json({ error: "Email déjà utilisé" });

    const hash = await bcrypt.hash(password, 10);
    const id = await UserModel.create(email, hash, name);

    res.json({ message: "Utilisateur créé", id });
  },

    // Connexion utilisateur

  login: async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findByEmail(email);
    if (!user) return res.status(404).json({ error: "Email introuvable" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  }
};

export default UserController;