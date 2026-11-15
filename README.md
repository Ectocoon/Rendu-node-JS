# API Recettes

Projet Node.js pour le cours d'API.

C'est une API faite avec Express qui va chercher les recettes sur TheMealDB (https://www.themealdb.com/api.php) et qui les renvoie en JSON en plus propre. Par exemple les ingredients sont dans un tableau au lieu d'etre dans 40 champs differents, et les champs vides sont enlevés.

## Comment lancer le projet

Il faut avoir Node.js d'installé (version 20 ou plus).

D'abord installer les dépendances :

npm install

Puis lancer le serveur :

npm run dev

Et apres on va sur http://localhost:3000 dans le navigateur. La page d'accueil montre toutes les routes.

Attention : la premiere fois qu'on appelle une route ça peut prendre 1 ou 2 secondes parce que l'API va chercher toutes les recettes (lettre par lettre, de a à z). Apres c'est gardé en cache donc c'est instantané.

## Les routes

### GET /api/recettes

Renvoie la liste des recettes, 20 par page.

On peut rajouter des filtres dans l'url :
- `?categorie=Dessert` pour avoir que les desserts
- `?pays=Italian` pour avoir que les recettes italiennes
- `?nom=chicken` pour chercher dans le nom des recettes
- `?page=2` pour avoir la page 2

On peut mettre plusieurs filtres en meme temps avec `&`, par exemple :
http://localhost:3000/api/recettes?categorie=Dessert&pays=British

Ce que ça renvoie :

```json
{
  "page": 1,
  "nbPages": 40,
  "total": 790,
  "recettes": [ ... ]
}
```

Si la page demandée n'existe pas ça renvoie une erreur 404.

### GET /api/recettes/:id

Renvoie une seule recette avec son id. Par exemple http://localhost:3000/api/recettes/52772

```json
{
  "id": "52772",
  "nom": "Teriyaki Chicken Casserole",
  "categorie": "Chicken",
  "pays": "Japanese",
  "image": "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
  "ingredients": [
    { "nom": "soy sauce", "quantite": "3/4 cup" },
    { "nom": "water", "quantite": "1/2 cup" }
  ],
  "nbIngredients": 9
}
```

Si l'id existe pas ça renvoie une erreur 404.

### GET /api/stats

Renvoie des statistiques que mon code calcule sur toutes les recettes :
- le nombre total de recettes
- le nombre de catégories et de pays
- la catégorie avec le plus de recettes
- le nombre moyen d'ingrédients par recette
- la recette qui a le plus d'ingrédients
- le nombre de recettes par catégorie et par pays

### GET /api/recettes/hasard

Renvoie une recette au hasard. Ça change a chaque fois qu'on recharge la page.

### GET /api/categories

Renvoie toutes les catégories avec combien de recettes il y a dedans, triées de la plus grande a la plus petite.

```json
[
  { "nom": "Dessert", "nbRecettes": 167 },
  { "nom": "Vegetarian", "nbRecettes": 100 },
  ...
]
```

### GET /api/ingredients/top

Renvoie les ingrédients les plus utilisés dans toutes les recettes. Par défaut ça en montre 10 mais on peut changer avec `?limite=5` par exemple.

```json
{
  "nbIngredientsDifferents": 946,
  "top": [
    { "nom": "salt", "nbRecettes": 325 },
    { "nom": "garlic", "nbRecettes": 248 },
    ...
  ]
}
```

## Organisation des fichiers

```
server.js                     -> lance le serveur
src/app.js                    -> branche les routes + gere les erreurs 404 et 500
src/routes/recettes.routes.js -> les routes /api/recettes
src/routes/stats.routes.js    -> la route /api/stats
src/routes/categories.routes.js -> la route /api/categories
src/routes/ingredients.routes.js -> la route /api/ingredients/top
src/services/mealdb.service.js -> le seul fichier qui appelle TheMealDB, et qui nettoie les recettes
```

## Problemes que j'ai eu

- Dans TheMealDB, 190 recettes n'ont pas de pays (c'est `null`), ça faisait planter mes filtres. Maintenant je mets "Inconnu" à la place.
- TheMealDB renvoie jamais d'erreur 404 quand une recette existe pas, il renvoie `null` ou "Invalid ID". Donc c'est mon code qui verifie et qui renvoie le 404.
- Il n'y a pas de route pour avoir toutes les recettes d'un coup, donc je les recupere lettre par lettre.
- Pour la route `/hasard` il faut la mettre avant `/:id` dans le fichier, sinon Express pense que "hasard" c'est un id.
- Pour le top des ingrédients, "Sugar" et "sugar" comptaient comme 2 ingrédients différents, donc je mets tout en minuscule avant de compter.

## Utilisation de l'IA

J'ai utilisé Claude pour m'aider à écrire le code, étape par étape. Je lui ai demandé d'expliquer chaque fichier pour comprendre ce que je rendais. J'ai fait les tests et les commits moi-même.