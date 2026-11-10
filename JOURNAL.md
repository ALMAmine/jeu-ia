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

## Défi 2 - Ask : comprendre avant de modifier

Question du sujet étudiée par l’assistant pendant cette réalisation (pas une conversation VS Code Ask) :

> Je suis en Bachelor 1, j'ai fait un peu de Go. Explique jeu.js : comment fonctionnent la boucle du jeu, la chute des objets et la détection de l'objet attrapé ? Une phrase par partie.

Réponse : requestAnimationFrame rappelle boucle, qui calcule dt puis met à jour et dessine ; la chute ajoute vitesse × dt à y, avec le facteur de glace quand il est actif ; estAttrape vérifie le chevauchement vertical et horizontal avec le panier.

Deuxième question étudiée : « Comment le combo est-il remis à zéro ? » Réponse : par expiration de chronoCombo, par perdreVie en mode normal et au démarrage d’une partie.

Affirmation vérifiée : la glace ralentit les objets à 35 % sans modifier leur vitesse de référence. Test : désactiver les apparitions, placer un objet hors collision et comparer son déplacement sur 0,1 seconde avec puis sans glace. Attendu : 3,5 px contre 10 px pour une vitesse de 100 px/s. Verdict : voir VERIFICATIONS.md. Aucun réglage de test n’est conservé dans le jeu.

## Défi 3 - Plan : décider avant de coder

La spécification et le plan sont dans PLAN.md. Il s’agit d’une relecture du bonus déjà codé, et non d’une session Copilot Plan passée. Contraintes ajoutées : probabilité de glace indépendante et réglable, vitesse de référence inchangée, critère de vérification chiffré. Ces ajustements évitent une rareté implicite et un ralentissement cumulatif.

## Défi 4 - Agent : réalisation et relecture

Branche locale : defi-agent. Travail effectué par Codex, variante autorisée dans le sujet. Les huit extensions avaient été réalisées avant réception du PDF : le commit de départ les conserve et les commits suivants montrent les corrections, sans fabriquer une chronologie Copilot.

Spécification de suivi : appliquer les contraintes de PLAN.md, conserver le bouclier à une charge et les trois thèmes. Fichiers relus : jeu.js, config.js, dessin.js, audio.js, index.html, style.css. Les instructions du dépôt précisent désormais le thème et le bouclier.

Corrections effectuées : séparer la rareté de la glace ; empêcher les bonus et bombes d’incrémenter le compteur ; arrêter le traitement après la fin de partie ; masquer le formulaire de pseudo en frénésie malgré la règle CSS display:flex. Les tests du bouclier et du changement de thème vérifient les règles indiquées dans les instructions.

## Défi 5 - Pull request, revue et publication

Préparé localement dans PR_DESCRIPTION.md. Aucun push, aucune pull request, aucune revue Copilot et aucun déploiement : l’utilisateur a expressément demandé de ne pas déployer. Aucun lien de jeu public n’est inventé. Cette preuve du défi 5 reste donc à réaliser si la publication est autorisée ultérieurement.

## Bilan

L’assistant a réalisé les extensions et les tests rapidement. La lecture du sujet a révélé le compteur total manquant et la nécessité de distinguer les preuves réelles des modes Copilot. Les cinq défis ne peuvent pas être présentés comme intégralement validés sans la preuve de publication et de revue.
