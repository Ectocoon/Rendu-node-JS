import express from 'express'
import cors from 'cors'

import recettesRoutes from './routes/recettes.routes.js'
import statsRoutes from './routes/stats.routes.js'

const app = express()

app.use(cors())

// Page d'accueil : liste les routes disponibles
app.get('/', (req, res) => {
    res.json({
        message: 'API Recettes, basée sur TheMealDB',
        routes: {
            'GET /api/recettes': 'liste paginée des recettes nettoyées',
            'GET /api/recettes?categorie=Dessert&pays=British&nom=cake': 'filtres combinables',
            'GET /api/recettes?page=2': 'pagination, 20 recettes par page',
            'GET /api/recettes/:id': 'une recette, 404 si elle n existe pas',
            'GET /api/stats': 'statistiques calculées sur toutes les recettes'
        }
    })
})

app.use('/api/recettes', recettesRoutes)
app.use('/api/stats', statsRoutes)

// Aucune route ne correspond
app.use((req, res) => {
    res.status(404).json({ erreur: 'Route inconnue : ' + req.originalUrl })
})

// Quelque chose a cassé
app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ erreur: 'Erreur du serveur' })
})

export default app
