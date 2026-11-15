import express from 'express'
import cors from 'cors'

import recettesRoutes from './routes/recettes.routes.js'

const app = express()

app.use(cors())

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
