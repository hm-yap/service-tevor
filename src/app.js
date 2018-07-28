import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
// Utils
import connectToDb from './util/db'
import logger from './util/logger'
// Routes
import invoice from './routes/invoice'
import job from './routes/job'

const app = express()
const port = 3000

// Connect to DB
connectToDb()

// CORS middleware
app.use(cors())

// JSON body parser middleware
app.use(bodyParser.json())

// Express routes
app.use('/invoice', invoice)
app.use('/job', job)

app.listen(port, '127.0.0.1', () => logger.info(`Tevor Service started on port ${port}`))

export default app
