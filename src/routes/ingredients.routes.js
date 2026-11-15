import { Router } from 'express'
import { chercherRecettes } from '../services/mealdb.service.js'

const router = Router()

// Les ingrédients les plus utilisés, triés
// ?limite=5 pour choisir combien on en veut (10 par défaut)
router.get('/top', async (req, res) => {
    const recettes = await chercherRecettes()
    const limite = Number(req.query.limite) || 10

    const compteur = {}
    for (const recette of recettes) {
        for (const ingredient of recette.ingredients) {
            // "Sugar" et "sugar" doivent compter comme le même ingrédient
            const nom = ingredient.nom.toLowerCase()

            if (compteur[nom]) {
                compteur[nom] = compteur[nom] + 1
            } else {
                compteur[nom] = 1
            }
        }
    }

    const ingredients = Object.keys(compteur).map((nom) => ({
        nom: nom,
        nbRecettes: compteur[nom]
    }))

    ingredients.sort((a, b) => b.nbRecettes - a.nbRecettes)

    res.json({
        nbIngredientsDifferents: ingredients.length,
        top: ingredients.slice(0, limite)
    })
})

export default router
