/**
 * Vérifie si un mot de passe est bon :
 * - min 8 caractères
 * - contient minuscule + majuscule + chiffre
 * - ne contient pas la date de naissance
 * - pas de répétition excessive
 */
function validatePassword(password, dateNaissance) {
  if (!password || typeof password !== "string")
    return { valid: false, message: "Mot de passe requis" };

  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!strongRegex.test(password))
    return { 
      valid: false, 
      message: "Le mot de passe doit contenir minimum 8 caractères, une majuscule et un chiffre" 
    };

  if (dateNaissance) {
    const cleanDate = dateNaissance.toString().replace(/-/g, "");
    if (password.includes(cleanDate))
      return { 
        valid: false, 
        message: "Le mot de passe ne doit pas contenir votre date de naissance" 
      };
  }

  if (/^(.)\1{5,}$/.test(password))
    return { 
      valid: false, 
      message: "Le mot de passe ne doit pas contenir des caractères répétés" 
    };

  return { valid: true };
}

/**
 * Vérifie année diplôme ≤ année actuelle
 */
function validateAnneeDiplome(annee) {
  if (!annee) return { valid:false, message:"Année de diplôme requise" };
  const inputYear = new Date(annee).getFullYear();
  const currentYear = new Date().getFullYear();

  if (inputYear > currentYear)
    return { valid:false, message:"L'année de diplôme doit être ≤ année actuelle" };

  return { valid:true };
}


/**
 * Vérifie la validité de la date de naissance :
 * - format valide
 * - pas dans le futur
 * - âge raisonnable (ex : 16-100 ans)
 */
function validateDateNaissance(date) {
  if (!date) return { valid:false, message:"Date de naissance requise" };

  const birth = new Date(date);
  if (isNaN(birth)) 
    return { valid:false, message:"Date de naissance invalide" };

  const today = new Date();
  if (birth > today)
    return { valid:false, message:"La date de naissance ne peut pas être dans le futur" };

  const age = today.getFullYear() - birth.getFullYear();

  if (age < 16)
    return { valid:false, message:"Vous devez avoir au moins 16 ans" };

  if (age > 100)
    return { valid:false, message:"Âge invalide (supérieur à 100 ans)" };

  return { valid:true };
}

function validateNomPrenom(field, value) {
  if (!value || typeof value !== "string")
    return { valid:false, message:`${field} est requis` };

  const trimmed = value.trim();

  if (trimmed.length < 2)
    return { valid:false, message:`${field} doit contenir au moins 2 caractères` };

  if (trimmed.length > 50)
    return { valid:false, message:`${field} ne doit pas dépasser 50 caractères` };

  if (!/^[a-zA-ZÀ-ÿ' -]+$/.test(trimmed))
    return { valid:false, message:`${field} contient des caractères invalides` };

  return { valid:true };
}

function validateJustificatifUrl(url) {
  if (!url) return { valid: true }; // Optionnel

  const regex = /^(http|https):\/\/[^ "]+$/;

  if (!regex.test(url)) {
    return { valid: false, message: "Le justificatif doit être une URL valide (Cloudinary, Drive...)" };
  }

  return { valid: true };
}

module.exports = {
  validatePassword,
  validateAnneeDiplome,
  validateDateNaissance,
  validateNomPrenom,
  validateJustificatifUrl
};


