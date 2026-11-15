const BASE = 'https://www.themealdb.com/api/json/v1/1'

// Transforme une recette brute de TheMealDB en recette propre
function nettoyer (recette) {
    const ingredients = []

    // TheMealDB range les ingrédients dans strIngredient1 ... strIngredient20
    for (let i = 1; i <= 20; i++) {
        const nom = recette['strIngredient' + i]
        const quantite = recette['strMeasure' + i]

        // on ignore les champs vides ou null
        if (nom && nom.trim() !== '') {
            ingredients.push({
                nom: nom.trim(),
                quantite: quantite ? quantite.trim() : ''
            })
        }
    }

    return {
        id: recette.idMeal,
        nom: recette.strMeal,
        categorie: recette.strCategory,
        pays: recette.strArea,
        image: recette.strMealThumb,
        ingredients: ingredients,
        nbIngredients: ingredients.length
    }
}

// Garde toutes les recettes en mémoire après le premier chargement
let cache = null

const LETTRES = 'abcdefghijklmnopqrstuvwxyz'

export async function chercherRecettes () {
    if (cache) {
        return cache
    }

    const toutes = []

    // TheMealDB n'a pas de "donne-moi tout" :
    // on demande les recettes qui commencent par a, puis b, puis c...
    for (const lettre of LETTRES) {
        const response = await fetch(BASE + '/search.php?f=' + lettre)
        const donnees = await response.json()

        // meals vaut null quand aucune recette ne commence par cette lettre
        if (donnees.meals) {
            for (const recette of donnees.meals) {
                toutes.push(nettoyer(recette))
            }
        }
    }

    cache = toutes
    return cache
}

// Renvoie une recette propre, ou null si l'id n'existe pas
export async function chercherUneRecette (id) {
    const response = await fetch(BASE + '/lookup.php?i=' + id)
    const donnees = await response.json()

    // TheMealDB répond 200 même si l'id n'existe pas :
    // meals vaut null (id inconnu) ou "Invalid ID" (id qui n'est pas un nombre)
    if (!Array.isArray(donnees.meals)) {
        return null
    }

    return nettoyer(donnees.meals[0])
}
