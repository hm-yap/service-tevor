import { Router } from 'express'
import jobController from '../controllers/JobController'

const jobRouter = Router()

jobRouter.get('/', (req, res) => {
  jobController.getAll(req, res)
})

jobRouter.get('/:id', (req, res) => {
  jobController.getOne(req, res)
})

jobRouter.post('/', (req, res) => {
  jobController.createJob(req, res)
})

jobRouter.put('/:id', (req, res) => {
  jobController.updateJob(req, res)
})

export default jobRouter
