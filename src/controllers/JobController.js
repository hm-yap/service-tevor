import logger from '../util/logger'
import jobModel from '../models/JobModel'

const controller = {}

controller.getAll = async (req, res) => {
  try {
    const allJobs = await jobModel.find()
    res.send(allJobs)
  } catch (err) {
    logger.error('error occured')
    res.send('error occurred')
  }
}

controller.createJob = async (req, res) => {
  const data = req.body

  try {
    const newJob = jobModel(data)
    const result = await newJob.save()
    logger.info('Inserting new job...')
    logger.info(newJob)
    res.send(`success: ${result}`)
  } catch (err) {
    logger.error(`Error during save: ${err}`)
    res.send('Error occurred during save')
  }
}

export default controller
