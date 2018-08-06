import { Router } from 'express'
import userController from '../controllers/UserController'

const userRouter = Router()

userRouter.get('/', (req, res) => {
  userController.getProfile(req, res)
})

userRouter.get('/all', (req, res) => {
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
  userController.createUser(req, res)
})

userRouter.put('/', (req, res) => {
  userController.updateProfile(req, res)
})

userRouter.put('/:id/role', (req, res) => {
  res.json({
    method: 'PUT',
    result: `Putting ${req.params.id}`
  })
})

userRouter.put('/:id/cert', (req, res) => {
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
