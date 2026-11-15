import express from 'express'
import cors from 'cors'

import recettesRoutes from './routes/recettes.routes.js'

const app = express()

app.use(cors())

// Page d'accueil : liste les routes disponibles
app.get('/', (req, res) => {
    res.json({
        message: 'API Recettes, basée sur TheMealDB',
        routes: [
            'GET /api/recettes',
            'GET /api/recettes/:id'
        ]
    })
})

app.use('/api/recettes', recettesRoutes)

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
