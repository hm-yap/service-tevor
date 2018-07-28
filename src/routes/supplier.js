import { Router } from 'express'

const supplierRouter = Router()

supplierRouter.get('/', (req, res) => {
  res.json({
    method: 'GET',
    result: 'Return everything (TBD)'
  })
})

supplierRouter.get('/:id', (req, res) => {
  res.json({
    method: 'GET',
    query: `Query String ${req.query.active}`,
    result: `GET ${req.params.id}`
  })
})

supplierRouter.post('/', (req, res) => {
  res.json({
    method: 'POST',
    result: 'test'
  })
})

supplierRouter.put('/:id', (req, res) => {
  res.json({
    method: 'PUT',
    result: `Putting ${req.params.id}`
  })
})

supplierRouter.delete('/:id', (req, res) => {
  res.json({
    method: 'DELETE',
    result: `Deleting ${req.params.id}`
  })
})

export default supplierRouter
