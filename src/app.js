import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
// Utils
import connectToDb from './util/db'
import logger from './util/logger'
import auth from './util/auth'
// Routes
import invoice from './routes/invoice'
import job from './routes/job'
import customer from './routes/customer'
import purchase from './routes/purchase'
import stock from './routes/stock'
import supplier from './routes/supplier'
import user from './routes/user'

const app = express()
const port = 8443
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}

// Connect to DB
connectToDb()

// CORS middleware
app.use(cors(corsOptions))

// JSON body parser middleware
app.use(bodyParser.json())

// Express routes
app.use('/invoice', auth, invoice)
app.use('/job', auth, job)
app.use('/customer', auth, customer)
app.use('/purchase', auth, purchase)
app.use('/stock', auth, stock)
app.use('/supplier', auth, supplier)
app.use('/user', auth, user)

app.listen(port, '127.0.0.1', () => logger.info(`Tevor Service started on port ${port}`))

export default app
