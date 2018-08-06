// Models
import UserModel from '../models/UserModel'
// Utils
import logger from '../util/logger'
import { nextId } from '../util/common'
// List of User module related constants
let userCache = []
const USRID = 'userid'
const USRPFX = 'USR'
const USRPAD = 4

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

const removeFrmCache = (user) => {
  return userCache.filter(usr => usr !== user)
}

/**
 * GET /user
 * Not restricted
 * Returns details of currently logged in user
 */
controller.getProfile = async (req, res) => {
  try {
    const { user: { userid } } = res.locals
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
  try {
    const {
      user: {
        userid: curUsrId,
        roles: curUsrRole = {},
        shortname: curUsrSN
      }
    } = res.locals

    if (curUsrRole.user !== 'ADMIN') {
      return res.status(401).json({ error: `${curUsrSN} do not have permission to access this endpoint` })
    }

    const {
      name: inputName = '',
      shortname: inputShortname = '',
      cert: inputCert = '',
      roles: inputRoles = {} } = req.body

    if (inputName === '' || inputShortname === '' || inputCert === '') {
      return res.status(400).json({ error: 'New user name, shortname or client certificate cannot be blank' })
    }

    const newUserId = await nextId(USRID, USRPFX, USRPAD)
    const newUser = new UserModel({
      userid: newUserId,
      name: inputName.toUpperCase(),
      shortname: inputShortname.toUpperCase(),
      roles: inputRoles,
      cert: inputCert,
      modifiedBy: curUsrId,
      createdBy: curUsrId
    })
    const queryResult = await newUser.save()
    const { name: newName, shortname: newShortname } = queryResult

    res.status(200).json({
      result: {
        userid: newUserId,
        name: newName,
        shortname: newShortname
      }
    })
    userCache.push(queryResult)
  } catch (err) {
    logger.error(`createUser: ${err}`)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * PUT /user
 * Not restricted
 * Update user profile for currently logged on user (limited to shortname only)
 */
controller.updateProfile = async (req, res) => {
  try {
    const { user: curUsr } = res.locals
    const { userid: curUsrId } = curUsr
    const { shortname: inputShortname = '' } = req.body

    if (inputShortname === '') {
      return res.status(400).json({ error: 'New shortname cannot be blank' })
    }

    const queryResult = await UserModel.findOneAndUpdate(
      { userid: curUsrId },
      {
        shortname: inputShortname,
        modifiedBy: curUsrId
      }, { new: true })
    res.status(200).json(queryResult)
    userCache = removeFrmCache(curUsr)
  } catch (err) {
    logger.error(`updateProfile: ${err}`)
    res.status(500).json({ error: 'Internal server error' })
  }
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
