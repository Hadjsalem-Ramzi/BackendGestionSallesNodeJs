const Reservation = require('../models/Reservation');

// Contrôleur pour récupérer toutes les réservations
exports.getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Contrôleur pour récupérer une seule réservation par son ID
exports.getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }
        res.json(reservation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// Méthode pour créer une nouvelle réservation
exports.createReservation = async (req, res) => {
    const { idUtilisateur, idSalle, dateDebut, dateFin } = req.body;

    try {
        // Vérification des conflits de réservation
        const conflictingReservations = await Reservation.find({
            idSalle: idSalle,
            $or: [
                { dateDebut: { $lt: dateFin, $gte: dateDebut } },
                { dateFin: { $gt: dateDebut, $lte: dateFin } },
                { dateDebut: { $lte: dateDebut }, dateFin: { $gte: dateFin } }
            ]
        });

        if (conflictingReservations.length > 0) {
            return res.status(400).json({ message: 'La salle est déjà réservée pour cette période' });
        }

        // Créer la réservation si aucun conflit
        const reservation = new Reservation({
            idUtilisateur,
            idSalle,
            dateDebut,
            dateFin
        });

        const nouvelleReservation = await reservation.save();
        res.status(201).json(nouvelleReservation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


// exports.createReservation = async (req, res) => {
//     const reservation = new Reservation({
//         idUtilisateur: req.body.idUtilisateur,
//         idSalle: req.body.idSalle,
//         dateDebut: req.body.dateDebut,
//        dateFin: req.body.dateFin
//     });

//     try {
//         const nouvelleResevation = await reservation.save();
//         res.status(201).json(nouvelleResevation);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };


// Méthode pour mettre à jour une reservation existante
exports.updateReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(reservation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Contrôleur pour supprimer une réservation
exports.deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }
        res.json({ message: 'Réservation supprimée' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
