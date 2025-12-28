require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 1. Configuration CORS
// ATTENTION : Pas de slash "/" à la fin des URLs
const allowedOrigins = [
  "https://appel-candidatures.vercel.app",
  "https://candidatures-one.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Permet les requêtes sans origine (comme Postman) ou les origines dans la liste
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Action bloquée par CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connecté"))
  .catch(err => console.error("❌ Erreur MongoDB:", err));

// 3. Routes
const candidatRoutes = require('./routes/candidatRoutes');

// Route de test racine
app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend MJB opérationnel 🚀" });
});

// Préfixe de tes routes API
app.use('/api/candidats', candidatRoutes);

// Gestion des erreurs 404 pour les routes inconnues
app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// 4. Export pour Vercel (Important)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Serveur local sur le port ${PORT}`));
}

module.exports = app;