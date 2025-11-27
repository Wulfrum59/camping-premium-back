import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Middleware d’authentification
 * Vérifie la présence d’un token JWT dans les headers et le valide.
 * Si valide → ajoute les infos utilisateur dans req.user et continue.
 * Si invalide → renvoie une erreur 401.
 */
export const auth = (req, res, next) => {
  try {
    // Récupération du token envoyé dans le header "Authorization"
    // Format attendu : "Bearer TOKEN"
    const token = req.headers.authorization?.split(" ")[1];

    // Si aucun token n'a été fourni
    if (!token) {
      return res.status(401).json({
        error: "Accès refusé : aucun token fourni",
      });
    }

    // Vérification / déchiffrage du token avec la clé secrète
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Stockage des informations du token (id, email, role...) dans req.user
    req.user = decoded;

    // On passe au middleware suivant
    next();
  } catch (error) {
    // Le token est invalide / expiré / incorrect
    res.status(401).json({
      error: "Token invalide ou expiré",
    });
  }
};


/**
 * Middleware pour vérifier les droits admin
 * Nécessite que `auth` ait déjà été exécuté auparavant.
 * Vérifie que req.user.role === "admin".
 */
export const isAdmin = (req, res, next) => {
  // Si l'utilisateur loggé n’a pas un rôle admin
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      error: "Accès refusé : réservé à l’administrateur",
    });
  }

  // Accès autorisé
  next();
};
