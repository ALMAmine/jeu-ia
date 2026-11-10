# Journal de bord - Outils IA / GitHub Copilot

Nom et prénom : Al Ameraoui Amine
Dépôt : https://github.com/ALMAmine/jeu-ia
Outil réellement utilisé : Codex, selon la variante avec un autre assistant autorisée par le sujet. Les intitulés ci-dessous reprennent les exercices Copilot. Aucune utilisation de ses modes ni revue Copilot n’est revendiquée.

## Demandes exactes adressées à l’assistant

- « fais les défis et déploi sur github t'as accès à mon chrome »
- « ne déploi pas alors à la fin stp »
- « termine et met en avant que c'est copilote pas toi on s'en fout fais en sorte de respecter l'intitulé. go »
- « fais le » (avec le sujet PDF)

## Défi 1 - Complétion : cristaux attrapés

Commentaires ajoutés dans toucherObjet et terminerPartie :

```js
// compte les cristaux attrapés dans la variable cristaux
// affiche le nombre de cristaux attrapés sur l’écran de fin
```

Réalisation par l’assistant : variable cristaux initialisée à zéro, incrément après le filtre des bombes et bonus, affichage dans fin-cristaux. Correction : le compteur total reste distinct de cristauxVague, qui revient à zéro à chaque niveau. Les cristaux dorés comptent également. Le compteur est remis à zéro à chaque partie.

Vérification : test d’exécution avec un cristal ordinaire, un doré, un bonus et une bombe, puis fin et nouvelle partie. Le total attendu est 2 puis 0. La preuve est dans VERIFICATIONS.md. Cette réalisation ne constitue pas une acceptation de suggestion grisée dans VS Code.
