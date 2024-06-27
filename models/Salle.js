const { required } = require("joi");
const mongoose = require("mongoose");


const salleSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    capacite: {
        type: Number,
        required: true
    },
    disponibilite: {
        type: Boolean,
        required: true
    },
    localisation: String
});

module.exports = mongoose.model('Salle', salleSchema);