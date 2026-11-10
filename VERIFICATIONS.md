# Vérifications du 10 novembre 2026

- `node --check` : réussi sur les cinq fichiers JavaScript.
- Tests d’exécution Node avec DOM et audio simulés : réussis pour les bonus, le bouclier non cumulable, les dégâts, les vagues, le boss, la frénésie, les records séparés et les thèmes.
- Compteur total : cristal ordinaire + doré = 2 ; bonus et bombe ne comptent pas ; écran de fin = 2 ; nouvelle partie = 0. Test réussi.
- Chute à 100 px/s pendant 0,1 seconde : 10 px sans glace, 3,5 px sous glace ; vitesse stockée inchangée. Test réussi.
- Chrome local : titre affiché, thème Forêt sélectionnable, frénésie démarrée, chrono visible, fin automatique et record séparé observés.
- Une erreur de présentation a été corrigée : le formulaire de pseudo est masqué en frénésie avec une règle CSS explicite `[hidden]`.

Limites : le DOM simulé ne prouve pas le rendu graphique ; le contrôle dans Chrome complète ces tests. Aucun test sur téléphone physique, la revue Copilot est indisponible dans le sélecteur des reviewers. Les fichiers restent utilisables en ouvrant index.html sans serveur.

Publication : https://almamine.github.io/jeu-ia/ vérifiée avec une réponse HTTP 200 et dans Chrome ; écran titre et démarrage de partie normale observés sur le site public. Pull request #1 fusionnée.
