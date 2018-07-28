import { Router } from 'express'
import jobController from '../controllers/JobController'

const jobRouter = Router()

jobRouter.get('/', (req, res) => {
  jobController.getAll(req, res)
})

jobRouter.get('/:id', (req, res) => {
  res.json({
    method: 'GET',
    query: `Query String ${req.query.active}`,
    result: `GET ${req.params.id}`
  })
})

jobRouter.post('/', (req, res) => {
  jobController.createJob(req, res)
})

jobRouter.put('/:id', (req, res) => {
  res.json({
    method: 'PUT',
    result: `Putting ${req.params.id}`
  })
})

jobRouter.delete('/:id', (req, res) => {
  res.json({
    method: 'DELETE',
    result: `Deleting ${req.params.id}`
  })
})

export default jobRouter
