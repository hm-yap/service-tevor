import { findUserByCert } from '../controllers/UserController'

const userHeader = 'x-tevor-cn'
const unauthorized = { error: 'Unauthorized' }

const auth = async (req, res, next) => {
  const userCn = req.header(userHeader) || ''
  const user = await findUserByCert(userCn)

  if (!user) {
    return res.status(401).json(unauthorized)
  } else {
    res.locals.user = user
    next()
  }
}

export default auth
