# Défi 3 - Plan : cristal de glace

Spécification exacte du sujet, étudiée avec l’assistant utilisé :

> Je veux ajouter un cristal de glace, plus rare que le doré. Quand on l'attrape, tous les objets ralentissent pendant 4 secondes, puis reprennent leur vitesse. Respecte les règles de .github/copilot-instructions.md. Propose un plan sans modifier le code.

## Plan adapté à l’état actuel

La glace existe déjà dans les extensions locales. Ce plan sert à la relire et la fiabiliser ; il ne prétend pas avoir précédé son implémentation initiale.

1. Donner à la glace une probabilité propre dans config.js, inférieure au doré.
2. Garder sa durée (4 secondes) et son facteur (0,35) dans config.js.
3. À la prise, réinitialiser son chrono à 4 secondes ; plusieurs prises ne multiplient pas le ralentissement.
4. Appliquer le facteur au déplacement sans modifier la vitesse stockée des objets.
5. Conserver un symbole G bleu clair et un compteur visible dans le HUD.
6. Réinitialiser le bonus au début de chaque partie.

## Contraintes ajoutées et justification

- La fréquence doit être un réglage propre, pour vérifier directement qu’elle est inférieure à celle du doré.
- Aucun recalcul permanent des vitesses : cela évite de cumuler les ralentissements.
- Le thème choisi ne modifie jamais les couleurs des bombes.

## Comment vérifier dans le jeu

Attraper un G, observer le compteur de 4 secondes et le ralentissement, puis le retour à la vitesse normale. Pour provoquer une apparition, changer temporairement les probabilités uniquement dans une copie de test, puis remettre les valeurs. Un test d’exécution vérifie également 10 px sans glace et 3,5 px avec glace.
