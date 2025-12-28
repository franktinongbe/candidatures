const express = require('express');
const router = express.Router();
const multer = require('multer');
const Candidat = require('../models/Candidat');

// SOLUTION : On utilise la mémoire (RAM), pas le disque dur
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route pour postuler
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
      cvPath: "Enregistré en mémoire", 
      idPath: "Enregistré en mémoire"
    });

    await nouvelleCandidature.save();
    res.status(201).json({ message: "Candidature reçue !" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;