require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- 1. CONFIGURATION CORS POUR LE CLOUD ---
const allowedOrigins = [
  "https://appel-candidatures.vercel.app", // Ton frontend
  "https://candidatures-one.vercel.app"    // Ton backend lui-même
];

app.use(cors({
  origin: function (origin, callback) {
    // Autorise les requêtes sans origine (comme Postman) ou les domaines autorisés
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error('Bloqué par la sécurité CORS de MJB'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 2. CONNEXION MONGODB (MODÈLE SERVERLESS) ---
// En Cloud, on évite d'ouvrir une nouvelle connexion à chaque clic
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;

  mongoose.set('strictQuery', true);
  const db = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  cachedDb = db;
  return db;
}

// Middleware de connexion automatique
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error("Erreur DB Cloud:", error);
    res.status(500).json({ error: "Connexion base de données impossible" });
  }
});

// --- 3. ROUTES ---
app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend MJB Cloud opérationnel 🚀" });
});

// Import direct des routes
app.use('/api/candidats', require('./routes/candidatRoutes'));

// --- 4. EXPORTATION POUR VERCEL (LE POINT CRUCIAL) ---
// On n'appelle pas app.listen en production, Vercel s'en occupe.
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Mode dév : http://localhost:${PORT}`));
}

// C'est cette ligne qui permet au Cloud de "voir" ton application
module.exports = app;