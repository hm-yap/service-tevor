import { Router } from 'express'
// Controllers
import stockController from '../controllers/StockController'
// Utils
import { requireAdmin } from '../util/auth'

const stockRouter = Router()

stockRouter.get('/', (req, res) => {
  res.json({
    method: 'GET',
    result: 'Return everything (TBD)'
  })
})

stockRouter.get('/:id', (req, res) => {
  res.json({
    method: 'GET',
    query: `Query String ${req.query.active}`,
    result: `GET ${req.params.id}`
  })
})

stockRouter.post('/', requireAdmin('stock'), (req, res) => {
  stockController.addNewItem(req, res)
})

stockRouter.put('/:id', requireAdmin('stock'), (req, res) => {
  res.json({
    method: 'PUT',
    result: `Putting ${req.params.id}`
  })
})

stockRouter.delete('/:id', requireAdmin('stock'), (req, res) => {
  res.json({
    method: 'DELETE',
    result: `Deleting ${req.params.id}`
  })
})

export default stockRouter
