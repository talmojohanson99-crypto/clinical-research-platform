# Cahier des Charges
## Plateforme de Collecte de Données Cliniques
### Version 1.0 — Juillet 2026

---

## 1. Résumé exécutif

Développer une plateforme de collecte de données professionnelles, inspirée de KoboToolbox, dédiée à la recherche clinique et épidémiologique. L'application permettra la création de formulaires dynamiques, la collecte mobile hors-ligne, et l'analyse des données en temps réel.

---

## 2. Objectifs

### 2.1 Objectif principal
Fournir aux chercheurs et au personnel soignant un outil complet de collecte de données numériques, fonctionnant hors-ligne, avec export compatible SPSS/Excel pour l'analyse statistique.

### 2.2 Objectifs secondaires
- Éliminer les formulaires papier et les erreurs de saisie
- Permettre la collecte en zones à faible connectivité
- Centraliser les données de plusieurs études et sites
- Garantir la sécurité et la confidentialité des données patients
- Faciliter l'export vers les outils d'analyse (SPSS, R, Power BI)

---

## 3. Périmètre fonctionnel

### 3.1 Composants du système

| Composant | Description |
|-----------|-------------|
| **Form Builder** | Interface web de création de formulaires (glisser-déposer) |
| **Collect Mobile** | Application mobile Android/iOS pour la collecte terrain |
| **Web Forms** | Formulaire web responsive (alternative au mobile) |
| **Data Manager** | Tableau de bord central de gestion et visualisation |
| **Export Engine** | Moteur d'export multi-formats |

---

## 4. Fonctionnalités détaillées

### 4.1 Form Builder (Concepteur de formulaires)

#### 4.1.1 Types de questions supportés

| Type | Description | Obligatoire |
|------|-------------|-------------|
| Texte court | Réponse libre (1 ligne) | Oui |
| Texte long | Réponse libre (multi-lignes) | Oui |
| Nombre entier | Saisie numérique entière | Oui |
| Nombre décimal | Saisie numérique avec virgule | Oui |
| Date | Sélecteur de date | Oui |
| Heure | Sélecteur d'heure | Oui |
| Date + Heure | Horodatage complet | Oui |
| Choix unique | Liste déroulante ou boutons radio | Oui |
| Choix multiple | Cases à cocher | Oui |
| Échelle de Likert | Barre d'évaluation (1-5, 1-10) | Oui |
| GPS | Géolocalisation automatique | Non |
| Photo | Capture photo (appareil ou galerie) | Non |
| Vidéo | Capture vidéo | Non |
| Audio | Enregistrement audio | Non |
| Signature | Signature numérique tactile | Non |
| Code-barres | Scan de code-barres/QR | Non |
| Note/Information | Texte informatif (non collecté) | Non |

#### 4.1.2 Logique conditionnelle (Skip Logic)

- **Affichage conditionnel** : Afficher/masquer une question selon la réponse à une question précédente
- **Branchement** : Diriger vers une section spécifique selon la réponse
- **Validation conditionnelle** : Appliquer des règles de validation dynamiques
- **Calculs automatiques** : IMC, scores, âge, etc.

#### 4.1.3 Validation des données

- Contraintes de plage (min/max)
- Expressions régulières (regex)
- Validations inter-champs
- Messages d'erreur personnalisés (FR/MG/EN)
- Blocage de la soumission en cas d'erreur

#### 4.1.4 Multilingue

- Support de plusieurs langues par formulaire
- Labels traduits pour chaque question
- Interface utilisateur localisée
- Export avec labels dans la langue choisie

#### 4.1.5 Import/Export de formulaires

- Import XLSForm (Excel)
- Import XForm (XML)
- Export XLSForm
- Export XForm
- Duplication de formulaires

---

### 4.2 Collect Mobile (Application de terrain)

#### 4.2.1 Mode hors-ligne

- **Fonctionnement 100% hors-ligne** : Aucune connexion requise pour collecter
- **Stockage local sécurisé** : SQLite chiffré sur l'appareil
- **Sync différée** : Envoi des données dès rétablissement de la connexion
- **Gestion des conflits** : Résolution automatique lors de la synchronisation

#### 4.2.2 Fonctionnalités mobile

