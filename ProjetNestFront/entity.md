# 🧱 1. ENTITÉ : MANGA

## 🎯 Description

Représente un manga suivi par l’utilisateur dans sa mangathèque.

## 📊 Attributs

* **id**
  Identifiant unique du manga

* **titre**
  Nom du manga

* **auteur**
  Auteur du manga

* **imageUrl**
  Lien vers l’image (stockée sur Cloudinary)

* **nombreDeChapitres**
  Nombre total de chapitres disponibles

* **nombreDeChapitresLus**
  Nombre de chapitres que l’utilisateur a lus

* **activé**
  Boolean permettant de savoir si le manga est actif (visible) ou non

---

## 📏 Règles métier

* Le titre est obligatoire
* L’auteur est obligatoire
* Le nombre de chapitres doit être ≥ 0
* Le nombre de chapitres lus doit être ≥ 0
* Le nombre de chapitres lus ne peut pas dépasser le nombre total
* Par défaut :

  * nombreDeChapitresLus = 0
  * activé = true

---

# 📗 2. ENTITÉ : MANHWA

## 🎯 Description

Représente un manhwa suivi par l’utilisateur.

## 📊 Attributs

* **id**
  Identifiant unique

* **titre**
  Nom du manhwa

* **imageUrl**
  Image associée

* **nombreDeChapitres**
  Nombre total de chapitres

* **nombreDeChapitresLus**
  Progression utilisateur

* **activé**
  Permet de masquer/afficher

---

## 📏 Règles métier

* Le titre est obligatoire
* Le nombre de chapitres ≥ 0
* Le nombre de chapitres lus ≥ 0
* Le nombre de chapitres lus ≤ total
* Par défaut :

  * nombreDeChapitresLus = 0
  * activé = true

---

# 📙 3. ENTITÉ : MANHUA

## 🎯 Description

Représente un manhua suivi par l’utilisateur.

## 📊 Attributs

* **id**
  Identifiant unique

* **titre**
  Nom du manhua

* **imageUrl**
  Image associée

* **nombreDeChapitres**
  Nombre total de chapitres

* **nombreDeChapitresLus**
  Progression utilisateur

* **activé**
  Permet de masquer/afficher

---

## 📏 Règles métier

* Le titre est obligatoire
* Le nombre de chapitres ≥ 0
* Le nombre de chapitres lus ≥ 0
* Le nombre de chapitres lus ≤ total
* Par défaut :

  * nombreDeChapitresLus = 0
  * activé = true

