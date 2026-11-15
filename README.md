# API Recettes

API Node.js / Express qui va chercher des recettes sur [TheMealDB](https://www.themealdb.com/api.php), les nettoie et les renvoie en JSON.

## Lancer le projet

```bash
npm install
npm run dev
```

Le serveur démarre sur http://localhost:3000

## Structure

```
server.js                        # allume le serveur
src/
├── app.js                       # crée l'app, branche les routes, gère 404 et 500
├── routes/
│   └── recettes.routes.js       # tout ce qui commence par /api/recettes
└── services/
    └── mealdb.service.js        # seul fichier qui parle à TheMealDB
```

## Routes

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/recettes` | Liste des recettes, nettoyées (ingrédients regroupés en tableau, champs vides enlevés) |

## Utilisation de l'IA

À compléter.
