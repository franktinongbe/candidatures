const mongoose = require('mongoose');

const CandidatSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  telephone: String,
  email: String,
  poste: String,
  cvPath: String,
  idPath: String,
  createdAt: { type: Date, default: Date.now }
});

// Vérifie que tu exportes bien le modèle
module.exports = mongoose.models.Candidat || mongoose.model('Candidat', CandidatSchema);