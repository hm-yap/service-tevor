import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
// Utils
import connectToDb from './util/db'
import logger from './util/logger'
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
app.use('/invoice', invoice)
app.use('/job', job)
app.use('/customer', customer)
app.use('/purchase', purchase)
app.use('/stock', stock)
app.use('/supplier', supplier)
app.use('/user', user)

app.listen(port, '127.0.0.1', () => logger.info(`Tevor Service started on port ${port}`))

export default app
