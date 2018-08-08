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

jobRouter.post('/:id/problem', (req, res) => {
  jobController.addProblems(req, res)
})

jobRouter.put('/:id/problem/:probid', (req, res) => {
  jobController.updateProblem(req, res)
})

jobRouter.delete('/:id/problem/:probid', (req, res) => {
  jobController.deleteProblem(req, res)
})

jobRouter.post('/:id/part', (req, res) => {
  jobController.addParts(req, res)
})

jobRouter.delete('/:id/part/:partid', (req, res) => {
  jobController.deletePart(req, res)
})

export default jobRouter
