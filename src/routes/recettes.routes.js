import { Router } from 'express'
import { chercherRecettes, chercherUneRecette } from '../services/mealdb.service.js'

const router = Router()

const PAR_PAGE = 20

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

    // Pagination : on filtre d'abord, on découpe ensuite
    const total = recettes.length
    const nbPages = Math.ceil(total / PAR_PAGE)
    const page = Number(req.query.page) || 1

    if (page < 1 || (nbPages > 0 && page > nbPages)) {
        return res.status(404).json({ erreur: "Cette page n'existe pas" })
    }

    const debut = (page - 1) * PAR_PAGE

    res.json({
        page: page,
        nbPages: nbPages,
        total: total,
        recettes: recettes.slice(debut, debut + PAR_PAGE)
    })
})

router.get('/:id', async (req, res) => {
    const recette = await chercherUneRecette(req.params.id)

    if (recette === null) {
        return res.status(404).json({ erreur: 'Recette introuvable : ' + req.params.id })
    }

    res.json(recette)
})

export default router
