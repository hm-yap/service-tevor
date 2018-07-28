import { Router } from 'express'

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

stockRouter.post('/', (req, res) => {
  res.json({
    method: 'POST',
    result: 'test'
  })
})

stockRouter.put('/:id', (req, res) => {
  res.json({
    method: 'PUT',
    result: `Putting ${req.params.id}`
  })
})

stockRouter.delete('/:id', (req, res) => {
  res.json({
    method: 'DELETE',
    result: `Deleting ${req.params.id}`
  })
})

export default stockRouter
