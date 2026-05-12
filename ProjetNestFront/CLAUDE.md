# 🧩 EPIC GLOBAL FRONTEND

**Création de l’interface utilisateur de la mangathèque**

👉 Objectif :
Permettre à l’utilisateur de :

* consulter ses œuvres
* suivre sa progression
* ajouter/modifier/supprimer des œuvres
* importer automatiquement des œuvres
* avoir une interface claire et responsive

---

# 🧱 ARCHITECTURE FRONTEND (TON CONTEXTE)

👉 Stack probable dans ton cas :

* Front : React
* API : NestJS
* Styling : Tailwind CSS
* Fetch API / Axios
* Architecture Vertical Slice également côté front

---

# 🧩 ORGANISATION FRONTEND (VERTICAL SLICE)

```bash
src/
  manga/
    add-manga/
    manga-list/
    manga-card/
    update-chapters/

  manhwa/
  manhua/

  reading/
    all-reading/

  shared/
    components/
    services/
    hooks/
```

---

# 🧪 MÉTHODOLOGIE TDD FRONT

Pour CHAQUE composant/page :

---

## 🔴 Étape 1 — Tests UI

* rendu composant
* interaction utilisateur
* appels API
* gestion erreurs/loading

👉 Les tests doivent FAIL

---

## ⏸️ Étape 2 — Validation

👉 Tu dis :
**"OK on passe en vert sur [slice front]"**

---

## 🟢 Étape 3 — Implémentation minimale

---

# 📚 EPIC : Dashboard / Accueil

---

# 🧾 US 1 — Voir toutes les lectures

**En tant qu’utilisateur**
Je veux voir toutes mes lectures actives
Afin de suivre ma progression globale

---

## 🧪 Scénarios

---

### ✅ Scénario 1 — Affichage des œuvres

* Given des mangas/manhwa/manhua actifs
* When je vais sur la page d’accueil
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

# 📘 EPIC : Manga

---

# 🧾 US 2 — Ajouter un manga

**En tant qu’utilisateur**
Je veux ajouter un manga
Afin de l’ajouter à ma bibliothèque

---

## 🧪 Scénarios

---

### ✅ Scénario 1 — Formulaire valide

* Given tous les champs remplis
* When submit
* Then création réussie

---

### ❌ Scénario 2 — Champ vide

* Given titre vide
* Then erreur validation affichée

---

### 🖼️ Scénario 3 — Upload image

* Given une image sélectionnée
* Then aperçu image affiché

---

### ⚠️ Scénario 4 — Loading

* Given submit en cours
* Then bouton désactivé

---

### ❌ Scénario 5 — Erreur backend

* Given erreur API
* Then toast/message erreur

---

# 🧾 US 3 — Voir la liste des mangas

---

## 🧪 Scénarios

### ✅

* affiche tous les mangas actifs

---

### ❌

* affiche état vide si aucun manga

---

### 🔍

* possibilité de rechercher par titre

---

# 🧾 US 4 — Modifier progression manga

---

## 🧪 Scénarios

---

### ✅ Ajouter chapitre lu

* Given manga affiché
* When clic "+1 lu"
* Then UI mise à jour

---

### ✅ Ajouter chapitre total

* When clic "+1 chapitre"
* Then total augmente

---

### ❌ Empêcher dépassement

* Given lus = total
* When clic "+1 lu"
* Then erreur affichée

---

### ⚠️ Optimistic update

* Given clic utilisateur
* Then UI update immédiate
* And rollback si erreur API

---

# 🧾 US 5 — Désactiver manga

---

## 🧪 Scénarios

### ✅

* clic désactivation
* confirmation affichée
* manga retiré de la liste

---

### ❌

* erreur API → rollback affichage

---

# 📗 EPIC : Manhwa

👉 mêmes US que manga

* ajout
* liste
* update progression
* désactivation

---

# 📙 EPIC : Manhua

👉 mêmes US

---

# 🌐 EPIC : Import automatique

---

# 🧾 US 6 — Import depuis une source

---

## 🧪 Scénarios

### ✅ Import MangaPlus

* Given clic import MangaPlus
* Then loader affiché
* And mangas ajoutés

---

### ✅ Import Raijin

* Given clic import Raijin
* Then manhwa/manhua importés

---

### ❌ Doublons

* Given mangas déjà existants
* Then message :

  * "X œuvres ignorées"

---

### ❌ Erreur scraping

* Then erreur affichée

---

# 🔍 EPIC : Recherche

---

# 🧾 US 7 — Rechercher une œuvre

---

## 🧪 Scénarios

### ✅

* filtrage dynamique par titre

---

### ⚠️

* debounce recherche

---

### ❌

* aucun résultat trouvé

---

# 📱 EPIC : Responsive

---

# 🧾 US 8 — Utilisation mobile

---

## 🧪 Scénarios

### ✅

* cartes adaptées mobile

---

### ✅

* navigation fluide tactile

---

### ✅

* boutons accessibles

---

# 🎨 EPIC : UX/UI

---

# 🧾 US 9 — Feedback utilisateur

---

## 🧪 Scénarios

### ✅

* toast succès

---

### ❌

* toast erreur

---

### ⚠️

* états loading visibles

---

# 🧪 TESTS FRONTEND À FAIRE

Tu peux faire :

---

## Unit tests

Avec :

* Jest
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