- Interface tactile optimisée
- Navigation par sections/flèches
- Sauvegarde automatique (brouillon)
- Envoi en attente (file d'attente)
- Historique des envois
- Gestion des médias (photos, audio, vidéo)
- Géolocalisation automatique
- Mode sombre/clair

#### 4.2.3 Sécurité mobile

- Authentification par PIN/biométrie
- Chiffrement des données au repos
- Verrouillage automatique
- Effacement à distance (optionnel)

---

### 4.3 Web Forms (Enketo-like)

- Formulaire responsive (mobile, tablette, desktop)
- Mêmes fonctionnalités que l'app mobile
- Pas d'installation requise
- Lien de partage par URL/QR code
- Mode hors-ligne via Service Worker
- Soumission depuis n'importe quel navigateur

---

### 4.4 Data Manager (Gestion des données)

#### 4.4.1 Tableau de bord

- Nombre total de soumissions
- Soumissions par période
- Soumissions par enquêteur
- Taux de complétion
- Alertes de données manquantes

#### 4.4.2 Visualisation

- Graphiques en barres, courbes, camemberts
- Tableaux croisés dynamiques
- Filtres avancés (par date, enquêteur, réponse)
- Vue liste détaillée des réponses
- Édition des réponses existantes

#### 4.4.3 Cartographie (SIG)

- Affichage des points GPS sur carte
- Filtres géographiques
- Export GeoJSON
- Couches superposables

#### 4.4.4 Gestion des utilisateurs

- Rôles : Admin, Chercheur, Enquêteur, Lecteur
- Permissions par étude
- Journal d'audit (qui a fait quoi, quand)
- Gestion des équipes

---

### 4.5 Export Engine (Moteur d'export)

| Format | Usage | Détails |
|--------|-------|---------|
| **CSV** | Analyse générique | Séparateur configurable, encodage UTF-8 |
| **Excel (XLSX)** | Traitement manuel | Avec labels, couleurs, feuilles multiples |
| **SPSS (.sav)** | Analyse statistique | Labels de variables, valeurs codées, métadonnées |
| **R (.RData)** | Analyse statistique | Format natif R |
| **GeoJSON** | Cartographie | Points GPS avec métadonnées |
| **PDF** | Rapports | Tableaux récapitulatifs |
| **API REST** | Intégration | JSON, authentification par token |

---

### 4.6 Scoring et calculs automatiques

- Moteur de scoring configurable par étude
- Calculs en temps réel (IMC, âge, scores cliniques)
- Scores multiples par formulaire
- Export des scores avec les données

---

## 5. Architecture technique

### 5.1 Stack technologique recommandée

| Composant | Technologie | Justification |
|-----------|-------------|---------------|
| **Backend API** | Django + DRF | Maturité, sécurité, ORM puissant |
| **Frontend Web** | React + TypeScript | Composants réutilisables, performance |
| **Mobile** | React Native ou Flutter | Code unique iOS/Android |
| **Base de données** | PostgreSQL | JSONB pour données flexibles, performance |
| **Cache** | Redis | Sessions, file d'attente |
| **Files d'attente** | Celery | Tâches asynchrones (exports, sync) |
| **Stockage média** | MinIO ou S3 | Photos, audio, vidéo |
| **Authentification** | JWT + OAuth2 | Sécurité, tokens stateless |
| **Export SPSS** | pyreadstat | Biblièque Python native |
| **Cartographie** | Leaflet ou Mapbox | Cartes interactives |

### 5.2 Architecture logique

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENTS                                │
├─────────────┬─────────────┬─────────────┬─────────────────┤
│  Form Builder│ Collect App │  Web Forms  │  Data Manager   │
│   (React)   │(React Native│  (React)    │    (React)      │
└──────┬──────┴──────┬──────┴──────┬──────┴────────┬────────┘
       │             │             │                │
       └─────────────┴─────────────┴────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │    API Gateway    │
                    │   (Django DRF)    │
                    └─────────┬─────────┘
                              │
       ┌──────────────────────┼──────────────────────┐
       │                      │                      │
┌──────▼──────┐      ┌───────▼───────┐      ┌───────▼───────┐
│  PostgreSQL │      │     Redis     │      │  MinIO / S3   │
│   (Données) │      │    (Cache)    │      │   (Médias)    │
└─────────────┘      └───────────────┘      └───────────────┘
```

---

## 6. Modèle de données

### 6.1 Entités principales

```
Utilisateur
├── id (UUID)
├── username
├── email
├── role (admin/researcher/enumerator/viewer)
└── institution

Étude
├── id (UUID)
├── nom
├── description
├── statut (draft/active/paused/completed)
├── formulaire (JSON/XLSForm)
├── scoring_rules (JSON)
└── created_by → Utilisateur

Section
├── id (UUID)
├── etude → Étude
├── code
├── title_fr / title_mg
└── order

Question
├── id (UUID)
├── section → Section
├── name (clé technique)
├── type
├── label_fr / label_mg
├── choices (JSON)
├── constraint (JSON)
├── relevant (JSON)
├── spss_name
└── score_key / score_value

Patient
├── id (UUID)
├── numero_id (unique)
├── genre
├── date_naissance
└── contact

Réponse
├── id (UUID)
├── patient → Patient
├── etude → Étude
├── periode (T1/T2/T3...)
├── data (JSON)
├── scores (JSON)
├── filled_by → Utilisateur
├── gps_lat / gps_lon
└── device_id

Média
├── id (UUID)
├── reponse → Réponse
├── type (photo/audio/video)
├── fichier
└── taille

AuditLog
├── id (UUID)
├── user → Utilisateur
├── action
├── model_name
├── object_id
├── details (JSON)
└── ip_address
```

---

## 7. Sécurité

### 7.1 Authentification

- JWT (JSON Web Tokens) avec refresh token
- Authentification biométrique (mobile)
- PIN de sécurité (optionnel)
- 2FA (Google Authenticator)

### 7.2 Autorisation

- Rôles granulaires (admin, chercheur, enquêteur, lecteur)
- Permissions par étude
- Contrôle d'accès basé sur les rôles (RBAC)

### 7.3 Confidentialité

- Chiffrement TLS 1.3 (en transit)
- Chiffrement AES-256 (au repos, optionnel)
- Anonymisation des exports
- Journal d'audit complet
- Conformité RGPD

### 7.4 Sauvegarde

- Backups automatiques quotidiens
- Rétention configurable
- Export de secours

---

## 8. Interface utilisateur

### 8.1 Design

- Design responsive (mobile-first)
- Mode sombre/clair
- Accessibilité (WCAG 2.1)
- Localisation FR/MG/EN

### 8.2 Navigation

- Sidebar latérale (desktop)
- Menu hamburger (mobile)
- Fil d'Ariane
- Raccourcis clavier

---

## 9. Exigences de performance

| Métrique | Cible |
|----------|-------|
| Temps de réponse API | < 200ms |
| Chargement page | < 2s |
| Sync mobile | < 30s (100 réponses) |
| Disponibilité | 99.9% |
| Concurrent utilisateurs | 500+ |
| Stockage | 1 TB+ |

---

## 10. Plan de déploiement

### 10.1 Environnements

| Environnement | Usage | Hébergement |
|---------------|-------|-------------|
| Développement | Dev local | Docker |
| Staging | Tests | Cloud (AWS/GCP) |
| Production | Utilisateurs | Cloud (AWS/GCP) |

### 10.2 CI/CD

- Tests automatisés (unitaires, intégration)
- Déploiement continu
- Monitoring (Prometheus + Grafana)
- Logs centralisés (ELK)

---

## 11. Calendrier estimé

| Phase | Durée | Livrables |
|-------|-------|-----------|
| Phase 1 : MVP | 3 mois | Form Builder + API + Export CSV/SPSS |
| Phase 2 : Mobile | 2 mois | App Android/iOS hors-ligne |
| Phase 3 : Data Manager | 2 mois | Dashboard + Cartographie |
| Phase 4 : Avancé | 2 mois | Scoring avancé + Intégrations |
| Phase 5 : Déploiement | 1 mois | Mise en production + Formation |
| **Total** | **10 mois** | |

---

## 12. Budget estimé

| Poste | Coût estimé |
|-------|-------------|
| Développement (10 mois) | 15 000 - 25 000 € |
| Hébergement cloud (annuel) | 1 200 - 3 600 € |
| Formation | 1 000 - 2 000 € |
| Maintenance (annuelle) | 3 000 - 5 000 € |
| **Total première année** | **20 200 - 35 600 €** |

---

## 13. Équipe requise

| Rôle | Nombre | Compétences |
|------|--------|-------------|
| Chef de projet | 1 | Gestion de projet, méthodologie Agile |
| Développeur Backend | 1-2 | Python, Django, PostgreSQL |
| Développeur Frontend | 1-2 | React, TypeScript |
| Développeur Mobile | 1 | React Native ou Flutter |
| Designer UI/UX | 1 | Figma, accessibilité |
| Testeur QA | 1 | Tests automatisés, manuels |

---

## 14. Risques et mitigations

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Dépassement budgétaire | Élevé | Développement agile, MVP itératif |
| Retard livraison | Moyen | Planning réaliste, buffer 20% |
| Adoption utilisateurs | Élevé | Formation, interface intuitive |
| Sécurité données | Critique | Audit sécurité, chiffrement |
| Connectivité terrain | Moyen | Mode hors-ligne robuste |

---

## 15. Architecture multi-études

### 15.1 Principe fondamental

La plateforme est **générique** et supporte un **nombre illimité d'études** dans des **domaines variés**. Chaque étude est un projet indépendant avec :
- Son propre formulaire
- Ses propres règles de scoring
- Ses propres choix et listes
- Ses propres calculs
- Ses propres exports

### 15.2 Exemples de domaines supportés

| Domaine | Exemple d'étude | Types de données |
|---------|-----------------|------------------|
| **Diabète** | Suivi T2/T3 CHUMA | Scores cliniques, biologie, traitements |
| **Paludisme** | Enquête transmission | GPS, cas, traitements, vecteurs |
| **VIH/SIDA** | Suivi antirétroviraux | Observance, charge virale, CD4 |
| **Maternité** | Suivi prénatal | Âge, grossesses, complications |
| **Nutrition** | Enquête malnutrition | IMC, TAZ, apports alimentaires |
| **Cardiologie** | Étude HTA | PAS/PAD, traitements, ECG |
| **Psychiatrie** | Screening dépression | Échelles PHQ-9, GAD-7 |
| **Épidémiologie** | Enquête générale | Données socio-démographiques |

### 15.3 Configuration par étude

Chaque étude est configurée indépendamment :

```json
{
  "etude": {
    "nom": "Suivi Diabète CHUMA",
    "domaine": "diabète",
    "periodes": ["T1", "T2", "T3"],
    "sections": [...],
    "scoring_rules": {...],
    "calculs_auto": [...],
    "listes_choix": {...],
    "export_config": {...]
  }
}
```

### 15.4 Exemple : Étude diabète CHUMA

L'étude e-Collect est un **exemple** de ce que la plateforme peut créer :

| Élément | Configuration spécifique |
|---------|-------------------------|
| Sections | 10 sections, 116 questions |
| Scoring | Test 1 (/20) + Michigan (/20) |
| Calculs | IMC, âge, tranche d'âge |
| Listes | 29 métiers, 27 quartiers, 19 ethnies |
| Validations | Poids 0-300kg, taille 50-250cm |
| Export | SPSS avec labels FR/MG |

### 15.5 Exemple : Autre étude (paludisme)

Une étude sur le paludisme aurait :

| Élément | Configuration spécifique |
|---------|-------------------------|
| Sections | 5 sections (démographie, clinique, biological, traitement, prévention) |
| Scoring | Score de gravité paludisme |
| Calculs | Fièvre (T° > 38.5), parasitémie |
| Listes | Communes, villages, symptômes |
| Validations | T° 35-42°C, parasitémie 0-100000 |
| Export | CSV + GeoJSON (cartographie) |

---

## 16. Fonctionnalités e-Collect (étude diabète CHUMA — exemple)

### 16.1 Contexte

L'application e-Collect a été développée pour l'étude de suivi du diabète au CHU Mahajanga. Ces fonctionnalités doivent être intégrées dans la nouvelle plateforme comme **exemple de configuration**.

### 16.2 Structure du formulaire e-Collect

| Section | Titre | Nombre de questions |
|---------|-------|---------------------|
| Intro | Informations préliminaires | 4 |
| Section 1 | Renseignements généraux | 12 |
| Section 2 | Situation clinique | 14 |
| Section 3 | Antécédents familiaux | 10 |
| Section 4 | Facteurs de risque CV | 15 |
| Section 5 | Complications liées au diabète | 3 |
| Section 6 | Activités physiques | 4 |
| Section 7 | Situation biologique | 14 |
| Section 8 | Test 1 - Évaluation connaissances | 14 |
| Section 9 | Test 2 - Michigan MDKT | 20 |
| **Total** | | **116 questions** |

### 16.3 Types de champs e-Collect

| Type | Utilisation | Exemples |
|------|-------------|----------|
| `select_one` | Choix unique | Genre, type diabète, grade HTA |
| `select_multiple` | Choix multiple | Traitement, complications, antécédents |
| `text` | Texte libre | Numéro patient, contact, précisions |
| `integer` | Nombre entier | Nombre de collatéraux, pas par jour |
| `decimal` | Nombre décimal | Poids, taille, glycémie, HbA1c |
| `date` | Date | Date naissance, date ETP |
| `autocomplete` | Recherche dans liste | Profession, ethnie, quartier |
| `note` | Information | Titres de sections, instructions |

### 16.4 Logique conditionnelle e-Collect

```json
{
  "relevant": {
    "eq": ["question_name", "valeur"],
    "neq": ["question_name", "valeur"],
    "sel": ["question_multi", "valeur"],
    "or": [{"eq": ["q1", "1"]}, {"eq": ["q2", "1"]}],
    "gt": ["nombre", 0]
  }
}
```

**Exemples concrets :**
- `sources_info` affiché si `info_autre_source == "1"`
- `motifs_hospitalisation` affiché si `hospitalisation_diabete == "1"`
- `connaissances_insuline` affiché si `sous_insuline == "1"`
- `score_michigan_17` et `score_michigan_18` affichés si `sous_insuline == "1"`

### 16.5 Système de scoring e-Collect

#### Test 1 : Connaissances diabète (/20)

**Questions à choix multiple (1 pt par bonne réponse cochée) :**

| Question | Bonnes réponses | Mauvaises réponses |
|----------|-----------------|---------------------|
| facteurs_diabete | 1, 3, 4 | 2, 5 |
| a_propos_diabete | 1, 3 | 2, 4, 5 |
| complications_connues | 1, 2, 3, 4, 5 | 6 |
| connaissances_insuline | 1, 2 | 3 (si sous insuline) |

**Questions à choix unique (1 pt si bonne réponse) :**

| Question | Bonne réponse | Explication |
|----------|---------------|-------------|
| sous_insuline | 1 ou 2 | Oui ou Non = 1pt, NS = 0 |
| surveillance_equilibre | 2 | HbA1c |
| hba1c_1an | 2 | Faux (~3 mois) |
| objectif_hba1c | 3 | 7% |
| connaissance_traitement | 1 | Sait identifier |
| frequence_ophtalmo | 1 | Tous les ans |
| rigueur_traitement | 1 | Rigoureux |
| rigueur_regime | 1 | Rigoureux |
| niveau_info | 3 | Bien informé |
| souhait_info | 1 | Oui |

#### Test 2 : Michigan MDKT révisé (/20)

**Clé de correction :**

| Question | Réponse correcte |
|----------|------------------|
| score_michigan_1 | 1 (Vrai) |
| score_michigan_2 | 2 (Faux) |
| score_michigan_3 | 2 (Faux) |
| score_michigan_4 | 2 (Faux) |
| score_michigan_5 | 2 (Faux) |
| score_michigan_6 | 1 (Vrai) |
| score_michigan_7 | 2 (Faux) |
| score_michigan_8 | 1 (Vrai) |
| score_michigan_9 | 1 (Vrai) |
| score_michigan_10 | 2 (Faux) |
| score_michigan_11 | 1 (Vrai) |
| score_michigan_12 | 2 (Faux) |
| score_michigan_13 | 1 (Vrai) |
| score_michigan_14 | 1 (Vrai) |
| score_michigan_15 | 2 (Faux) |
| score_michigan_16 | 1 (Vrai) |
| score_michigan_17 | 2 (Faux) *insulinés* |
| score_michigan_18 | 1 (Vrai) *insulinés* |
| score_michigan_19 | 1 (Vrai) |
| score_michigan_20 | 1 (Vrai) |

### 16.6 Calculs automatiques e-Collect

| Calcul | Formule | Stockage |
|--------|---------|----------|
| Âge | Date actuelle - Date naissance | `age` |
| Tranche d'âge | <45→1, <65→2, <75→3, ≥75→4 | `age_grp` |
| IMC | Poids / (Taille/100)² | `imc_calcule` |
| Catégorie IMC | <18→1, <25→2, <30→3, ≥30→4 | `imc_categorie` |
| Score Test 1 | Points / Total × 20 | `score_test1` |
| Score Michigan | Correct / Total × 20 | `score_michigan` |

### 16.7 Export SPSS e-Collect

**Variables exportées avec labels :**

| Variable | Label SPSS | Type |
|----------|------------|------|
| numero_id | Numéro d'identification | String |
| genre | Genre (1=M, 2=F) | Numeric |
| date_naissance | Date de naissance | Date |
| age_grp | Tranche d'âge | Numeric |
| temps_mesure | Temps de mesure (2=T2, 3=T3) | Numeric |
| poids_kg | Poids (kg) | Numeric |
| taille_cm | Taille (cm) | Numeric |
| imc_calcule | IMC calculé | Numeric |
| glycemie_jeun | Glycémie à jeun | Numeric |
| hba1c | HbA1c (%) | Numeric |
| score_test1 | Score Test 1 (/20) | Numeric |
| score_michigan | Score Michigan (/20) | Numeric |

**Labels de valeurs :**

```python
variable_value_labels = {
    "genre": {"1": "Masculin", "2": "Féminin"},
    "age_grp": {"1": "<45 ans", "2": "45-64 ans", "3": "65-74 ans", "4": "≥75 ans"},
    "temps_mesure": {"2": "T2 Rétention", "3": "T3 Après rappel"},
    "type_diabete": {"1": "Type 1", "2": "Type 2", "3": "Autre"},
    "imc_categorie": {"1": "Maigre", "2": "Normal", "3": "Surpoids", "4": "Obèse"},
    "hta_grade": {"0": "Pas d'HTA", "1": "Grade I", "2": "Grade II", "3": "Grade III"},
}
```

### 16.8 Liste des choix e-Collect

| Liste | Options | Langues |
|-------|---------|---------|
| enqueteur | Ryan Wai Quan Chin | FR/MG |
| groupe | A (Rappel immédiat), B (Rappel différé) | FR/MG |
| genre | Masculin, Féminin | FR/MG |
| tranche_age | <45, 45-64, 65-74, ≥75 | FR/MG |
| profession | 29 métiers (cultivateur, commerçant, médecin...) | FR/MG |
| quartier | 27 quartiers de Mahajanga | FR/MG |
| ethnie | 19 ethnies (Sakalava, Merina, Betsileo...) | FR/MG |
| type_diabete | Type 1, Type 2, Autre | FR/MG |
| traitement | ADO, Insuline, Combiné, Aucun | FR/MG |
| oui_non | Oui, Non | FR/MG |
| vrai_faux_ns | Vrai, Faux, Ne sait pas | FR/MG |

### 16.9 Contraintes de validation e-Collect

| Champ | Contrainte | Message |
|-------|------------|---------|
| poids_kg | 0 < x < 300 | "Poids invalide (0-300 kg)" |
| taille_cm | 50 < x < 250 | "Taille invalide (50-250 cm)" |
| glycemie_jeun | 0 < x < 50 | "Valeur invalide" |
| hba1c | 0 < x < 25 | "Valeur invalide (0-25%)" |
| pas_max | 70 ≤ x ≤ 300 | "Valeur invalide (70-300)" |
| contact | ^[0-9+ -]{8,20}$ | "Numéro invalide" |
| numero_id | ^[A-Za-z0-9_-]+$ | "Format invalide" |

---

## 17. Annexes

### 17.1 Glossaire

- **XLSForm** : Standard Excel pour la création de formulaires
- **XForm** : Standard XML pour formulaires
- **SPSS** : Logiciel d'analyse statistique
- **GPS** : Géolocalisation
- **RGPD** : Règlement Général sur la Protection des Données
- **RBAC** : Role-Based Access Control
- **MDKT** : Michigan Diabetes Knowledge Test
- **IMC** : Indice de Masse Corporelle
- **HbA1c** : Hémoglobine glyquée
- **HTA** : Hypertension Artérielle
- **ADO** : Antidiabétiques Oraux
- **ETP** : Éducation Thérapeutique du Patient

### 17.2 Références

- [KoboToolbox](https://www.kobotoolbox.org/)
- [ODK Collect](https://getodk.org/)
- [Enketo](https://enketo.org/)
- [XLSForm Standard](https://xlsform.org/)
- [Michigan MDKT](https://sites.google.com/a/umich.edu/dtcc/resources/michigan-diabetes-knowledge-test)

---

**Document rédigé le** : 27 juillet 2026
**Version** : 1.1
**Statut** : Brouillon pour validation
**Modifications** : Ajout des fonctionnalités e-Collect (étude diabète CHUMA)
