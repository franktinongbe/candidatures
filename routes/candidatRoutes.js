const express = require('express');
const router = express.Router();
const multer = require('multer');
const Candidat = require('../models/Candidat');

// On utilise la mémoire car Vercel ne permet pas d'écrire sur le disque
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/postuler', upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'identite', maxCount: 1 }
]), async (req, res) => {
  try {
    const { nom, telephone, email, poste } = req.body;

    const nouvelleCandidature = new Candidat({
      nom,
      telephone,
      email,
      poste,
      cvPath: "Fichier reçu en mémoire",
      idPath: "Fichier reçu en mémoire"
    });

    await nouvelleCandidature.save();
    res.status(201).json({ message: "Candidature enregistrée avec succès !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'enregistrement." });
  }
});

// Route pour l'admin
router.get('/liste', async (req, res) => {
  try {
    const candidats = await Candidat.find().sort({ createdAt: -1 });
    res.json(candidats);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;