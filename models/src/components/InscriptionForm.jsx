import { useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = "/api/candidats/postuler";

export default function InscriptionForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null); 
  const [fileNames, setFileNames] = useState({ cv: '', identity: '' });

  const postes = [
    { cat: "Bureau Exécutif", items: ["Directeur de Cabinet", "Chargé(e) de la Communication", "Secrétaire Général(e)", "Secrétaire Général(e) Adjoint(e)", "Trésorier(ère) Général(e)", "Trésorier(ère) Adjoint(e)", "Chef(fe) de Projet"] },
    { cat: "Chefs de Services", items: ["Environnement & Assainissement", "Sports & Loisirs", "Entrepreneuriat & Emploi des Jeunes", "Intercommunalité & Renforcement des Capacités", "Informatique & Numérique", "Communication", "Agriculture", "Santé & Éducation Sexuelle", "Genre & Affaires Sociales", "Culture, Patrimoine & Tourisme", "Éducation & Relations Institutionnelles"] }
  ];

  const handleFileChange = (e, key) => {
    if (e.target.files[0]) {
      setFileNames({ ...fileNames, [key]: e.target.files[0].name });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('nom', e.target.nom.value);
    formData.append('telephone', e.target.telephone.value);
    formData.append('email', e.target.email.value);
    formData.append('poste', e.target.poste.value);
    formData.append('cv', e.target.cvFile.files[0]);
    formData.append('identite', e.target.idFile.files[0]);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get("content-type");

      if (response.ok) {
        const monNumero = "22940341969"; 
        const messageWhatsApp = `*NOUVELLE CANDIDATURE*%0A*Nom:* ${e.target.nom.value}%0A*Poste:* ${e.target.poste.value}`;
        
        setSuccess(true);
        window.scrollTo(0, 0);
        setTimeout(() => {
          window.open(`https://wa.me/${monNumero}?text=${messageWhatsApp}`, '_blank');
        }, 2000);
      } else {
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          throw new Error(data.message || "Erreur lors de l'envoi.");
        } else {
          throw new Error("Erreur 404 : Le serveur API ne répond pas.");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Logique d'affichage (Success & Form) identique à ton code précédent...
  if (success) {
    return (
      <div className="container py-5 text-center">
        <div className="card p-5 shadow-lg border-0 rounded-4 bg-white mx-auto" style={{maxWidth: '600px'}}>
          <div className="mb-4"><i className="bi bi-check-circle-fill text-success" style={{fontSize: '5rem'}}></i></div>
          <h2 className="fw-black text-dark">Candidature Envoyée !</h2>
          <p className="text-muted fs-5 mb-4">Votre dossier est enregistré. WhatsApp va s'ouvrir.</p>
          <Link to="/" className="btn btn-primary btn-lg px-5 rounded-pill shadow">RETOUR À L'ACCUEIL</Link>
        </div>
      </div>
    );
  }

  return (
    // Ton code JSX du formulaire ici...
    <div className="container py-5">
        <form onSubmit={handleSubmit}>
            {/* ... Tes champs de formulaire ... */}
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? "ENVOI EN COURS..." : "SOUMETTRE"}
            </button>
        </form>
    </div>
  );
}