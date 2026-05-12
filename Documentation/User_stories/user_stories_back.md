# 📖 User Stories — Mangathèque en ligne

> Ce fichier est dérivé de `CLAUDE.md`. Il reprend les mêmes user stories en les **réécrivant selon les principes du guide « User stories : raconter l'impact, pas décrire une fonctionnalité » (David Robert, 2026)**.
>
> Les choix qui ont changé par rapport à `CLAUDE.md` :
> - L'acteur générique « utilisateur » est remplacé par un **lecteur** (ou « lecteur connecté ») — un acteur qui a un objectif clair.
> - Les objectifs (le « afin de … ») sont rattachés à un **impact mesurable**, pas seulement à une action.
> - Les scénarios ne mentionnent plus d'**implémentation** (codes HTTP, noms d'endpoints, nom du service Cloudinary, nom de colonne `activé`…). Ces détails sont déplacés dans une rubrique « Notes techniques (hors story) ».
> - Les critères d'acceptation sont écrits en **Given / When / Then** (Gherkin) avec des **exemples concrets** (Specification by Example).
> - Les anciennes US 17 et 18 (« Validation stricte », « Cohérence ») ne sont pas des stories mais des **règles métier transverses** — elles ont été regroupées dans une section dédiée à la fin.
>
> Le workflow TDD et l'architecture Vertical Slice restent ceux de `CLAUDE.md` (cf. § *Workflow & contraintes techniques* en bas de page).

---

## 🎯 0. Objectifs produit & parcours utilisateur

### Objectifs produit (impact mapping)

| Objectif | Impact attendu sur le lecteur |
|---|---|
| **O1 — Garder une trace fiable de ses lectures** | Le lecteur sait à tout moment où il en est dans chaque œuvre, sans avoir à le mémoriser. |
| **O2 — Reprendre une lecture sans frustration** | Le lecteur retrouve instantanément la liste de ce qu'il suit, dans le bon état (chapitres lus, image de couverture). |
| **O3 — Garder une bibliothèque propre dans le temps** | Le lecteur peut écarter les œuvres qu'il ne suit plus, sans les perdre définitivement. |
| **O4 — Découvrir / mettre à jour le catalogue sans saisie manuelle** | Le lecteur récupère automatiquement les nouvelles œuvres ou les nouveaux chapitres depuis des sources externes. |

### Parcours utilisateur (backbone)

```
Constituer sa bibliothèque  →  Suivre ses lectures  →  Mettre à jour sa progression  →  Faire le ménage  →  Étendre / enrichir
        (US 1-3)                    (US 4-7)                  (US 8-11)                  (US 12-14)         (US 15-16)
```

Chaque story ci-dessous est une **étape observable** de ce parcours.

---

# 🧱 1. Architecture & méthode (rappels)

Ces points appartiennent au *comment* (technique) et **ne sont pas des user stories**. Ils sont rappelés ici pour le contexte d'équipe.

- **Stack** : NestJS + PostgreSQL.
- **Découpage** : Vertical Slice (chaque feature = controller + service + DTO + tests dans un dossier dédié).
- **TDD strict** : tests rouges → validation orale (« OK on passe en vert ») → implémentation minimale → refactor.

Cf. § *Workflow & contraintes techniques* en fin de fichier pour le détail.

---

# 📚 EPIC A — Constituer sa bibliothèque

> **Objectif produit visé** : O1 (garder une trace fiable de ses lectures).

---

## 🧾 US 1 — Ajouter un manga à sa bibliothèque

> **En tant que** lecteur de mangas,
> **je veux** enregistrer un manga que je viens de commencer (titre, auteur, et optionnellement sa couverture),
> **afin de** retrouver ce manga dans ma bibliothèque la prochaine fois que je viens suivre mes lectures.

**Impact attendu** : un lecteur qui découvre un nouveau manga peut le rajouter en moins d'une minute, et n'a plus jamais besoin de noter sur papier où il en est.

### Critères d'acceptation (Gherkin)

