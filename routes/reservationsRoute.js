const express = require('express');
const router = express.Router();
const reservationsController = require('../controllers/reservationsController');
const { verifyToken } = require('../middlewares/verifyToken');


// Routes pour les opérations CRUD sur les réservations
router.get('/getAllReservations',verifyToken ,reservationsController.getReservations);
router.get('/getReservationById/:id', verifyToken,reservationsController.getReservationById);
router.post('/createReservation',verifyToken, reservationsController.createReservation);
router.put('/updateReservation/:id', verifyToken,reservationsController.updateReservation);
router.delete('/deleteReservation/:id', verifyToken,reservationsController.deleteReservation);

module.exports = router;