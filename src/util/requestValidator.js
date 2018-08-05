import UserModel from '../models/UserModel'

// Simple key:value mapping of userCache
// Example: [{ cert: 'foo', roles: {...}, shortname: 'bar' }]
const userCache = []
const userHeader = 'x-tevor-cn'
const unauthorized = { error: 'Unauthorized' }

export const validator = async (req, res, next) => {
  const userCn = req.header(userHeader)

  if (userCn === undefined ||
    userCn === '' ||
    await isValidUser(userCn) === false) {
    return res.status(401).json(unauthorized)
  } else {
    next()
  }
}

/**
 * Check if user is valid
 */
const isValidUser = async (userCn) => {
  const user = await findUser(userCn)
  console.log('Find User result:', user)

  if (user) {
    return true
  }

  return false
}

/**
 * Finds user with the MTLS common names
 */
export const findUser = async (userCn) => {
  let user

  if (userCache.length > 0) {
    user = userCache.find(user => (user.cert === userCn))
  }

  // If not found from cache
  if (user === undefined) {
    user = await fetchUserFromDB(userCn)
  }

  return user
}

const fetchUserFromDB = async (userCn) => {
  const user = await UserModel.findOne({ cert: userCn })

  if (user) {
    const { roles, shortname } = user

    userCache.push({
      cert: userCn,
      roles: roles,
      shortname: shortname
    })
  }

  return user
}
