import { HebergementModel } from "../models/hebergementModel.js";


// Contrôleur Hébergement
export const HebergementController = {

    // Récupérer tous les hébergements
  getAll: async (req, res) => { 
    res.json(await HebergementModel.getAll());
  },
  // Créer un nouvel hébergement
  create: async (req, res) => {
    const id = await HebergementModel.create(req.body);
    res.json({ message: "Hébergement créé", id });
  },
  // Récupérer un hébergement par ID
  getOne: async (req, res) => {
    const item = await HebergementModel.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Introuvable" });

    res.json(item);
  },
  // Mettre à jour un hébergement
  update: async (req, res) => {
    await HebergementModel.update(req.params.id, req.body);
    res.json({ message: "Mis à jour" });
  },
  // Supprimer un hébergement
  delete: async (req, res) => {
    await HebergementModel.delete(req.params.id);
    res.json({ message: "Supprimé" });
  }
};

export default HebergementController;