**AC-1 — Le manga ajouté apparaît dans la bibliothèque**

```gherkin
Étant donné que je viens de commencer à lire « One Piece » d'Eiichiro Oda (1100 chapitres parus)
Quand j'enregistre ce manga dans ma bibliothèque
Alors « One Piece » apparaît dans la liste de mes mangas
Et il est marqué comme « en cours de lecture »
Et son nombre de chapitres lus vaut 0
```

**AC-2 — Un titre est indispensable**

```gherkin
Étant donné que je veux ajouter un manga sans préciser de titre
Quand je tente l'enregistrement
Alors le manga n'est pas ajouté à ma bibliothèque
Et je suis informé qu'un titre est obligatoire
```

**AC-3 — Le lecteur peut joindre une image de couverture**

```gherkin
Étant donné que j'ajoute « Naruto » avec un fichier image depuis mon ordinateur
Quand j'enregistre le manga
Alors « Naruto » apparaît dans ma bibliothèque
Et son image de couverture est affichée dans la fiche
```

**AC-4 — Sans précision, le compteur de chapitres lus démarre à zéro**

```gherkin
Étant donné que j'ajoute « Bleach » sans indiquer combien de chapitres j'ai déjà lus
Quand j'enregistre le manga
Alors mon nombre de chapitres lus pour « Bleach » est 0
```

### Notes techniques (hors story)
- L'image transite via un upload de fichier ; le stockage externe utilisé est un détail d'implémentation et n'apparaît pas dans la story.
- Le code HTTP de réponse (201, 400) appartient à la conception API et ne fait pas partie du critère d'acceptation.

---

## 🧾 US 2 — Ajouter un manhwa à sa bibliothèque

> **En tant que** lecteur de manhwas,
> **je veux** enregistrer un manhwa que je suis en train de lire,
> **afin de** ne pas oublier que je le suis et retrouver son état la fois suivante.

**Impact attendu** : O1.

### Critères d'acceptation

**AC-1 — Ajout nominal**

```gherkin
Étant donné que je commence « Solo Leveling » (200 chapitres)
Quand j'enregistre ce manhwa
Alors « Solo Leveling » apparaît dans ma liste de manhwas
Et son compteur de chapitres lus vaut 0
```

**AC-2 — Le titre est obligatoire**

```gherkin
Étant donné que je veux ajouter un manhwa sans titre
Quand je tente l'enregistrement
Alors aucun manhwa n'est ajouté
Et je suis informé que le titre est obligatoire
```

**AC-3 — Image de couverture optionnelle**

```gherkin
Étant donné que j'ajoute « Tower of God » avec une image
Quand j'enregistre le manhwa
Alors sa fiche affiche cette image de couverture
```

**AC-4 — Compteur de chapitres lus par défaut**

```gherkin
Étant donné que j'ajoute « Noblesse » sans préciser ma progression
Quand j'enregistre le manhwa
Alors mon compteur de chapitres lus pour « Noblesse » est 0
```

---

## 🧾 US 3 — Ajouter un manhua à sa bibliothèque

> **En tant que** lecteur de manhuas,
> **je veux** enregistrer un manhua que je viens de commencer,
> **afin de** le retrouver dans ma bibliothèque plus tard.

**Impact attendu** : O1.

### Critères d'acceptation

```gherkin
Étant donné que je commence « Soul Land » (300 chapitres)
Quand j'enregistre ce manhua
Alors il apparaît dans ma liste de manhuas
Et il est marqué comme « en cours de lecture »
Et le nombre de chapitres lus vaut 0

# AC-2 — Titre obligatoire (cf. US 1 AC-2)
# AC-3 — Image de couverture optionnelle (cf. US 1 AC-3)
# AC-4 — Chapitres lus = 0 par défaut (cf. US 1 AC-4)
```

---

# 📖 EPIC B — Suivre ses lectures

> **Objectif produit visé** : O2 (reprendre sans frustration).

---

## 🧾 US 4 — Voir tout ce que je lis en un coup d'œil

