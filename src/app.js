import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import invoice from './routes/invoice'
import job from './routes/job'

const app = express()
const port = 3000

// CORS middleware
app.use(cors())

// JSON body parser middleware
app.use(bodyParser.json())

// Express routes
app.use('/invoice', invoice)
app.use('/job', job)

app.listen(port, '127.0.0.1', () => console.log(`Tevor Service started on port ${port}`))

export default app
