const canvas = document.getElementById("jeu"); const ctx = canvas.getContext("2d");
const scene = document.getElementById("scene"); const ecranTitre = document.getElementById("ecran-titre");
const ecranFin = document.getElementById("ecran-fin"); const elementScore = document.getElementById("score");
const elementNiveau = document.getElementById("niveau"); const elementCombo = document.getElementById("combo");
const elementComboValeur = document.getElementById("combo-valeur"); const elementComboJauge = document.getElementById("combo-jauge");
const elementVies = document.getElementById("vies").getElementsByTagName("i"); const boutonSon = document.getElementById("bouton-son");
const boutonJouer = document.getElementById("bouton-jouer"); const boutonRejouer = document.getElementById("bouton-rejouer");
const recordTitre = document.getElementById("record-titre"); const finScore = document.getElementById("fin-score");
const finRecord = document.getElementById("fin-record"); const badgeRecord = document.getElementById("badge-record");
let mode = "normal", aimant = 0, glace = 0, bouclier = false, cristauxVague = 0, pauseNiveau = 0; let chronoMode = 30, prochainBoss = 45, boss = null, scoreSauve = false;
let classement = [], recordFrenesie = 0; let etat = "titre";
let score = 0; let cristaux = 0; let record = 0;
let vies = REGLAGES.viesDepart; let niveau = 1;
let tempsJeu = 0; let combo = 0;
let chronoCombo = 0; let objets = [];
let chronoSpawn = 0; let dernierTemps = 0;
let panier = { x: LARGEUR / 2 - REGLAGES.largeurPanier / 2, y: HAUTEUR - 74, largeur: REGLAGES.largeurPanier, hauteur: REGLAGES.hauteurPanier, vitesse: 0, cibleX: null };
let touches = {};
function lireRecord() {
  try { return parseInt(localStorage.getItem(CLE_RECORD), 10) || 0; } catch (erreur) { return 0; }
}
function ecrireRecord() {
  try { localStorage.setItem(CLE_RECORD, String(record)); } catch (erreur) {}
}
function multiplicateur() {
  return Math.min(REGLAGES.multiplicateurMax, 1 + Math.floor(combo / 3));
}
function majHud() {
  elementScore.textContent = score;
  elementNiveau.textContent = mode === "frenesie" ? "FRÉNÉSIE " + Math.ceil(chronoMode) + " S" : "NIVEAU " + niveau + " · " + cristauxVague + "/" + REGLAGES.objectif;
  document.getElementById("vies").style.visibility = mode === "frenesie" ? "hidden" : "visible";
  document.getElementById("bonus").textContent = [aimant > 0 ? "AIMANT " + Math.ceil(aimant) + " s" : "", glace > 0 ? "GLACE " + Math.ceil(glace) + " s" : "", bouclier ? "BOUCLIER ACTIF" : ""].filter(Boolean).join(" · ");
  elementComboValeur.textContent = "x" + multiplicateur(); elementCombo.classList.toggle("fort", multiplicateur() > 1);
  for (let i = 0; i < elementVies.length; i++) {
    elementVies[i].classList.toggle("perdue", i >= vies);
  }
  elementComboJauge.style.transform = "scaleX(" + Math.max(0, chronoCombo / REGLAGES.dureeCombo) + ")";
}
function demarrerPartie() {
  preparerAudio(); aimant = 0; glace = 0; bouclier = false; cristauxVague = 0; pauseNiveau = 0;
  chronoMode = REGLAGES.dureeFrenesie; prochainBoss = REGLAGES.intervalleBoss; boss = null; scoreSauve = false;
  document.getElementById("form-score").hidden = mode === "frenesie"; document.getElementById("score-enregistre").textContent = "";
  document.querySelector("#form-score button").disabled = false; etat = "jeu"; score = 0; cristaux = 0; vies = REGLAGES.viesDepart; niveau = 1; tempsJeu = 0;
  combo = 0; chronoCombo = 0; objets = []; chronoSpawn = 0.45; panier.x = LARGEUR / 2 - panier.largeur / 2; panier.cibleX = null; panier.vitesse = 0;
  ecranTitre.classList.add("cache"); ecranFin.classList.add("cache"); scene.dataset.etat = "jeu"; majHud(); sonClic();
}
function terminerPartie() {
  etat = "fin"; const nouveauRecord = score > (mode === "frenesie" ? recordFrenesie : record);
  if (mode === "frenesie") { recordFrenesie = Math.max(recordFrenesie, score); try { localStorage.setItem("neonFrenesie", recordFrenesie); } catch (erreur) {} }
  else if (nouveauRecord) { record = score; ecrireRecord(); }
  creerParticules(panier.x + panier.largeur / 2, panier.y, COULEURS.cyan, 26, 280); secouer(20); flasher(COULEURS.blanc, 0.4); finScore.textContent = score;
  finRecord.textContent = mode === "frenesie" ? recordFrenesie : record; badgeRecord.classList.toggle("cache", !nouveauRecord); scene.dataset.etat = "fin";
  ecranFin.classList.remove("cache");
  if (nouveauRecord) setTimeout(sonRecord, 250);
}
function creerObjet() {
  const tirage = Math.random(); let type = CRISTAL;
  if (tirage < Math.min(0.42, REGLAGES.hasardBombe + (niveau - 1) * 0.03)) type = BOMBE;
  else if (tirage > 1 - REGLAGES.hasardDore) type = DORE;
  if (type === CRISTAL && tirage < Math.min(0.42, REGLAGES.hasardBombe + (niveau - 1) * 0.03) + REGLAGES.hasardGlace) type = GLACE;
  else if (type === CRISTAL && Math.random() < REGLAGES.hasardBonus) type = Math.random() < 0.5 ? AIMANT : BOUCLIER;
  const rayon = type === DORE ? 17 : type === BOMBE ? 15 : 13; const vitesse = Math.min(REGLAGES.vitesseChuteMax, REGLAGES.vitesseChute + (niveau - 1) * 28);
  objets.push({
    type: type, x: hasard(rayon + 12, LARGEUR - rayon - 12), y: -rayon - 8, rayon: rayon,
    vitesse: vitesse * hasard(0.85, 1.15), rotation: Math.random() * 6.28,
    vitesseRotation: hasard(-2.2, 2.2), pulsation: Math.random() * 10
  });
}
function majPanier(dt) {
  const direction = (touches.ArrowRight || touches.KeyD ? 1 : 0) - (touches.ArrowLeft || touches.KeyA ? 1 : 0); const avant = panier.x;
  if (direction !== 0) {
    panier.x += direction * REGLAGES.vitessePanier * dt;
    panier.cibleX = panier.x + panier.largeur / 2;
  } else if (panier.cibleX !== null) {
    panier.x += (panier.cibleX - panier.largeur / 2 - panier.x) * Math.min(1, dt * 16);
  }
  panier.x = Math.max(REGLAGES.margePanier, Math.min(LARGEUR - panier.largeur - REGLAGES.margePanier, panier.x));
  panier.vitesse = (panier.x - avant) / Math.max(dt, 0.001);
}
function estAttrape(objet) {
  return objet.y + objet.rayon >= panier.y &&
    objet.y - objet.rayon <= panier.y + panier.hauteur &&
    objet.x + objet.rayon * 0.5 >= panier.x &&
    objet.x - objet.rayon * 0.5 <= panier.x + panier.largeur;
}
function toucherObjet(objet) {
  if ([AIMANT, BOUCLIER, GLACE].includes(objet.type)) {
    if (objet.type === AIMANT) aimant = REGLAGES.dureeAimant;
    if (objet.type === GLACE) glace = REGLAGES.dureeGlace;
    if (objet.type === BOUCLIER) bouclier = true;
    ajouterTexte(objet.x, objet.y, objet.type.toUpperCase(), COULEURS.cyan); sonBonus(); return;
  }
  if (objet.type === BOMBE) {
    if (bouclier) { bouclier = false; creerParticules(objet.x, objet.y, COULEURS.cyan, 32, 240); ajouterTexte(objet.x, objet.y - 25, "BOUCLIER BRISÉ", COULEURS.cyan); sonBouclier(); return; }
    creerParticules(objet.x, objet.y, COULEURS.magenta, 28, 320);
    perdreVie(objet.x, objet.y, true);
    return;
  }
  combo += 1;
  chronoCombo = REGLAGES.dureeCombo;
  const multi = multiplicateur(); const points = (objet.type === DORE ? 50 : 10) * multi * (mode === "frenesie" ? 2 : 1);
  // compte les cristaux attrapés dans la variable cristaux
  cristaux++; cristauxVague++;
  if (cristauxVague >= REGLAGES.objectif && mode === "normal") { pauseNiveau = REGLAGES.pauseNiveau; ajouterTexte(LARGEUR / 2, 280, "NIVEAU RÉUSSI", COULEURS.cyan); sonNiveau(); }
  const couleur = objet.type === DORE ? COULEURS.or : COULEURS.cyan;
  score += points;
  creerParticules(objet.x, objet.y, couleur, objet.type === DORE ? 24 : 14, 280);
  ajouterTexte(objet.x, objet.y - 10, "+" + points, couleur);
  if (objet.type === DORE) { sonDore(); flasher(COULEURS.or, 0.18); }
  else { sonCristal(multi); flasher(COULEURS.cyan, 0.06); }
  secouer(3);
}
function perdreVie(x, y, bombe) {
  if (mode === "frenesie") { if (bombe) { chronoMode = Math.max(0, chronoMode - 3); ajouterTexte(x, y - 25, "-3 SECONDES", COULEURS.rouge); sonBombe(); if (chronoMode <= 0) terminerPartie(); } return; }
  vies -= 1;
  combo = 0;
  chronoCombo = 0;
  creerParticules(x, y, COULEURS.rouge, 24, 260);
  secouer(12);
  flasher(COULEURS.rouge, 0.3);
  ajouterTexte(panier.x + panier.largeur / 2, panier.y - 28, "-1 VIE", COULEURS.rouge);
  if (bombe) sonBombe();
  else sonPerte();
  if (vies <= 0) terminerPartie();
}
function mettreAJour(dt) {
  mettreAJourEffets(dt);
  if (etat !== "jeu") return;
  tempsJeu += dt;
  if (pauseNiveau > 0) {
    pauseNiveau = Math.max(0, pauseNiveau - dt);
    if (pauseNiveau === 0) { niveau++; cristauxVague = 0; }
    majHud(); return;
  }
  aimant = Math.max(0, aimant - dt); glace = Math.max(0, glace - dt);
  if (mode === "frenesie") { chronoMode = Math.max(0, chronoMode - dt); if (chronoMode === 0) { terminerPartie(); majHud(); return; } }
  if (!boss && tempsJeu >= prochainBoss) { boss = { x: 40, temps: REGLAGES.dureeBoss, bombe: 0 }; prochainBoss += REGLAGES.intervalleBoss; sonAlarme(); }
  if (boss) {
    boss.temps -= dt; boss.x = 50 + (LARGEUR - 100) * (0.5 + 0.5 * Math.sin(tempsJeu * 1.4)); boss.bombe -= dt;
    if (boss.bombe <= 0) { objets.push({ type: BOMBE, x: boss.x, y: 95, rayon: 15, vitesse: 200, rotation: 0, vitesseRotation: 2, pulsation: 0 }); boss.bombe += REGLAGES.bombeBoss; }
    if (boss.temps <= 0) boss = null;
  }
  if (chronoCombo > 0) {
    chronoCombo -= dt;
    if (chronoCombo <= 0) { chronoCombo = 0; combo = 0; }
  }
  majPanier(dt);
  chronoSpawn -= dt;
  if (chronoSpawn <= 0) {
    creerObjet();
    chronoSpawn = Math.max(REGLAGES.intervalleMin, REGLAGES.intervalleObjet - (niveau - 1) * 0.075) * hasard(0.8, 1.15) / (mode === "frenesie" ? 2 : 1);
  }
  for (let i = objets.length - 1; i >= 0; i--) {
    const objet = objets[i];
    if (aimant > 0 && [CRISTAL, DORE].includes(objet.type) && Math.hypot(objet.x - panier.x - panier.largeur / 2, objet.y - panier.y) < REGLAGES.rayonAimant) objet.x += (panier.x + panier.largeur / 2 - objet.x) * Math.min(1, dt * 8);
    objet.y += objet.vitesse * dt * (glace > 0 ? REGLAGES.facteurGlace : 1);
    objet.rotation += objet.vitesseRotation * dt;
    if (objet.type === DORE && Math.random() < dt * 18) {
      creerParticules(objet.x, objet.y, COULEURS.or, 1, 30);
    }
    if (estAttrape(objet)) {
      objets.splice(i, 1);
      toucherObjet(objet);
      if (etat !== "jeu" || pauseNiveau > 0) break;
    } else if (objet.y - objet.rayon > HAUTEUR + 20) {
      objets.splice(i, 1);
      if (objet.type === CRISTAL) { perdreVie(objet.x, HAUTEUR - 30, false); if (etat !== "jeu") break; }
      else if (objet.type === DORE) ajouterTexte(objet.x, HAUTEUR - 40, "CRISTAL DORÉ PERDU", COULEURS.or);
    }
  }
  majHud();
}
function dessiner() {
  ctx.clearRect(0, 0, LARGEUR, HAUTEUR);
  const temps = performance.now() / 1000;
  dessinerFond(ctx, temps);
  ctx.save();
  if (forceSecousse > 0) {
    ctx.translate(hasard(-forceSecousse, forceSecousse), hasard(-forceSecousse, forceSecousse));
  }
  if (etat !== "titre") {
    dessinerPanier(ctx, panier, temps);
    dessinerBonus(ctx, panier, aimant, bouclier, boss);
    for (const objet of objets) dessinerObjet(ctx, objet, temps);
  }
  dessinerEffets(ctx);
  ctx.restore();
  dessinerFlash(ctx);
}
function positionX(evenement) {
  const zone = canvas.getBoundingClientRect();
  return Math.max(0, Math.min(LARGEUR, (evenement.clientX - zone.left) * (LARGEUR / zone.width)));
}
window.addEventListener("keydown", function (evenement) {
  if (["INPUT", "BUTTON"].includes(evenement.target.tagName)) return;
  const code = evenement.code;
  if (["ArrowLeft", "ArrowRight", "Space", "KeyA", "KeyD", "Enter"].includes(code)) evenement.preventDefault();
  touches[code] = true;
  preparerAudio();
  if ((code === "Space" || code === "Enter") && etat !== "jeu") demarrerPartie();
});
window.addEventListener("keyup", function (evenement) { touches[evenement.code] = false; });
window.addEventListener("blur", function () { touches = {}; });
canvas.addEventListener("pointermove", function (evenement) {
  panier.cibleX = positionX(evenement);
  if (etat === "jeu") preparerAudio();
});
canvas.addEventListener("pointerdown", function (evenement) {
  preparerAudio();
  panier.cibleX = positionX(evenement);
  if (canvas.setPointerCapture) canvas.setPointerCapture(evenement.pointerId);
});
boutonJouer.addEventListener("click", function () { mode = "normal"; demarrerPartie(); });
document.getElementById("bouton-frenesie").addEventListener("click", function () { mode = "frenesie"; demarrerPartie(); });
boutonRejouer.addEventListener("click", demarrerPartie);
document.getElementById("bouton-menu").addEventListener("click", function () { location.reload(); });
boutonSon.addEventListener("click", function () {
  basculerSon();
  boutonSon.textContent = sonActif ? "SON ACTIF" : "SON COUPÉ";
  boutonSon.setAttribute("aria-pressed", sonActif ? "true" : "false");
  if (sonActif) sonClic();
});
function boucle(horodatage) {
  const dt = Math.min((horodatage - dernierTemps) / 1000, 0.033);
  dernierTemps = horodatage;
  mettreAJour(dt);
  dessiner();
  requestAnimationFrame(boucle);
}
record = lireRecord();
recordTitre.textContent = record;
majHud();
requestAnimationFrame(boucle);
function afficherClassement() {
  const liste = document.getElementById("classement"); liste.replaceChildren();
  for (const entree of classement) { const ligne = document.createElement("li"); ligne.textContent = entree.pseudo + " · " + entree.score; liste.appendChild(ligne); }
}
function choisirTheme(nom) {
  if (!THEMES[nom]) nom = "neon";
  Object.assign(COULEURS, THEMES[nom]);
  document.body.style.setProperty("--accent-bonus", COULEURS.cyan); document.body.style.setProperty("--fond-bonus", COULEURS.fond);
  for (const bouton of document.querySelectorAll("[data-theme]")) bouton.setAttribute("aria-pressed", String(bouton.dataset.theme === nom));
  try { localStorage.setItem("neonTheme", nom); } catch (erreur) {}
}
for (const bouton of document.querySelectorAll("[data-theme]")) bouton.addEventListener("click", function () { choisirTheme(bouton.dataset.theme); });
document.getElementById("form-score").addEventListener("submit", function (evenement) {
  evenement.preventDefault(); if (etat !== "fin" || mode !== "normal" || scoreSauve) return;
  const pseudo = document.getElementById("pseudo").value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3); if (!pseudo) return;
  classement.push({ pseudo: pseudo, score: score }); classement.sort(function (a, b) { return b.score - a.score; }); classement = classement.slice(0, 5);
  try { localStorage.setItem("neonClassement", JSON.stringify(classement)); } catch (erreur) {}
  scoreSauve = true; document.querySelector("#form-score button").disabled = true; document.getElementById("score-enregistre").textContent = "Score enregistré"; afficherClassement();
});
try {
  const donnees = JSON.parse(localStorage.getItem("neonClassement") || "[]");
  if (Array.isArray(donnees)) classement = donnees.filter(function (e) { return e && /^[A-Z]{1,3}$/.test(e.pseudo) && Number.isFinite(e.score) && e.score >= 0; }).sort(function (a, b) { return b.score - a.score; }).slice(0, 5);
  recordFrenesie = Math.max(0, Number(localStorage.getItem("neonFrenesie")) || 0); choisirTheme(localStorage.getItem("neonTheme"));
} catch (erreur) { choisirTheme("neon"); }
afficherClassement();
