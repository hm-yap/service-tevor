// Models
import UserModel from '../models/UserModel'
// Utils
import logger from '../util/logger'
import { nextId, delEmpObjValue } from '../util/common'
// User module related constants
let userCache = []
const USRID = 'userid'
const USRPFX = 'USR'
const USRPAD = 4
const EXCLUDE_FIELDS = '-deleted -_id -__v'

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
    user = await UserModel.findOne({ cert: userCn, deleted: false }, EXCLUDE_FIELDS)

    if (user) {
      userCache.push(user)
    }
  }

  return user
}

const findUserById = async (usrid, includeDelete = false) => {
  let user
  logger.info(`Cached users: ${userCache.length}`)

  if (userCache.length > 0) {
    user = userCache.find(user => (user.userid === usrid))
  }

  // If not found from cache
  if (!user) {
    logger.info('User not found from cache - fetch from DB...')
    let query = { userid: usrid }

    if (includeDelete === false) {
      query = Object.assign(query, { deleted: false })
    }

    user = await UserModel.findOne(query, EXCLUDE_FIELDS)

    // Not adding user to cache if deleted user are included in search
    if (user && includeDelete === false) {
      userCache.push(user)
    }
  }

  return user
}

/**
 * Get short name of user id of createdBy
 * @param {*} createdByID user id who initially created the record
 * @returns nick name of the user, 'NOTFOUND' if user can no longer be found
 */
export const getCreatedBySN = async (createdBy) => {
  const { shortname } = await findUserById(createdBy, true) || {}
  return shortname || 'NOTFOUND'
}

/**
 * Get short name of user id of modifiedBy
 * @param {*} modifiedByID user id who last modified the record
 * @returns nick name of the user, 'NOTFOUND' if user can no longer be found
 */
export const getModifiedBySN = async (modifiedBy) => {
  const { shortname } = await findUserById(modifiedBy, true) || {}
  return shortname || 'NOTFOUND'
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

    const userObj = await findUserById(userid)
    const { createdBy, modifiedBy } = userObj

    const creatorSN = await getCreatedBySN(createdBy)
    const updaterSN = await getModifiedBySN(modifiedBy)

    const resultObj = Object.assign(userObj, { createdBy: creatorSN, modifiedBy: updaterSN })

    res.status(200).json({ result: resultObj })
  } catch (err) {
    logger.error(`${USRPFX}.getProfile: ${err}`)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * GET /user/all
 * User Admin only
 * Returns list of users, sort by user id
 */
controller.getAll = async (req, res) => {
  try {
    const userArr = await UserModel.find({ deleted: false }, EXCLUDE_FIELDS).sort('userid')
    res.status(200).json({ result: userArr })
    userCache = userArr
  } catch (err) {
    logger.error(`${USRPFX}.getAll: ${err}`)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * GET /user/id
 * User Admin only
 * Returns details of user of a given id
 */
controller.getOne = async (req, res) => {
  try {
    const user = await findUserById(req.params.id)

    if (!user) {
      res.status(404).json({ error: 'User not found' })
    } else {
      res.status(200).json({ result: user })
    }
  } catch (err) {
    logger.error(`${USRPFX}.getOne: ${err}`)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * POST /user
 * User Admin only
 * Creates a new user
 */
controller.createUser = async (req, res) => {
  try {
    const { user: { userid: curUsrId } } = res.locals

    const {
      name: inputName = '',
      shortname: inputShortname = '',
      cert: inputCert = '',
      roles: inputRoles = {}
    } = req.body

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
    logger.error(`${USRPFX}.createUser: ${err}`)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * PATCH /user
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
      }, { fields: EXCLUDE_FIELDS, new: true })
    res.status(200).json(queryResult)
    userCache = removeFrmCache(curUsr)
  } catch (err) {
    logger.error(`${USRPFX}.updateProfile: ${err}`)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * PUT /user/:id
 * User Admin only
 * Update any user detail for given user id
 */
controller.updateUser = async (req, res) => {
  try {
    const updUsrId = req.params.id
    const { user: { userid: curUsrId } } = res.locals

    const {
      name: inputName,
      shortname: inputShortname,
      cert: inputCert,
      roles: inputRoles
    } = req.body

    if (inputName === '' || inputShortname === '' || inputCert === '') {
      return res.status(400).json({ error: 'New user name, shortname or client certificate cannot be blank' })
    }

    const updateFields = {
      name: inputName,
      shortname: inputShortname,
      cert: inputCert,
      roles: inputRoles,
      modifiedBy: curUsrId
    }

    const validUpdateFields = delEmpObjValue(updateFields)

    const updatedUser = await UserModel.findOneAndUpdate(
      { userid: updUsrId, deleted: false },
      validUpdateFields,
      { fields: EXCLUDE_FIELDS, new: true }
    )

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' })
    } else {
      res.status(200).json({ result: updatedUser })
      userCache = removeFrmCache(updatedUser)
    }
  } catch (err) {
    logger.error(`${USRPFX}.updateUser: ${err}`)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * DELETE /user/:id
 * User Admin only
 * Update deleted to true for given user id
 */
controller.deleteUser = async (req, res) => {
  try {
    const updUsrId = req.params.id
    const { user: { userid: curUsrId } } = res.locals

    const deletedUser = await UserModel.findOneAndUpdate(
      { userid: updUsrId, deleted: false },
      { deleted: true, modifiedBy: curUsrId },
      { fields: EXCLUDE_FIELDS, new: true }
    )

    if (!deletedUser) {
      res.status(404).json({ error: 'User not found' })
    } else {
      res.status(200).json({ result: deletedUser })
      userCache = removeFrmCache(deletedUser)
    }
  } catch (err) {
    logger.error(`${USRPFX}.deleteUser: ${err}`)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export default controller