> **En tant que** lecteur qui revient sur l'application,
> **je veux** voir d'un seul écran toutes les œuvres que je suis actuellement (mangas, manhwas, manhuas confondus),
> **afin de** choisir laquelle reprendre maintenant sans naviguer entre plusieurs sections.

**Impact attendu** : réduire le temps « ouvrir l'app → cliquer sur la bonne œuvre » à quelques secondes.

### Critères d'acceptation

**AC-1 — Liste consolidée des lectures en cours**

```gherkin
Étant donné que je suis 2 mangas, 1 manhwa et 1 manhua tous actifs
Quand je consulte ma liste de lectures
Alors les 4 œuvres sont présentes dans la réponse
```

**AC-2 — Aucune œuvre = liste vide, sans erreur**

```gherkin
Étant donné que je n'ai encore rien ajouté à ma bibliothèque
Quand je consulte ma liste de lectures
Alors la liste est vide
Et aucune erreur ne m'est présentée
```

**AC-3 — Les œuvres archivées sont exclues**

```gherkin
Étant donné que j'ai 3 œuvres dont 1 que j'ai archivée
Quand je consulte ma liste de lectures
Alors seules les 2 œuvres encore suivies apparaissent
```

---

## 🧾 US 5 — Voir l'historique complet de mes mangas

