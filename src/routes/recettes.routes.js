import { Router } from 'express'
import { chercherRecettes, chercherUneRecette } from '../services/mealdb.service.js'

const router = Router()

router.get('/', async (req, res) => {
    const recettes = await chercherRecettes()
    res.json(recettes)
})

router.get('/:id', async (req, res) => {
    const recette = await chercherUneRecette(req.params.id)

    if (recette === null) {
        return res.status(404).json({ erreur: 'Recette introuvable : ' + req.params.id })
    }

    res.json(recette)
})

export default router
