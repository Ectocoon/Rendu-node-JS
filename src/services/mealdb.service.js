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

export async function chercherRecettes () {
    const response = await fetch(BASE + '/search.php?s=')
    const donnees = await response.json()

    // meals vaut null quand la recherche ne trouve rien
    if (!donnees.meals) {
        return []
    }

    return donnees.meals.map(nettoyer)
}
