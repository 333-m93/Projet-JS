# Prison Escape

Prison Escape est un jeu de plateforme 2D inspire des classiques retro.
Le joueur controle un prisonnier qui doit progresser dans le niveau, eviter les obstacles et ne pas se faire rattraper.

## Objectif du jeu

- Controler le prisonnier
- Eviter les dangers et les collisions
- Franchir les plateformes
- Atteindre la fin du niveau pour gagner

## Commandes

- Fleche gauche: se deplacer a gauche
- Fleche droite: se deplacer a droite
- Fleche haut ou Espace: sauter

## Fonctionnalites

- Deplacements fluides avec inertie
- Saut et collisions avec le decor
- Rendu 2D canvas avec scene dynamique
- Ecran d accueil avec authentification locale
- Systeme de victoire et de defaite

## Technologies

- HTML5
- CSS3
- JavaScript (modules ES)
- Go (serveur HTTP local)

## Structure du projet

- html/: pages du jeu (accueil et niveau)
- css/: styles des pages
- js/: logique gameplay, rendu et controles
- server/: serveur Go reutilisable
- main.go: point d entree serveur principal

## Lancer le projet

### Option 1 - Serveur Go (recommande)

1. Installer Go
2. Se placer a la racine du projet
3. Executer:

go run main.go

4. Ouvrir le navigateur sur:

http://localhost:8080

### Option 2 - Fichier statique

Tu peux ouvrir html/home.html directement dans le navigateur, mais certaines fonctions sont plus stables via un serveur local.

## Authentification

Le systeme d inscription/connexion est stocke en local dans le navigateur via localStorage.
Ce mecanisme est utile pour une demo, mais ne doit pas etre utilise tel quel en production.

## Pistes d amelioration

- Ajouter plusieurs niveaux
- Ajouter un menu pause/restart
- Ajouter des effets sonores et musique
- Ajouter un systeme de score et chrono
- Renforcer la securite de l authentification

## Auteur

Projet realise dans le cadre d un projet JavaScript/Go.
