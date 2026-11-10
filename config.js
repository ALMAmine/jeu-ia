const LARGEUR = 480; // largeur logique du canvas
const HAUTEUR = 720; // hauteur logique du canvas
const CRISTAL = "cristal"; const BOMBE = "bombe";
const DORE = "dore";
const COULEURS = {
  fond: "#05030f", cyan: "#28f0ff", magenta: "#ff3ea5",
  or: "#ffd166", rouge: "#ff4d6d", blanc: "#f5f7ff",
  grille: "rgba(40, 240, 255, 0.16)"
};
const REGLAGES = {
  viesDepart: 3,
  vitessePanier: 560,    // pixels par seconde au clavier
  vitesseChute: 145,     // vitesse du premier niveau
  vitesseChuteMax: 430,
  intervalleObjet: 0.95, // secondes entre deux objets
  intervalleMin: 0.34,
  dureeNiveau: 18,       // secondes avant d'accélérer
  dureeCombo: 3,         // secondes pour enchaîner
  multiplicateurMax: 5,
  hasardBombe: 0.14,
  hasardDore: 0.05,
  largeurPanier: 96,
  hauteurPanier: 16,
  margePanier: 12
};
const CLE_RECORD = "pluieDeNeonRecord";
const AIMANT = "aimant", BOUCLIER = "bouclier", GLACE = "glace";
Object.assign(REGLAGES, { dureeAimant: 6, rayonAimant: 120, dureeGlace: 4, facteurGlace: 0.35, hasardBonus: 0.09, hasardGlace: 0.02, objectif: 15, pauseNiveau: 1, intervalleBoss: 45, dureeBoss: 8, bombeBoss: 0.8, dureeFrenesie: 30 });
const THEMES = {
  neon: { fond: "#05030f", cyan: "#28f0ff", magenta: "#ff3ea5", grille: "#28f0ff29" },
  sunset: { fond: "#24101a", cyan: "#ffb347", magenta: "#ff6b89", grille: "#ffb34729" },
  foret: { fond: "#031b16", cyan: "#70ffb1", magenta: "#b9e769", grille: "#70ffb129" }
};
