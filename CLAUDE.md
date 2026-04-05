# 🧩 1. EPIC GLOBAL

**Gestion d’une mangathèque en ligne (architecture Vertical Slice + TDD) tout ça en utilisant NestJS et une base PostgreSQL**

## Technologies à utiliser 

- NestJS 
- PostgreSQL

👉 Principe :

* Chaque feature = **slice indépendante**
* Chaque slice contient :

  * controller
  * service
  * DTO
  * tests

👉 On ne code **JAMAIS sans tests**.

---

# 🧱 2. ORGANISATION EN VERTICAL SLICES

```bash
src/
  manga/
    domain/
      manga.entity.ts

    add-manga/
      add-manga.controller.ts
      add-manga.service.ts
      add-manga.dto.ts
      add-manga.spec.ts

    get-all-manga/
    update-chapters/
    disable-manga/

  manhwa/
    domain/
      manhwa.entity.ts

    add-manhwa/
    get-all-manhwa/
    update-chapters/
    disable-manhwa/

  manhua/
    domain/
      manhua.entity.ts

    add-manhua/
    get-all-manhua/

  reading/
    get-all-reading/

  import/
    import-works/
```

👉 Chaque dossier contient :

* `domain/*.entity.ts`
* `feature_name/*.controller.ts`
* `feature_name/*.service.ts`
* `feature_name/*.dto.ts`
* `feature_name/*.spec.ts` (tests)

---

# 🧪 3. MÉTHODOLOGIE TDD (OBLIGATOIRE)

Pour **CHAQUE User Story** :

### 🔴 Étape 1 — Tests (ROUGE)

* Écrire les tests avec les scénarios
* Lancer → ❌ ça échoue

### ⏸️ Étape 2 — Validation

👉 **Tu me dis : "OK on passe en vert"**

### 🟢 Étape 3 — Implémentation

* Juste le code minimal pour passer les tests

### 🔁 Étape 4 — Refactor

* Clean code

---

# 📚 4. EPIC : Gestion des œuvres (TDD)

---

## 🧾 US 1 — Ajouter un manga (Vertical Slice: `add-manga`)

**En tant qu’utilisateur**
Je veux ajouter un manga
Afin de suivre ma lecture

---

## 🧪 Tests (à écrire AVANT le code)

### ✅ Scénario 1 — Ajout valide

* Given des données valides
* When POST `/addManga`
* Then retourne 201
* And le manga est sauvegardé

---

### ❌ Scénario 2 — Champ manquant

* Given un titre manquant
* When POST
* Then retourne 400

---

### 🖼️ Scénario 3 — Upload image

* Given une image
* When upload Cloudinary
* Then stocke l’URL

---

### 🔢 Scénario 4 — Valeur par défaut

* Given `chapitres_lus` non fourni
* Then = 0

---

## 🔴 Résultat attendu

👉 Tous les tests FAIL ❌

---

## ⏸️ STOP

👉 Tu me dis :
**"OK on implémente add-manga"**

---

## 🟢 Ensuite seulement

On code :

* DTO
* Controller
* Service
* Repository

---

# 🧾 US 2 — Ajouter un manhwa (`add-manhwa`)

**En tant qu’utilisateur**
Je veux ajouter un manhwa
Afin de suivre ma lecture

---

## 🧪 Tests (à écrire AVANT le code)

### ✅ Scénario 1 — Ajout valide

* Given des données valides
* When POST `/addManhwa`
* Then retourne 201
* And le manhwa est sauvegardé

---

### ❌ Scénario 2 — Champ manquant

* Given un titre manquant
* When POST
* Then retourne 400

---

### 🖼️ Scénario 3 — Upload image

* Given une image
* When upload Cloudinary
* Then stocke l’URL

---

### 🔢 Scénario 4 — Valeur par défaut

* Given `chapitres_lus` non fourni
* Then = 0

---

## 🔴 Résultat attendu

👉 Tous les tests FAIL ❌

---

## ⏸️ STOP

👉 Tu me dis :
**"OK on implémente add-manhwa"**

---

## 🟢 Ensuite seulement

On code :

* DTO
* Controller
* Service
* Repository

---

# 🧾 US 3 — Ajouter un manhua (`add-manhua`)

**En tant qu’utilisateur**
Je veux ajouter un manhua
Afin de suivre ma lecture

---

## 🧪 Tests (à écrire AVANT le code)

