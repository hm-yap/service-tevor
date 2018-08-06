import { Router } from 'express'
// Controllers
import userController from '../controllers/UserController'
// Utils
import { requireAdmin } from '../util/auth'

const userRouter = Router()

/**
 * GET /user
 * Retrieve user profile
 */
userRouter.get('/', (req, res) => {
  userController.getProfile(req, res)
})

/**
 * PATCH /user
 * Update of user profile
 * Only limited field can be updated
 */
userRouter.patch('/', (req, res) => {
  userController.updateProfile(req, res)
})

/** User Admin Only routes */
/**
 * GET /user/all
 * Retrieve all users
 */
userRouter.get('/all', requireAdmin('user'), (req, res) => {
  userController.getAll(req, res)
})

/**
 * GET /user/:id
 * Retrieve user with given id
 */
userRouter.get('/:id', requireAdmin('user'), (req, res) => {
  userController.getOne(req, res)
})

/**
 * POST /user
 * Creates a new user
 */
userRouter.post('/', requireAdmin('user'), (req, res) => {
  userController.createUser(req, res)
})

/**
 * PUT /user/:id
 * Update user details
 * All fields can be updated
 */
userRouter.put('/:id', requireAdmin('user'), (req, res) => {
  userController.updateUser(req, res)
})

/**
 * DELETE /user/:id
 * Mark user as deleted
 */
userRouter.delete('/:id', requireAdmin('user'), (req, res) => {
  userController.deleteUser(req, res)
})
/** User Admin Only routes END */

export default userRouter
