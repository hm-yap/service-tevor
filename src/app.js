import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import invoice from './routes/invoice'

const app = express()

// CORS middleware
app.use(cors())

// JSON body parser middleware
app.use(bodyParser.json())

// Express routes
app.use('/invoice', invoice)

app.listen(3000, '127.0.0.1', () => console.log('Example app listening on port 3000!'))

export default app
