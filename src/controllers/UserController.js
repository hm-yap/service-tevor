// Models
import UserModel from '../models/UserModel'
// Utils
import logger from '../util/logger'
import { nextId, delEmpObjValue } from '../util/common'
// User module related constants
const userCache = new Map()
const certCache = new Map()
const USRID = 'userid'
const USRPFX = 'USR'
const USRPAD = 4
const EXCLUDE_FIELDS = '-deleted -_id -__v'

const controller = {}

export const findUserByCert = async (userCn) => {
  let user
  logger.info(`Cached certs: ${certCache.size}`)

  if (certCache.has(userCn) === true) {
    user = certCache.get(userCn)
  }

  // If not found from cache
  if (user === undefined) {
    logger.info('Cert not found from cache - fetch from DB...')
    user = await UserModel.findOne({ cert: userCn, deleted: false }, EXCLUDE_FIELDS)

    if (user) {
      certCache.set(userCn, user)
    }
  }

  return user
}

const findUserById = async (usrid, includeDelete = false) => {
  let user
  logger.info(`Cached users: ${userCache.size}`)

  if (userCache.has(usrid) === true) {
    user = userCache.get(usrid)
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
      userCache.set(usrid, user)
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
 * Returns list of users, sort by user id
 */
controller.getAll = async (req, res) => {
  try {
    const userArr = await UserModel.find({ deleted: false }, EXCLUDE_FIELDS).sort('userid')
    res.status(200).json({ result: userArr })
  } catch (err) {
    logger.error(`${USRPFX}.getAll: ${err}`)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * GET /user/id
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

    const nextUserId = await nextId(USRID, USRPFX, USRPAD)
    const createUser = new UserModel({
      userid: nextUserId,
      name: inputName.toUpperCase(),
      shortname: inputShortname.toUpperCase(),
      roles: inputRoles,
      cert: inputCert,
      modifiedBy: curUsrId,
      createdBy: curUsrId
    })
    const newUser = await createUser.save()
    const { userid: newUserId, name: newName, shortname: newShortname } = newUser

    res.status(200).json({
      result: {
        userid: newUserId,
        name: newName,
        shortname: newShortname
      }
    })
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

    const updatedUser = await UserModel.findOneAndUpdate(
      { userid: curUsrId },
      {
        shortname: inputShortname,
        modifiedBy: curUsrId
      }, { fields: EXCLUDE_FIELDS, new: true })
    res.status(200).json(updatedUser)

    userCache.set(curUsrId, updatedUser)
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

    const updates = {
      name: inputName,
      shortname: inputShortname,
      cert: inputCert,
      roles: inputRoles,
      modifiedBy: curUsrId
    }

    const validUpdates = delEmpObjValue(updates)

    const updatedUser = await UserModel.findOneAndUpdate(
      { userid: updUsrId, deleted: false },
      validUpdates,
      { fields: EXCLUDE_FIELDS, new: true }
    )

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' })
    } else {
      res.status(200).json({ result: updatedUser })
      userCache.set(updUsrId, updatedUser)
      // Auth cache refresh after any user update
      certCache.set(updatedUser.cert, updatedUser)
      if (inputCert) {
        certCache.delete(inputCert)
      }
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
    const delUsrId = req.params.id
    const { user: { userid: curUsrId } } = res.locals

    const deletedUser = await UserModel.findOneAndUpdate(
      { userid: delUsrId, deleted: false },
      { deleted: true, modifiedBy: curUsrId },
      { fields: EXCLUDE_FIELDS, new: true }
    )

    if (!deletedUser) {
      res.status(404).json({ error: 'User not found' })
    } else {
      res.status(200).json({ result: deletedUser })
      userCache.delete(delUsrId)

      certCache.delete(deletedUser.cert)
    }
  } catch (err) {
    logger.error(`${USRPFX}.deleteUser: ${err}`)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export default controller
