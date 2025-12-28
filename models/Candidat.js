const mongoose = require('mongoose');

const CandidatSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  telephone: { type: String, required: true },
  email: { type: String, required: true },
  poste: { type: String, required: true },
  cvPath: { type: String },
  idPath: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidat', CandidatSchema);