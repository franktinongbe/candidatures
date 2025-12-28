require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Créer le dossier uploads s'il n'existe pas (pour éviter l'erreur au démarrage)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir)); 

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch(err => console.error("❌ Erreur de connexion:", err));

// Routes
// Utilisation directe du chemin vers ton fichier de routes
app.use('/api/candidats', require('./routes/candidatRoutes'));

// Route de test
app.get('/', (req, res) => res.send("API Mairie des Jeunes active 🚀"));

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
}

module.exports = app;