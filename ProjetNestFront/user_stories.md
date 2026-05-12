# 📚 EPIC : Dashboard / Accueil

---

# 🧾 US 1 — Voir toutes les lectures

* **Acteur** : Lecteur qui suit plusieurs séries en parallèle
* **Impact attendu** : Avoir d'un coup d'œil l'état d'avancement global sans ouvrir chaque fiche

> En tant que **lecteur**, je veux **voir toutes mes lectures en cours regroupées au même endroit**, afin de **suivre ma progression globale sans avoir à fouiller dans chaque catégorie**.

---

## 🧪 Scénarios

---

### ✅ Scénario 1 — Affichage des œuvres

* Given des mangas / manhwa / manhua actifs
* When je vais sur la page d'accueil
* Then les œuvres sont affichées

---

### ✅ Scénario 2 — Affichage progression

* Given une œuvre avec :

  * 50 chapitres
  * 25 lus

* Then afficher :

  * `25 / 50`
  * ou `50%`

---

### ❌ Scénario 3 — Aucun résultat

* Given aucune œuvre
* Then afficher :

  * "Aucune lecture en cours"

---

### ⚠️ Scénario 4 — Chargement

* Given la requête API en cours
* Then afficher loader/skeleton

---

### ❌ Scénario 5 — Erreur API

* Given erreur backend
* Then afficher message erreur

---

# 📘 EPIC : Manga / Manhwa / Manhua

> Les US 2 à 5 s'appliquent identiquement aux trois types d'œuvres (manga, manhwa, manhua). Elles sont écrites une fois ici ; la seule différence métier est la présence du champ **auteur** pour le manga.

---

# 🧾 US 2 — Enregistrer une œuvre que je commence

* **Acteur** : Lecteur de manga / manhwa / manhua
* **Impact attendu** : Avoir une fiche de référence à laquelle revenir au lieu de retenir de tête

> En tant que **lecteur**, je veux **enregistrer une œuvre que je commence** (avec son titre, son auteur si pertinent, son nombre de chapitres et sa couverture), afin de **suivre ma progression sans devoir me rappeler de tête où j'en suis**.

---

## 🧪 Scénarios

---

### ✅ Scénario 1 — Création réussie

* Given je remplis tous les champs requis (titre, auteur pour un manga, nombre de chapitres)
* When je valide le formulaire
* Then l'œuvre apparaît dans ma bibliothèque et je vois une confirmation

---

### ❌ Scénario 2 — Champ obligatoire manquant

* Given je laisse le titre vide
* When je valide
* Then un message m'indique que le titre est requis
* And rien n'est créé

---

### 🖼️ Scénario 3 — Aperçu de la couverture

* Given je choisis une image depuis mon ordinateur
* Then un aperçu s'affiche immédiatement avant validation

---

### ⚠️ Scénario 4 — Soumission en cours

* Given j'ai validé le formulaire
* When la création est en cours
* Then le bouton est désactivé pour éviter un double envoi

---

### ❌ Scénario 5 — Échec d'enregistrement

* Given une erreur survient lors de l'enregistrement
* Then je reste sur le formulaire
* And un message m'invite à réessayer

---

# 🧾 US 3 — Parcourir ma bibliothèque

* **Acteur** : Lecteur ayant déjà enregistré plusieurs œuvres
* **Impact attendu** : Choisir rapidement quelle œuvre reprendre

> En tant que **lecteur**, je veux **voir toutes les œuvres de ma bibliothèque d'un seul coup d'œil**, afin de **choisir laquelle reprendre sans avoir à fouiller**.

---

## 🧪 Scénarios

---

### ✅ Scénario 1 — Catalogue affiché

* Given j'ai plusieurs œuvres enregistrées
* When j'ouvre la page Mangas (ou Manhwas / Manhuas)
* Then chaque œuvre est représentée par une carte avec sa couverture, son titre et sa progression

---

### ❌ Scénario 2 — Bibliothèque vide

* Given je n'ai encore enregistré aucune œuvre
* Then un message m'invite à ajouter ma première œuvre

---

