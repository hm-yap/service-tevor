import { Router } from 'express'

const customerRouter = Router()

customerRouter.get('/', (req, res) => {
  res.json({
    method: 'GET',
    result: 'Return everything (TBD)'
  })
})

customerRouter.get('/:id', (req, res) => {
  res.json({
    method: 'GET',
    query: `Query String ${req.query.active}`,
    result: `GET ${req.params.id}`
  })
})

customerRouter.post('/', (req, res) => {
  res.json({
    method: 'POST',
    result: 'test'
  })
})

customerRouter.put('/:id', (req, res) => {
  res.json({
    method: 'PUT',
    result: `Putting ${req.params.id}`
  })
})

customerRouter.delete('/:id', (req, res) => {
  res.json({
    method: 'DELETE',
    result: `Deleting ${req.params.id}`
  })
})

export default customerRouter
