import UserModel from '../models/UserModel'

// Simple key:value mapping of userCache
// Example: [{ cert: 'foo', roles: {...}, shortname: 'bar' }]
const userCache = []
const userHeader = 'x-tevor-cn'
const unauthorized = { error: 'Unauthorized' }

export const validator = (req, res, next) => {
  const userCn = req.header(userHeader)

  if (userCn === undefined ||
    userCn === '' ||
    isValidUser(userCn) === false) {
    return res.status(401).json(unauthorized)
  } else {
    next()
  }
}

/**
 * Check if user is valid
 */
const isValidUser = (userCn) => {
  if (findUser(userCn) !== undefined) {
    return true
  }

  return false
}

/**
 * Finds user with the MTLS common names
 */
export const findUser = (userCn) => {
  let user

  if (userCache.length > 0) {
    user = userCache.find(user => (user.cert === userCn))
  }

  if (user === undefined) {
    user = fetchUserFromDB(userCn)
  }

  return user
}

const fetchUserFromDB = async (userCn) => {
  const user = await UserModel.find({ cert: userCn })
  const { roles, shortname } = user

  if (user) {
    userCache.push({
      cert: userCn,
      roles: roles,
      shortname: shortname
    })
  }
  return user
}