### 🚫 Scénario 3 — Œuvres mises de côté visibles mais distinctes

* Given certaines de mes œuvres sont marquées comme désactivées
* Then elles apparaissent grisées avec un repère visuel "Désactivé"
* And je ne peux plus agir dessus (pas de boutons d'action)

---

# 🧾 US 4 — Marquer ma progression au fil de mes lectures

* **Acteur** : Lecteur qui vient de finir un chapitre, ou qui constate qu'un nouveau chapitre est paru
* **Impact attendu** : Maintenir un compteur fiable en deux secondes au lieu d'éditer une fiche complète

> En tant que **lecteur en cours de lecture**, je veux **incrémenter d'un clic le nombre de chapitres lus, ou le nombre de chapitres parus**, afin de **garder ma progression à jour sans saisie laborieuse**.

---

## 🧪 Scénarios

---

### ✅ Scénario 1 — Je viens de lire un chapitre

* Given je suis sur la fiche d'une œuvre où j'ai lu 24 chapitres sur 50
* When je clique sur "+1 lu"
* Then la fiche affiche immédiatement `25 / 50`

---

### ✅ Scénario 2 — Un nouveau chapitre est paru

* Given une œuvre affiche 50 chapitres au total
* When je clique sur "+1 chapitre"
* Then le total passe à 51

---

### ❌ Scénario 3 — Je suis déjà à jour

* Given j'ai lu tous les chapitres parus (lus = total)
* When je clique sur "+1 lu"
* Then le compteur ne bouge pas
* And un message m'indique que je suis à jour

---

### ⚠️ Scénario 4 — La sauvegarde échoue

* Given je clique sur "+1 lu" et la sauvegarde échoue
* Then la fiche revient à sa valeur précédente
* And un message me prévient

> Note : la valeur s'affiche immédiatement à l'écran, la confirmation serveur arrive ensuite. La stratégie d'implémentation (mise à jour optimiste, rollback) reste un choix technique hors de la story.

---

# 🧾 US 5 — Mettre de côté une œuvre que je ne suis plus

* **Acteur** : Lecteur qui a fini ou abandonné une série
* **Impact attendu** : Désencombrer la vue principale sans perdre la trace de ce qu'on a lu

> En tant que **lecteur**, je veux **mettre de côté une œuvre que j'ai finie ou abandonnée**, afin de **désencombrer ma vue principale sans pour autant perdre l'historique de ma lecture**.

---

## 🧪 Scénarios

---

### ✅ Scénario 1 — Confirmation avant action

* Given je clique sur "Désactiver" sur une fiche
* Then une confirmation m'est demandée avant que l'action ne prenne effet

---

### ✅ Scénario 2 — Mise de côté effective

* Given je confirme la désactivation
* Then la fiche bascule en mode désactivé (grisée, tampon "Désactivé" visible, boutons d'action retirés)

---

### ❌ Scénario 3 — Annulation

* Given la confirmation s'affiche
* When je clique sur "Annuler"
* Then aucun changement n'est appliqué

---

### ⚠️ Scénario 4 — Échec de la désactivation

* Given la sauvegarde échoue
* Then la fiche reste active
* And un message m'invite à réessayer

---

# 🌐 EPIC : Import automatique

---

# 🧾 US 6 — Peupler ma bibliothèque depuis une source externe

* **Acteur** : Nouveau venu qui suit déjà une liste sur une plateforme externe
* **Impact attendu** : Lever la barrière de la saisie initiale pour arriver vite à une bibliothèque utile

> En tant que **lecteur déjà actif sur une plateforme externe**, je veux **importer en une fois la liste des œuvres que j'y suis**, afin de **ne pas avoir à retaper plusieurs dizaines de titres pour commencer à utiliser l'app**.

> 💡 Les noms de plateformes (MangaPlus, Raijin…) sont des **exemples concrets** au sens *Specification by Example*, pas des US séparées. Ils décrivent la **règle métier** sous une forme vérifiable.

---

## 🧪 Scénarios

---

### ✅ Scénario 1 — Import réussi

* Given je lance un import depuis une source que je suis (ex. MangaPlus, ex. Raijin)
* Then les œuvres apparaissent dans ma bibliothèque avec leurs métadonnées de base
* And un retour visuel m'indique combien ont été ajoutées

---

### ⚠️ Scénario 2 — Doublons

* Given une partie des œuvres existe déjà dans ma bibliothèque
* Then ces œuvres sont ignorées
* And un message me dit combien ont été sautées
* Exemple : *"12 œuvres importées, 3 ignorées (déjà présentes)"*

---

### ❌ Scénario 3 — Source indisponible

* Given la source externe ne répond pas ou refuse l'accès
* Then un message m'indique que l'import a échoué
* And m'invite à réessayer

---

### ⚠️ Scénario 4 — Import en cours

* Given un import peut prendre plusieurs secondes
* Then un indicateur de chargement reste visible jusqu'à la fin

---

# 🔍 EPIC : Recherche

---

# 🧾 US 7 — Retrouver une œuvre dans une grande bibliothèque

* **Acteur** : Lecteur dont la bibliothèque dépasse une vingtaine d'œuvres
* **Impact attendu** : Accéder à une fiche précise en deux ou trois lettres au lieu de scroller

> En tant que **lecteur ayant beaucoup d'œuvres enregistrées**, je veux **filtrer ma bibliothèque par titre au fil de la frappe**, afin de **retrouver une fiche en quelques lettres au lieu de parcourir une grille entière**.

---

## 🧪 Scénarios

---

### ✅ Scénario 1 — Filtrage immédiat

* Given ma bibliothèque contient "Berserk", "Bleach", "Vagabond"
* When je tape `ber` dans la barre de recherche
* Then seul "Berserk" reste affiché

---

### ⚠️ Scénario 2 — Filtrage au fil de la frappe

* Given je tape lettre par lettre
* Then la liste se met à jour pendant que je tape
* And je n'ai pas besoin de valider explicitement

---

### ❌ Scénario 3 — Aucun résultat

* Given je tape un terme qui ne correspond à aucune œuvre
* Then un message m'indique qu'aucun résultat ne correspond à ma recherche

---

### 🔄 Scénario 4 — Effacer la recherche

* Given j'efface ma recherche
* Then la totalité de mes œuvres réapparaît

---

# 📋 EXIGENCES TRANSVERSALES (Definition of Done)

> Les anciennes **US 8 (Responsive)** et **US 9 (Feedback utilisateur)** ne sont pas des user stories au sens du cours : elles ne décrivent pas un comportement métier autonome avec un acteur qui poursuit un objectif. Ce sont des **exigences non-fonctionnelles** qui s'appliquent à **toutes** les US ci-dessus.
>
> Elles sont donc déplacées ici, en *Definition of Done*. Aucune US n'est considérée comme terminée si ces critères ne sont pas remplis.

---

## 📱 Responsive — s'applique à toutes les pages

* Les cartes s'adaptent à un écran mobile (grille 2 colonnes minimum)
* La navigation reste utilisable au doigt (zones tactiles ≥ 44 px)
* Les boutons d'action restent accessibles sans scroll horizontal

---

## 🎨 Feedback utilisateur — s'applique à toutes les actions

* Chaque action utilisateur produit un retour visible :
  * succès → confirmation visible (texte de succès, fermeture de modale, mise à jour de la liste)
  * erreur → message d'erreur explicite avec invitation à réessayer
  * action en cours → bouton désactivé et/ou indicateur de chargement

---

# 🧪 TESTS FRONTEND À FAIRE

Tu peux faire :

---

## Unit tests

Avec :

* Vitest
* React Testing Library

👉 tester :

* composants
* hooks
* logique UI

---

## E2E

Avec :

* Playwright

👉 tester :

* vrai flow utilisateur

---

# 🚀 WORKFLOW TDD FRONT

Pour CHAQUE composant :

---

### 1. Écrire scénarios

👉 Given / When / Then

---

### 2. Écrire tests

👉 FAIL ❌

---

### 3. Validation

👉 "OK on passe en vert"

---

### 4. Implémentation minimale

---

### 5. Refactor

---
