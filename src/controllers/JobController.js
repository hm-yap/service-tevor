import logger from '../util/logger'

const controller = {}
const test = {
  foo: 'bar'
}

controller.getAll = async (req, res) => {
  try {
    logger.info('Testing get all')
    logger.error('Testing error all')
    res.send(test)
  } catch (err) {
    logger.error('error occured')
    res.send('error occurred')
  }
}

export default controller
