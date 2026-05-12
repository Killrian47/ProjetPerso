# 🧩 IMPACT MAPPING — Mangathèque en ligne

---

# 🎯 OBJECTIF GLOBAL

Créer une plateforme de mangathèque permettant à un utilisateur de :

* gérer ses mangas/manhwa/manhua
* suivre sa progression de lecture
* automatiser l’ajout d’œuvres via scraping
* consulter facilement ses lectures sur desktop et mobile

---

# 👤 ACTEURS

## 👤 Utilisateur

Personne utilisant la plateforme pour suivre ses lectures.

---

## 🤖 Système d’import

Service automatisé important des œuvres depuis des sites externes.

---

## 🖥️ Frontend

Interface utilisateur consommant l’API.

---

# 🎯 IMPACTS RECHERCHÉS

---

# 📚 IMPACT 1 — Permettre le suivi de lecture

## 👤 Acteur

Utilisateur

---

## ✅ Impacts attendus

* Suivre sa progression
* Visualiser ses lectures en cours
* Corriger facilement ses données
* Avoir une vue centralisée

---

## 🧩 Features associées

### Manga

* Ajouter un manga
* Voir les mangas
* Modifier chapitres
* Modifier chapitres lus
* Désactiver manga

---

### Manhwa

* Ajouter un manhwa
* Voir les manhwa
* Modifier progression
* Désactiver

---

### Manhua

* Ajouter un manhua
* Voir les manhua
* Modifier progression
* Désactiver

---

### Reading

* Voir toutes les lectures actives

---

# 📥 IMPACT 2 — Réduire la saisie manuelle

## 👤 Acteur

Utilisateur

---

## ✅ Impacts attendus

* Gain de temps
* Réduction des erreurs
* Bibliothèque rapidement remplie

---

## 🧩 Features associées

### Import MangaPlus

* Scraper mangas manquants
* Ajouter automatiquement

---

### Import RaijinScan

* Scraper manhwa/manhua
* Ajouter automatiquement

---

### Déduplication

* Ignorer œuvres déjà existantes

---

# 📱 IMPACT 3 — Avoir une interface simple et rapide

## 👤 Acteur

Utilisateur

---

## ✅ Impacts attendus

* Navigation intuitive
* Accès rapide aux œuvres
* Bonne expérience mobile

---

## 🧩 Features associées

### Dashboard

* Affichage global lectures

---

### Cards œuvres

* Affichage image
* Progression
* Actions rapides

---

### Responsive

* Mobile first
* Desktop ergonomique

---

### Recherche

* Recherche dynamique

---

# 🔄 IMPACT 4 — Maintenir la cohérence des données

## 👤 Acteur

Système

---

## ✅ Impacts attendus

* Éviter données incohérentes
* Empêcher erreurs métier
* Sécuriser API

---

## 🧩 Features associées

### Validation DTO

* champs obligatoires
* valeurs positives

---

### Règles métier

* chapitres lus ≤ total
* pas de négatif

---

### Gestion erreurs

* erreurs API claires
* feedback frontend

---

# 🧪 IMPACT 5 — Garantir la qualité du projet

## 👤 Acteur

Développeur

---

## ✅ Impacts attendus

* Réduction des bugs
* Code maintenable
* Évolution simple

---

## 🧩 Features associées

### TDD

* tests rouges
* implémentation minimale
* refactor

---

### Vertical Slice

* isolation des features
* découpage métier

---

### Architecture domaine

* séparation manga/manhwa/manhua

---

# 🕷️ IMPACT 6 — Automatiser la récupération de contenu

## 👤 Acteur

Système d’import

---

## ✅ Impacts attendus

* Synchronisation rapide
* Base de données enrichie
* Moins d’actions utilisateur

---

## 🧩 Features associées

### Services scraping

* MangaPlus
* RaijinScan

---

### Mise à jour automatique

* ajout nouvelles œuvres
* update chapitres

---

# 📊 IMPACT 7 — Donner une visibilité sur la progression

## 👤 Acteur

Utilisateur

---

## ✅ Impacts attendus

* Motivation
* Vision claire de l’avancement

---

## 🧩 Features associées

### Calcul progression %

* lus / total

---

### Statistiques

* chapitres lus
* œuvres terminées
* progression globale

---

# 🧱 IMPACT MAPPING — VUE HIÉRARCHIQUE

```text
OBJECTIF
│
├── Suivre ses lectures
│   ├── Ajouter manga/manhwa/manhua
│   ├── Voir lectures
│   ├── Modifier progression
│   └── Désactiver œuvres
│
├── Réduire saisie manuelle
│   ├── Import MangaPlus
│   ├── Import Raijin
│   └── Déduplication
│
├── Interface simple
│   ├── Dashboard
│   ├── Responsive
│   ├── Recherche
│   └── Cards œuvres
│
├── Cohérence des données
│   ├── Validation DTO
│   ├── Règles métier
│   └── Gestion erreurs
│
├── Qualité technique
│   ├── TDD
│   ├── Vertical Slice
│   └── Architecture domaine
│
└── Automatisation
    ├── Scraping
    ├── Synchronisation
    └── Update chapitres
```

---

# 🚀 CE QUE ÇA T’APPORTE

Avec cet impact mapping tu peux :

* ✅ prioriser tes features
* ✅ découper ton backlog
* ✅ construire ton roadmap
* ✅ expliquer ton projet
* ✅ travailler comme en entreprise

---

# 🎯 PRIORISATION RECOMMANDÉE

## 🔥 MVP

1. Ajouter œuvres
2. Voir lectures
3. Modifier progression
4. Désactiver
5. Validation métier

---

## 🚀 V2

6. Import automatique
7. Recherche
8. Responsive avancé

---

## ⭐ V3

9. Statistiques
10. Favoris
11. Historique
12. Notifications nouveaux chapitres
