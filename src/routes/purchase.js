import { Router } from 'express'

const purchaseRouter = Router()

purchaseRouter.get('/', (req, res) => {
  res.json({
    method: 'GET',
    result: 'Return everything (TBD)'
  })
})

purchaseRouter.get('/:id', (req, res) => {
  res.json({
    method: 'GET',
    query: `Query String ${req.query.active}`,
    result: `GET ${req.params.id}`
  })
})

purchaseRouter.post('/', (req, res) => {
  res.json({
    method: 'POST',
    result: 'test'
  })
})

purchaseRouter.put('/:id', (req, res) => {
  res.json({
    method: 'PUT',
    result: `Putting ${req.params.id}`
  })
})

purchaseRouter.delete('/:id', (req, res) => {
  res.json({
    method: 'DELETE',
    result: `Deleting ${req.params.id}`
  })
})

export default purchaseRouter
