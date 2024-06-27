const Salle = require('../models/Salle');

// Méthode pour récupérer toutes les salles
exports.getSalles = async (req, res) => {
    try {
        const salles = await Salle.find();
        res.json(salles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Méthode pour créer une nouvelle salle
exports.createSalle = async (req, res) => {
    const salle = new Salle({
        nom: req.body.nom,
        capacite: req.body.capacite,
        localisation: req.body.localisation,
        disponibilite: req.body.disponibilite
    });

    try {
        const nouvelleSalle = await salle.save();
        res.status(201).json(nouvelleSalle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Méthode pour récupérer une seule salle par son ID
exports.getSalleById = async (req, res) => {
    try {
        const salle = await Salle.findById(req.params.id);
        if (salle == null) {
            return res.status(404).json({ message: 'Salle non trouvée' });
        }
        res.json(salle);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Méthode pour mettre à jour une salle existante
exports.updateSalle = async (req, res) => {
    try {
        const salle = await Salle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(salle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Méthode pour supprimer une salle existante
exports.deleteSalle = async (req, res) => {
    try {
        await Salle.findByIdAndDelete(req.params.id);
        res.json({ message: 'Salle supprimée' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
