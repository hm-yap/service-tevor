import { Router } from 'express'

const userRouter = Router()

userRouter.get('/', (req, res) => {
  res.json({
    method: 'GET',
    result: 'Return everything (TBD)'
  })
})

userRouter.get('/:id', (req, res) => {
  res.json({
    method: 'GET',
    query: `Query String ${req.query.active}`,
    result: `GET ${req.params.id}`
  })
})

userRouter.post('/', (req, res) => {
  res.json({
    method: 'POST',
    result: 'test'
  })
})

userRouter.put('/:id', (req, res) => {
  res.json({
    method: 'PUT',
    result: `Putting ${req.params.id}`
  })
})

userRouter.delete('/:id', (req, res) => {
  res.json({
    method: 'DELETE',
    result: `Deleting ${req.params.id}`
  })
})

export default userRouter