### ✅ Scénario 1 — Ajout valide

* Given des données valides
* When POST `/addManhua`
* Then retourne 201
* And le manhua est sauvegardé

---

### ❌ Scénario 2 — Champ manquant

* Given un titre manquant
* When POST
* Then retourne 400

---

### 🖼️ Scénario 3 — Upload image

* Given une image
* When upload Cloudinary
* Then stocke l’URL

---

### 🔢 Scénario 4 — Valeur par défaut

* Given `chapitres_lus` non fourni
* Then = 0

---

## 🔴 Résultat attendu

👉 Tous les tests FAIL ❌

---

## ⏸️ STOP

👉 Tu me dis :
**"OK on implémente add-manhua"**

---

## 🟢 Ensuite seulement

On code :

* DTO
* Controller
* Service
* Repository

---

# 📖 EPIC : Lecture

---

## 🧾 US 4 — Voir toutes les lectures (`get-all-reading`)

### 🧪 Tests

### ✅ Scénario

* Given des œuvres actives
* When GET `/allReading`
* Then retourne tout

---

### ❌ Scénario

* Given aucune œuvre
* Then retourne tableau vide

---

## 🔴 Résultat attendu

👉 Tous les tests FAIL ❌

---

## ⏸️ STOP

👉 Tu me dis :
**"OK on implémente get-all-reading"**

---

## 🟢 Ensuite seulement

On code :

* DTO (si besoin)
* Controller
* Service
* Repository

---

# 📘 US 5 — Voir mangas (`get-all-manga`)

### 🧪 Tests

### ✅ Scénario

* Given des œuvres actives ou non
* When GET `/getAllManga`
* Then retourne tout les mangas activés ou non 

---

### ❌ Scénario

* Given aucune œuvre
* Then retourne tableau vide

---

## 🔴 Résultat attendu

👉 Tous les tests FAIL ❌

---

## ⏸️ STOP

👉 Tu me dis :
**"OK on implémente get-all-manga"**

---

## 🟢 Ensuite seulement

On code :

* DTO (si besoin)
* Controller
* Service
* Repository

---

# 📗 US 6 — Voir manhwa (`get-all-manhwa`)

### 🧪 Tests

### ✅ Scénario

* Given des œuvres actives ou non
* When GET `/getAllManhwa`
* Then retourne tout les manhwas activés ou non 

---

### ❌ Scénario

* Given aucune œuvre
* Then retourne tableau vide

---

## 🔴 Résultat attendu

👉 Tous les tests FAIL ❌

---

## ⏸️ STOP

👉 Tu me dis :
**"OK on implémente get-all-manhwa"**

---

## 🟢 Ensuite seulement

On code :

* DTO (si besoin)
* Controller
* Service
* Repository

---

# 📙 US 7 — Voir manhua (`get-all-manhua`)

### 🧪 Tests

### ✅ Scénario

* Given des œuvres actives ou non
* When GET `/getAllManhua`
* Then retourne tout les manhuas activés ou non 

---

### ❌ Scénario

* Given aucune œuvre
* Then retourne tableau vide

---

## 🔴 Résultat attendu

👉 Tous les tests FAIL ❌

---

## ⏸️ STOP

👉 Tu me dis :
**"OK on implémente get-all-manhua"**

---

## 🟢 Ensuite seulement

On code :

* DTO (si besoin)
* Controller
* Service
* Repository

---

# 🔢 EPIC : Chapitres (`update-chapters`)

---

## 🧾 US 8 — Ajouter chapitres

### 🧪 Tests

### ✅

* Given +1
* Then incrémente

### ❌

* Given valeur négative
* Then erreur

---

---

## 🧾 US 9 — Ajouter chapitre lu

### ❌ Cas critique

* chapitres_lus > total → interdit

---

## 🧾 US 10 — Supprimer chapitres

**En tant qu’utilisateur**
Je veux diminuer le nombre total de chapitres
Afin de corriger mes données

---

## 🧪 Scénarios (à transformer en tests)

---

### ✅ Scénario 1 — Suppression simple (1 chapitre)

* **Given** une œuvre avec 100 chapitres
* **When** je fais `-1` chapitre
* **Then** le nombre total devient 99

---

### ✅ Scénario 2 — Suppression multiple

* **Given** une œuvre avec 100 chapitres
* **When** je fais `-10` chapitres
* **Then** le nombre total devient 90

