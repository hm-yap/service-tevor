// Models
import UserModel from '../models/UserModel'
// Utils
import logger from '../util/logger'

// Simple key:value mapping of userCache
// Example: [{ cert: 'foo', roles: {...}, shortname: 'bar' }]
const userCache = []

const controller = {}

export const findUserByCert = async (userCn) => {
  let user
  logger.info(`Cached users: ${userCache.length}`)

  if (userCache.length > 0) {
    user = userCache.find(user => (user.cert === userCn))
  }

  // If not found from cache
  if (user === undefined) {
    logger.info('User not found from cache - fetch from DB...')
    user = await UserModel.findOne({ cert: userCn, deleted: false })

    if (user) {
      userCache.push(user)
    }
  }

  return user
}

const findUserById = async (userid) => {
  let user
  logger.info(`Cached users: ${userCache.length}`)

  if (userCache.length > 0) {
    user = userCache.find(user => (user.userid === userid))
  }

  // If not found from cache
  if (user === undefined) {
    logger.info('User not found from cache - fetch from DB...')
    user = await UserModel.findOne({ userid: userid, deleted: false })

    if (user) {
      userCache.push(user)
    }
  }

  return user
}

/**
 * GET /user
 * Not restricted
 * Returns details of currently logged in user
 */
controller.getProfile = async (req, res) => {
  try {
    const { user: { userid } } = req
    const { name, shortname, roles } = await findUserById(userid)
    res.json({
      result: {
        userid: userid,
        name: name,
        shortname: shortname,
        roles: roles
      }
    })
  } catch (err) {
    logger.error(`Get user profile error: ${err}`)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * GET /user/all
 * User Admin only
 * Returns list of users
 */
controller.getAll = async (req, res) => {

}

/**
 * GET /user/id
 * User Admin only
 * Returns details of user of a given id
 */
controller.getOne = async (req, res) => {

}

/**
 * POST /user
 * User Admin only
 * Creates a new user
 */
controller.createUser = async (req, res) => {

}

/**
 * PUT /user
 * Not restricted
 * Update user profile for currently logged on user (limited to shortname only)
 */
controller.updateProfile = async (req, res) => {

}

/**
 * PUT /user/:id
 * User Admin only
 * Update any user detail for given user id
 */
controller.updateUser = async (req, res) => {

}

/**
 * DELETE /user/:id
 * User Admin only
 * Update deleted to true for given user id
 */
controller.deleteUser = async (req, res) => {

}

export default controller
