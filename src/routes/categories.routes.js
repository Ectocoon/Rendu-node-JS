import { Router } from 'express'
import { chercherRecettes } from '../services/mealdb.service.js'

const router = Router()

// Liste des catégories avec le nombre de recettes dans chacune
router.get('/', async (req, res) => {
    const recettes = await chercherRecettes()

    const compteur = {}
    for (const recette of recettes) {
        if (compteur[recette.categorie]) {
            compteur[recette.categorie] = compteur[recette.categorie] + 1
        } else {
            compteur[recette.categorie] = 1
        }
    }

    // On transforme l'objet { Dessert: 167, ... } en tableau [{ nom, nbRecettes }]
    const categories = Object.keys(compteur).map((nom) => ({
        nom: nom,
        nbRecettes: compteur[nom]
    }))

    // Tri : la catégorie avec le plus de recettes en premier
    categories.sort((a, b) => b.nbRecettes - a.nbRecettes)

    res.json(categories)
})

export default router
