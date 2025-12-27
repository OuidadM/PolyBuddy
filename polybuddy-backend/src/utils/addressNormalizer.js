// src/utils/addressNormalizer.js

/**
 * Normalise une adresse pour :
 * - éviter les doublons exacts dans la table Address
 * - créer une "clé unique" stable
 * - faciliter la recherche
 *
 * FORMAT GÉNÉRÉ :
 *   {postalCode}-{city}-{street}-{complement}
 *   → tout en minuscule et espaces remplacés par "_"
 *
 * Exemple :
 *  "49000", "France", "25 Rue Lamarck", "Cite Lakanal"
 *  => "49000-france-25_rue_lamarck-cite_lakanal"
 */

function normalizeAddress({ postalCode, city, street, complement = "" }) {
  if (!postalCode || !city || !street) {
    throw new Error("Impossible de normaliser : champs obligatoires manquants");
  }

  return `${postalCode}-${city}-${street}-${complement}`
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

module.exports = { normalizeAddress };
