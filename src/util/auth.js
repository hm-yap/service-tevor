import { findUserByCert } from '../controllers/UserController'

const userHeader = 'x-tevor-cn'
const noAuthError = { error: 'Fail to authenticate user' }

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

export default auth
