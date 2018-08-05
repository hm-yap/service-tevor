import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
// Utils
import connectToDb from './util/db'
import logger from './util/logger'
import { validator } from './util/requestValidator'
// Routes
import invoice from './routes/invoice'
import job from './routes/job'
import customer from './routes/customer'
import purchase from './routes/purchase'
import stock from './routes/stock'
import supplier from './routes/supplier'
import user from './routes/user'

const app = express()
const port = 3000

// Connect to DB
connectToDb()

// CORS middleware
app.use(cors())

// JSON body parser middleware
app.use(bodyParser.json())

// Express routes
app.use('/invoice', validator, invoice)
app.use('/job', validator, job)
app.use('/customer', validator, customer)
app.use('/purchase', validator, purchase)
app.use('/stock', validator, stock)
app.use('/supplier', validator, supplier)
app.use('/user', validator, user)

app.listen(port, '127.0.0.1', () => logger.info(`Tevor Service started on port ${port}`))

export default app
