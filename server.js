require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // ✅ Ajouté pour gérer les chemins de fichiers

const app = express();

// --- 1. CONFIGURATION CORS POUR LE CLOUD ---
const allowedOrigins = [
  "https://appel-candidatures.vercel.app", 
  "https://candidatures-one.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
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

// ✅ CRUCIAL : Rendre le dossier des uploads accessible sur Internet
// Sans cette ligne, tes liens "VOIR CV" donneront une erreur 404
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 2. CONNEXION MONGODB ---
let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  mongoose.set('strictQuery', true);
  const db = await mongoose.connect(process.env.MONGO_URI);
  cachedDb = db;
  return db;
}

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({ error: "Connexion base de données impossible" });
  }
});

// --- 3. ROUTES ---
app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend MJB Cloud opérationnel 🚀" });
});

app.use('/api/candidats', require('./routes/candidatRoutes'));

// --- 4. EXPORTATION POUR VERCEL ---
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Mode dév : http://localhost:${PORT}`));
}

module.exports = app;