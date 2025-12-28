require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

// Connexion MongoDB
// Ajout d'options pour une meilleure stabilité en production
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch(err => console.error("❌ Erreur de connexion:", err));

// Routes
app.use('/api/candidats', require('./routes/candidatRoutes'));

// Route de test pour vérifier que l'API répond
app.get('/', (req, res) => res.send("API Mairie des Jeunes active 🚀"));

const PORT = process.env.PORT || 5000;

// IMPORTANT pour Vercel : On ne lance app.listen que si on n'est pas sur Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
}

// CRUCIAL : Exporter l'application pour que Vercel puisse l'utiliser
module.exports = app;