import { findUserByCert } from '../controllers/UserController'

const userHeader = 'x-tevor-cn'
const noAuthError = { error: 'Fail to authenticate user' }

/**
 * Simple middleware to authenticate users
 */
const auth = async (req, res, next) => {
  const userCn = req.header(userHeader) || ''
  const user = await findUserByCert(userCn)

  if (!user) {
    return res.status(401).json(noAuthError)
  } else {
    res.locals.user = user
    res.locals.isAuthenticated = true
    next()
  }
}

/**
 * Custom middleware to enforce route to be restricted to module admins only
 */
export const requireAdmin = (module = '') => {
  return (req, res, next) => {
    const { user = {}, isAuthenticated = false } = res.locals
    const { shortname = '', roles = {} } = user

    if (isAuthenticated === true && roles[module] === 'ADMIN') {
      next()
    } else {
      res.status(403).json({ error: `${shortname} do not have permission to access this endpoint` })
    }
  }
}

/**
 * Checks whether a given user is ADMIN for a given module
 */
export const isAdmin = (user = {}, module = '') => {
  const { roles = {} } = user

  if (roles[module] === 'ADMIN') {
    return true
  }
  return false
}

export default auth
