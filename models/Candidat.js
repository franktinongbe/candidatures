const mongoose = require('mongoose');

const CandidatSchema = new mongoose.Schema({
  nom: String,
  telephone: String,
  email: String,
  poste: String,
  cvPath: String,
  idPath: String,
  date: { type: Date, default: Date.now }
});

// Important : vérifie l'exportation
module.exports = mongoose.models.Candidat || mongoose.model('Candidat', CandidatSchema);