const express = require('express');
const router = express.Router();
const sallesController = require('../controllers/sallesController');
const { verifyToken } = require('../middlewares/verifyToken');

// Routes pour les opérations CRUD sur les salles
router.get('/getAllSalles',verifyToken,sallesController.getSalles);
router.post('/createSalle',verifyToken, sallesController.createSalle);
router.get('/getSalleById/:id',verifyToken, sallesController.getSalleById);
router.put('/updateSalle/:id', verifyToken,sallesController.updateSalle);
router.delete('/deleteSalle/:id',verifyToken, sallesController.deleteSalle);

module.exports = router;
