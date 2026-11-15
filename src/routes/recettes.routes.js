import { Router } from 'express'
import { chercherRecettes, chercherUneRecette } from '../services/mealdb.service.js'

const router = Router()

router.get('/', async (req, res) => {
    let recettes = await chercherRecettes()

    // ?categorie=Dessert
    if (req.query.categorie) {
        const categorie = req.query.categorie.toLowerCase()
        recettes = recettes.filter((r) => r.categorie.toLowerCase() === categorie)
    }

    // ?pays=Italian
    if (req.query.pays) {
        const pays = req.query.pays.toLowerCase()
        recettes = recettes.filter((r) => r.pays.toLowerCase() === pays)
    }

    // ?nom=chicken : garde les recettes dont le nom CONTIENT le texte
    if (req.query.nom) {
        const nom = req.query.nom.toLowerCase()
        recettes = recettes.filter((r) => r.nom.toLowerCase().includes(nom))
    }

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
