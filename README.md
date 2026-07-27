# Plateforme de Recherche Clinique

Application web multi-utilisateurs pour la collecte de données cliniques. Conçue pour les études de recherche médicale avec support multi-études, formulaires dynamiques et export SPSS.

## Stack

| Composant | Technologie |
|-----------|-------------|
| Backend | Django 6 + Django REST Framework |
| Frontend | React 19 + TypeScript + Vite |
| Auth | JWT (SimpleJWT) |
| Base de données | SQLite (dev) / PostgreSQL (prod) |
| Export | pyreadstat (SPSS), pandas (CSV) |

## Installation

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Méthode | URL | Description |
|---------|-----|-------------|
| POST | `/api/auth/login/` | Connexion |
| POST | `/api/auth/users/` | Inscription |
| GET/POST | `/api/etudes/` | Liste / Créer études |
| GET | `/api/etudes/{id}/form/` | Formulaire d'une étude |
| GET | `/api/etudes/{id}/patients/` | Patients d'une étude |
| GET | `/api/etudes/{id}/stats/` | Statistiques |
| POST | `/api/etudes/{id}/add_patient/` | Ajouter un patient |
| GET/POST | `/api/patients/` | Liste / Créer patients |
| POST | `/api/save-reponse/` | Sauvegarder réponse |
| GET | `/api/export/csv/{id}/` | Export CSV |
| GET | `/api/export/spss/{id}/` | Export SPSS |

## Rôles

| Rôle | Droits |
|------|--------|
| admin | Tout (utilisateurs, études, exports) |
| researcher | Études, patients, exports |
| enumerator | Remplir formulaires |
| viewer | Consulter uniquement |

## Structure

```
clinical-research-platform/
├── backend/           # Django
│   ├── config/        # Settings
│   ├── accounts/      # Utilisateurs + auth
│   ├── studies/       # Études, sections, questions, patients
│   ├── surveys/       # Réponses + scoring
│   └── exports/       # CSV, SPSS
├── frontend/          # React
│   └── src/
│       ├── pages/     # Dashboard, Études, Formulaire, etc.
│       ├── components/ # Layout, etc.
│       ├── store/     # Zustand (auth)
│       └── api/       # Axios client
└── README.md
```
