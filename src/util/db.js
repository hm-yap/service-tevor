import Mongoose from 'mongoose'
// Config
import dbConfig from '../config'
// Util
import logger from './logger'

const { dbUser, dbPassword, dbHost, dbPort, dbName } = dbConfig

Mongoose.Promise = global.Promise

const connectToDb = async () => {
  try {
    await Mongoose.connect(`mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`, { useNewUrlParser: true })
    logger.info('Connected to mongo!!!')
  } catch (err) {
    logger.error('Could not connect to MongoDB')
  }
}

export default connectToDb