> **En tant que** lecteur,
> **je veux** voir l'ensemble des mangas que j'ai déjà enregistrés (y compris ceux que j'ai archivés),
> **afin de** retrouver une œuvre que je pensais avoir abandonnée et éventuellement la reprendre.

**Impact attendu** : O3 (faire le ménage **sans perdre**).

### Critères d'acceptation

```gherkin
Scénario : Mangas actifs et archivés sont tous retournés
  Étant donné que j'ai 2 mangas en cours et 1 manga archivé
  Quand je consulte l'historique de mes mangas
  Alors les 3 mangas apparaissent

Scénario : Aucun manga jamais ajouté
  Étant donné que je n'ai jamais ajouté de manga
  Quand je consulte l'historique de mes mangas
  Alors la liste est vide
```

---

## 🧾 US 6 — Voir l'historique complet de mes manhwas

> **En tant que** lecteur, **je veux** voir tous les manhwas que j'ai déjà enregistrés (actifs et archivés), **afin de** ne pas oublier ceux que j'avais commencés.

**Impact attendu** : O3.

```gherkin
Scénario : Manhwas actifs et archivés sont tous retournés
  Étant donné que j'ai 2 manhwas actifs et 1 manhwa archivé
  Quand je consulte l'historique de mes manhwas
  Alors les 3 manhwas apparaissent

Scénario : Aucun manhwa
  Étant donné que je n'ai jamais ajouté de manhwa
  Quand je consulte l'historique
  Alors la liste est vide
```

---

## 🧾 US 7 — Voir l'historique complet de mes manhuas

> **En tant que** lecteur, **je veux** voir tous les manhuas que j'ai déjà enregistrés (actifs et archivés), **afin de** garder une trace de mes lectures passées.

**Impact attendu** : O3.

```gherkin
Scénario : Manhuas actifs et archivés sont tous retournés
  Étant donné que j'ai 1 manhua actif et 1 manhua archivé
  Quand je consulte l'historique de mes manhuas
  Alors les 2 manhuas apparaissent

Scénario : Aucun manhua
  Étant donné que je n'ai jamais ajouté de manhua
  Quand je consulte l'historique
  Alors la liste est vide
```

---

# 🔢 EPIC C — Mettre à jour sa progression

> **Objectif produit visé** : O1 + O2.
> Ces stories portent sur **deux compteurs distincts** : *nombre total de chapitres parus* (l'œuvre publie de nouveaux chapitres) et *nombre de chapitres lus* (ma progression personnelle).

---

## 🧾 US 8 — Enregistrer un nouveau chapitre paru

> **En tant que** lecteur,
> **je veux** signaler qu'un ou plusieurs nouveaux chapitres viennent de paraître pour une œuvre,
> **afin que** ma fiche reflète l'état réel de la publication.

**Impact attendu** : éviter que le lecteur croie qu'il est à jour alors qu'il a en réalité du retard.

### Critères d'acceptation

```gherkin
Scénario : Un nouveau chapitre paraît
  Étant donné que « One Piece » a 1100 chapitres parus dans ma fiche
  Quand je signale la sortie de 1 nouveau chapitre
  Alors la fiche indique 1101 chapitres parus

Scénario : Plusieurs chapitres en rattrapage
  Étant donné que « Naruto » a 700 chapitres parus
  Quand je signale 5 nouveaux chapitres
  Alors la fiche indique 705 chapitres parus

Scénario : Valeur invalide refusée
  Étant donné une œuvre quelconque
  Quand je tente d'ajouter un nombre négatif ou zéro de chapitres parus
  Alors la mise à jour est refusée
  Et le compteur reste inchangé
```

---

## 🧾 US 9 — Enregistrer ma progression de lecture

> **En tant que** lecteur,
> **je veux** indiquer que j'ai lu un ou plusieurs nouveaux chapitres d'une œuvre,
> **afin de** savoir où reprendre la prochaine fois.

**Impact attendu** : O2.

### Critères d'acceptation

```gherkin
Scénario : Je lis le chapitre suivant
  Étant donné que j'en suis au chapitre 50 / 100 de « X »
  Quand je signale 1 chapitre lu de plus
  Alors ma progression passe à 51 / 100

Scénario : Je rattrape un binge de plusieurs chapitres
  Étant donné que j'en suis à 40 / 100
  Quand je signale 10 chapitres lus de plus
  Alors ma progression passe à 50 / 100

Scénario (limite métier) : Je ne peux pas dépasser ce qui est paru
  Étant donné que j'en suis à 99 / 100
  Quand je signale 5 chapitres lus de plus
  Alors la mise à jour est refusée
  Et ma progression reste à 99 / 100
  Et je suis informé que je ne peux pas dépasser le nombre de chapitres parus
```

---

## 🧾 US 10 — Corriger le nombre total de chapitres parus

> **En tant que** lecteur,
> **je veux** diminuer le nombre total de chapitres parus que j'avais enregistré (erreur de saisie, double-comptage…),
> **afin que** ma fiche reflète la réalité.

**Impact attendu** : fiabilité des données → confiance dans l'app.

### Critères d'acceptation (Specification by Example)

| Cas | État avant | Action | État après | Résultat attendu |
|---|---|---|---|---|
| Correction simple | 100 parus / 50 lus | –1 chapitre paru | 99 / 50 | ✅ Accepté |
| Correction multiple | 100 / 50 | –10 chapitres parus | 90 / 50 | ✅ Accepté |
| Cas limite exact | 100 / 90 | –10 | 90 / 90 | ✅ Accepté (j'ai tout lu) |
| Descente sous zéro | 5 / 0 | –10 | inchangé | ❌ Refusé (un total négatif n'a pas de sens) |
| Entrée invalide | 100 / 0 | « – (-5) » | inchangé | ❌ Refusé (valeur ambiguë) |
| Casse la progression | 100 / 95 | –10 | inchangé | ❌ Refusé (je ne peux pas avoir lu plus que ce qui existe) |

```gherkin
Scénario : J'ai lu plus que ce que le nouveau total permet
  Étant donné que ma fiche indique 100 chapitres parus dont 95 lus
  Quand je tente de ramener le total à 90
  Alors la correction est refusée
  Et la fiche reste à 100 / 95
  Et je suis informé que je dois d'abord baisser ma progression de lecture
```

---

## 🧾 US 11 — Corriger ma progression de lecture

> **En tant que** lecteur,
> **je veux** diminuer le nombre de chapitres lus enregistrés (erreur, ou je décide de relire depuis un point antérieur),
> **afin que** ma progression reflète où j'en suis vraiment.

**Impact attendu** : O1.

### Critères d'acceptation

| Cas | État avant | Action | État après | Résultat |
|---|---|---|---|---|
| Correction simple | 50 lus | –1 | 49 | ✅ |
| Correction multiple | 50 lus | –10 | 40 | ✅ |
| Passage à zéro exact | 10 lus | –10 | 0 | ✅ |
| Descente sous zéro | 5 lus | –10 | inchangé | ❌ |
| Entrée invalide | 50 lus | « – (-5) » | inchangé | ❌ |
| Indépendance vis-à-vis du total | 100 parus / 50 lus | –10 lus | 100 / 40 | ✅ (le total reste 100) |

---

# 🚫 EPIC D — Faire le ménage dans sa bibliothèque

> **Objectif produit visé** : O3.
> *Note* : on parle d'**archiver**, pas de supprimer. L'œuvre reste dans l'historique du lecteur.

---

## 🧾 US 12 — Archiver un manga que je ne lis plus

> **En tant que** lecteur,
> **je veux** sortir un manga de ma liste de lectures actives (sans l'effacer définitivement),
> **afin de** garder ma liste « ce que je lis » courte et pertinente, tout en pouvant le retrouver dans mon historique.

**Impact attendu** : O3.

```gherkin
Scénario : J'archive un manga que je suis
  Étant donné que « X » est dans mes lectures actives
  Quand je l'archive
  Alors « X » n'apparaît plus dans ma liste de lectures actives
  Et « X » apparaît toujours dans mon historique manga

Scénario : Un manga déjà archivé reste archivé sans erreur
  Étant donné que « X » est déjà archivé
  Quand je l'archive à nouveau
  Alors aucune erreur ne m'est présentée
  Et l'état de « X » reste « archivé »
```

---

## 🧾 US 13 — Archiver un manhwa que je ne lis plus

> **En tant que** lecteur, **je veux** sortir un manhwa de mes lectures actives, **afin de** garder ma liste pertinente.

```gherkin
Scénario : J'archive un manhwa
  Étant donné qu'un manhwa est dans mes lectures actives
  Quand je l'archive
  Alors il disparaît de mes lectures actives
  Et il reste visible dans mon historique
```

---

## 🧾 US 14 — Archiver un manhua que je ne lis plus

> **En tant que** lecteur, **je veux** sortir un manhua de mes lectures actives, **afin de** garder ma liste pertinente.

```gherkin
Scénario : J'archive un manhua
  Étant donné qu'un manhua est dans mes lectures actives
  Quand je l'archive
  Alors il disparaît de mes lectures actives
  Et il reste visible dans mon historique
```

---

# 🌐 EPIC E — Enrichir la bibliothèque depuis l'extérieur

> **Objectif produit visé** : O4.

---

## 🧾 US 15 — Compléter ma bibliothèque de mangas depuis une source officielle

> **En tant que** lecteur,
> **je veux** récupérer en une action toutes les œuvres présentes sur une source de référence (ex. MangaPlus) qui ne sont pas encore dans ma bibliothèque,
> **afin de** ne pas avoir à les saisir une par une.

**Impact attendu** : passer de « 30 min de saisie manuelle » à « 1 clic ».

### Critères d'acceptation

```gherkin
Scénario : La source contient des œuvres absentes de ma bibliothèque
  Étant donné que ma bibliothèque contient « One Piece » et « Naruto »
  Et que la source officielle référence « One Piece », « Naruto », « Bleach » et « Kaiju No.8 »
  Quand je lance l'import depuis cette source
  Alors « Bleach » et « Kaiju No.8 » sont ajoutés à ma bibliothèque
  Et aucune duplication n'est créée pour « One Piece » ni « Naruto »

Scénario : Tout est déjà à jour
  Étant donné que ma bibliothèque contient déjà toutes les œuvres de la source
  Quand je lance l'import
  Alors aucune nouvelle œuvre n'est ajoutée
  Et je suis informé qu'il n'y a rien de nouveau
```

### Notes techniques (hors story)
- Le nom de la source (MangaPlus, scraping HTML, API officielle…) et la stratégie anti-duplication (par titre, par identifiant externe…) sont des décisions de conception, pas des éléments de la story.

---

## 🧾 US 16 — Compléter ma bibliothèque de manhwas / manhuas depuis une source

> **En tant que** lecteur, **je veux** récupérer en une action toutes les œuvres présentes sur une source de référence (ex. Raijinscan) qui ne sont pas dans ma bibliothèque, **afin de** ne pas saisir manuellement.

```gherkin
Scénario : Import depuis Raijinscan
  Étant donné que ma bibliothèque ne contient pas « Tower of God »
  Et que la source référence « Tower of God »
  Quand je lance l'import
  Alors « Tower of God » est ajouté à ma bibliothèque

Scénario : Pas de duplication
  Étant donné que ma bibliothèque contient déjà « Solo Leveling »
  Et que la source contient aussi « Solo Leveling »
  Quand je lance l'import
  Alors « Solo Leveling » n'est pas dupliqué
```

---

# 📐 Règles métier transverses (anciennes US 17 & 18)

> Ces règles **ne sont pas des user stories** au sens du guide — elles ne décrivent pas un changement de comportement pour un acteur précis. Ce sont des **invariants** qui s'appliquent à plusieurs stories. Elles deviennent des critères d'acceptation transverses, vérifiés en regression.

### R1 — Une œuvre a toujours un titre
Aucune œuvre ne peut être enregistrée sans titre.

### R2 — Les compteurs sont des entiers ≥ 0
- Le nombre de chapitres parus est un entier ≥ 0.
- Le nombre de chapitres lus est un entier ≥ 0.

### R3 — On ne peut pas avoir lu plus de chapitres qu'il n'en existe
À tout instant : `chapitres_lus ≤ chapitres_parus`.

Toute opération (ajouter des chapitres lus US 9, retirer des chapitres parus US 10) qui violerait cet invariant est **refusée** et l'état reste inchangé.

### R4 — L'archivage est réversible
Archiver une œuvre (US 12-14) ne la supprime jamais ; elle reste accessible via l'historique (US 5-7).

---

# 🚀 Workflow & contraintes techniques

> Conservé de `CLAUDE.md`. Cette section est le « comment », pas le « quoi ».

## Stack
- NestJS, PostgreSQL.

## Organisation Vertical Slice
```
src/
  manga/
    domain/manga.entity.ts
    add-manga/        (controller + service + dto + spec)
    get-all-manga/
    update-chapters/
    disable-manga/
  manhwa/  …  même structure
  manhua/  …  même structure
  reading/get-all-reading/
  import/import-works/
```

## Boucle TDD pour chaque story

1. **🔴 Rouge** — Écrire les tests à partir des critères d'acceptation Gherkin → ils échouent.
2. **⏸️ Validation** — *« OK on passe en vert sur [nom slice] »*.
3. **🟢 Vert** — Implémenter le minimum (DTO, controller, service, repository).
4. **🔁 Refactor** — Nettoyer.

👉 On ne code **jamais** sans tests, et on n'ajoute **jamais** de détail technique dans la formulation de la story elle-même (codes HTTP, noms de tables, noms de services tiers, etc.).

---

# ✅ Checklist appliquée à chaque story (extrait du guide)

Pour qu'une story de ce fichier soit « prête à entrer en TDD », elle doit cocher :

- [ ] **Acteur** clair (lecteur de manga / manhwa / manhua / lecteur tout court).
- [ ] **Objectif / impact** rattaché à l'un des objectifs produit O1–O4.
- [ ] **Observable** (on peut décrire l'état attendu côté utilisateur).
- [ ] **Testable** (Given/When/Then écrits).
- [ ] **Découpée** (une story = une action, livrable en quelques heures).
- [ ] **Non technique** dans sa formulation (pas de table, endpoint, framework, code HTTP).
- [ ] **Inscrite dans le parcours** (épic A à E).
- [ ] **Reliée à un impact** mesurable.
