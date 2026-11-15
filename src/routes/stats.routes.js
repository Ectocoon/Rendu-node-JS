import { Router } from 'express'
import { chercherRecettes } from '../services/mealdb.service.js'

const router = Router()

// Compte combien de fois chaque valeur d'un champ apparaît
// ex : compter(recettes, 'categorie') -> { Dessert: 167, Beef: 54, ... }
function compter (recettes, champ) {
    const compteur = {}

    for (const recette of recettes) {
        const valeur = recette[champ]

        if (compteur[valeur]) {
            compteur[valeur] = compteur[valeur] + 1
        } else {
            compteur[valeur] = 1
        }
    }

    return compteur
}

// Renvoie la clé qui a le plus grand nombre dans un compteur
function plusFrequent (compteur) {
    let meilleur = ''

    for (const cle of Object.keys(compteur)) {
        if (meilleur === '' || compteur[cle] > compteur[meilleur]) {
            meilleur = cle
        }
    }

    return meilleur
}

router.get('/', async (req, res) => {
    const recettes = await chercherRecettes()

    const parCategorie = compter(recettes, 'categorie')
    const parPays = compter(recettes, 'pays')

    // Nombre moyen d'ingrédients par recette
    let totalIngredients = 0
    for (const recette of recettes) {
        totalIngredients = totalIngredients + recette.nbIngredients
    }
    const moyenneIngredients = Math.round((totalIngredients / recettes.length) * 10) / 10

    // Recette qui a le plus d'ingrédients
    let plusLongue = recettes[0]
    for (const recette of recettes) {
        if (recette.nbIngredients > plusLongue.nbIngredients) {
            plusLongue = recette
        }
    }

    res.json({
        totalRecettes: recettes.length,
        nbCategories: Object.keys(parCategorie).length,
        nbPays: Object.keys(parPays).length,
        categorieLaPlusFrequente: plusFrequent(parCategorie),
        moyenneIngredients: moyenneIngredients,
        recetteAvecLePlusDIngredients: {
            id: plusLongue.id,
            nom: plusLongue.nom,
            nbIngredients: plusLongue.nbIngredients
        },
        parCategorie: parCategorie,
        parPays: parPays
    })
})

export default router