---

### ❌ Scénario 3 — Suppression dépassant 0

* **Given** une œuvre avec 5 chapitres
* **When** je fais `-10` chapitres
* **Then** une erreur est retournée
* **And** le nombre reste inchangé

---

### ❌ Scénario 4 — Valeur négative en input

* **Given** une œuvre avec 100 chapitres
* **When** j’envoie `-(-5)` (valeur invalide)
* **Then** une erreur est retournée

👉 (important : on ne veut pas de logique ambiguë)

---

### ❌ Scénario 5 — Impact sur chapitres lus

* **Given** :

  * total = 100
  * lus = 95

* **When** je retire 10 chapitres

* **Then** erreur car :

  * lus (95) > nouveau total (90)

---

### ⚠️ Scénario 6 — Cas limite exact

* **Given** :

  * total = 100
  * lus = 90

* **When** je retire 10 chapitres

* **Then** :

  * total = 90
  * lus reste 90
  * OK

---

## 🧾 US 11 — Supprimer chapitres lus

**En tant qu’utilisateur**
Je veux diminuer le nombre de chapitres lus
Afin de corriger ma progression

---

## 🧪 Scénarios (TDD ready)

---

### ✅ Scénario 1 — Suppression simple

* **Given** 50 chapitres lus
* **When** je fais `-1`
* **Then** devient 49

---

### ✅ Scénario 2 — Suppression multiple

* **Given** 50 chapitres lus
* **When** je fais `-10`
* **Then** devient 40

---

### ❌ Scénario 3 — Descendre sous 0

* **Given** 5 chapitres lus
* **When** je fais `-10`
* **Then** erreur
* **And** valeur inchangée

---

### ❌ Scénario 4 — Valeur négative invalide

* **Given** 50 chapitres lus
* **When** j’envoie `-(-5)`
* **Then** erreur

---

### ❌ Scénario 5 — Cohérence avec total

* **Given** :

  * total = 100
  * lus = 50

* **When** je supprime des chapitres lus

* **Then** aucun impact sur total

👉 (important : indépendance)

---

### ⚠️ Scénario 6 — Passage à 0 exact

* **Given** 10 chapitres lus
* **When** je fais `-10`
* **Then** :

  * lus = 0
  * OK

---

# 🚫 EPIC : Désactivation (`disable-work`)

---

## 🧾 US 12 — Désactiver manga

### 🧪 Tests

* Given manga actif
* When PATCH `/disableManga`
* Then `activé = false`

---

## 🧾 US 13 — Désactiver manhwa

### 🧪 Tests

* Given manhwa actif
* When PATCH `/disableManhwa`
* Then `activé = false`

---

## 🧾 US 14 — Désactiver manhua

### 🧪 Tests

* Given manhua actif
* When PATCH `/disableManhua`
* Then `activé = false`

---

# 🌐 EPIC : Import / Scraping (`import-works`)

---

## ❗ IMPORTANT : DESIGN PROPRE

❌ Mauvais :

```
POST getMangaFromMangaPlus
```

✅ Bon :

```
POST /import/manga
POST /import/manhwa
```

---

## 🧾 US 15 — Import manga

### 🧪 Tests

### ✅

* Given source `mangaplus`
* Then ajoute mangas manquants

### ❌

* Given manga existant
* Then pas de duplication

---

## 🧾 US 16 — Import manhwa/manhua

### 🧪 Tests

### ✅

* Given source `raijinscan`
* Then ajoute manhwas/manhua manquants

### ❌

* Given manhwa/manhua existant
* Then pas de duplication

---

# 🔐 EPIC : Validation (`validation`)

---

## 🧾 US 17 — Validation stricte

### 🧪 Tests

* titre obligatoire
* chapitres ≥ 0
* chapitres_lus ≤ total

---

## 🧾 US 18 — Cohérence

* pas de valeurs négatives
* pas de dépassement

---

# 🚀 WORKFLOW COMPLET (TRÈS IMPORTANT)

Pour CHAQUE slice :

### 1. Tu écris les tests

👉 basés sur les scénarios ci-dessus

### 2. Tu lances

👉 ❌ FAIL (obligatoire)

### 3. Tu me dis

👉 **"OK pour passer en vert sur [nom slice]"**

### 4. Je t’aide à coder

👉 minimal pour passer les tests

### 5. Refactor clean


