import { generate } from 'shortid'
// Models
import JobModel from '../models/JobModel'
// Utils
import { findStockById } from './StockController'
import { addNewRequest, cancelRequest } from './PRController'
import logger from '../util/logger'
import { nextId } from '../util/common'
// Job module related constants
const JOBID = 'jobid'
const JOBPFX = 'JOB'
const JOBPAD = 6
const EXCLUDE_FIELDS = '-_id -__v'

const controller = {}

/**
 * GET /job
 */
controller.getAll = async (req, res) => {
  /**
    * Get all job logic stub
    * 1. Check caller id (TBD)
    * 2. Check caller roles (TBD)
    * 3. If non admin, retrieve only data where assignee = userid (TBD)
    * 4. Structure response output with status codes (TBD)
    * 5. Paginated response (TBD)
    */
  try {
    const findQuery = {}
    const allJobs = await JobModel.find(findQuery, EXCLUDE_FIELDS).sort('jobid')
    res.status(200).json({ result: allJobs })
  } catch (err) {
    logger.error(`${JOBPFX}.getAll: ${err}`)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * GET /job/:id
 */
controller.getOne = async (req, res) => {
  /**
    * Get one job logic stub
    * 1. Check caller id (TBD)
    * 2. Check caller roles (TBD)
    * 3. If not job admin - check if user = assignee
    *    i. if neither, HTTP 404
    * 4. Structure response output with status codes (TBD)
    */
  try {
    const findQuery = { jobid: req.params.id }
    const job = await JobModel.findOne(findQuery, EXCLUDE_FIELDS)

    if (!job) {
      res.status(404).json({ error: 'Job not found' })
    } else {
      res.status(200).json({ result: job })
    }
  } catch (err) {
    logger.error(`${JOBPFX}.getOne: ${err}`)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * POST /job
 */
controller.createJob = async (req, res) => {
  /**
    * Create job logic stub
    * 1. Check caller id (TBD)
    *    i. anyone can create, as long as valid user id in system
    * 2. 'whitelist' the allowed fields from request payload. Take only whitelisted fields (TBD)
    * 3. If required fields not found, return HTTP 400 (TBD)
    * 4. Structure response output with status codes (TBD)
    */
  try {
    const { user: { userid: curUsrId } } = res.locals

    const {
      client: inputClient = '',
      imei: inputImei = '',
      jobno: inputJobno = '',
      brand: inputBrand = '',
      model: inputModel = '',
      status: inputStatus,
      assignee: inputAssignee = ''
    } = req.body

    if (inputClient === '' || inputBrand === '' || inputModel === '') {
      return res.status(400).json({ error: 'Customer ID, phone brand or model cannot be blank' })
    }

    const newJobId = await nextId(JOBID, JOBPFX, JOBPAD)
    const newJob = new JobModel({
      jobid: newJobId,
      client: inputClient,
      imei: inputImei,
      jobno: inputJobno,
      brand: inputBrand,
      model: inputModel,
      status: inputStatus,
      assignee: inputAssignee,
      createdBy: curUsrId,
      modifiedBy: curUsrId
    })
    const saveResult = await newJob.save()
    const { jobid: savedJobid } = saveResult

    res.status(200).json({
      result: {
        jobid: savedJobid
      }
    })
  } catch (err) {
    logger.error(`${JOBPFX}.createJob: ${err}`)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * PUT /job/:id
 * Method to update basic job details, such as jobno, imei
 */
controller.updateJob = async (req, res) => {
  try {

  } catch (err) {
    logger.error(`${JOBPFX}.updateJob: ${err}`)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * PATCH /job/:id/status
 * Update job status, certain status change is restricted to Admin only
 */
controller.updateJobStatus = async (req, res) => {
  const { status: newStatus } = req.body
  const statusList = ['NEW', 'ASSIGNED', 'FIXING', 'DONE', 'REWORK']

  if (!newStatus || statusList.includes(newStatus.toUpperCase()) === false) {
    res.status(204).json()
  } else {
    try {
      const { user: { userid: curUsrId } } = res.locals
      const findQuery = { jobid: req.params.id, cancelled: false }

      const updates = {
        modifiedBy: curUsrId,
        status: newStatus.toUpperCase()
      }

      const updatedJob = await JobModel.findOneAndUpdate(
        findQuery,
        updates,
        { fields: EXCLUDE_FIELDS, new: true }
      )

      if (!updatedJob) {
        res.status(404).json({ error: 'Job not found' })
      } else {
        res.status(200).json({ result: updatedJob })
      }
    } catch (err) {
      logger.error(`${JOBPFX}.updateJobStatus: ${err}`)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

/**
 * PATCH /job/:id/assignee
 * Update job assignee
 */
controller.updateJobAssignee = async (req, res) => {
  const { assignee: newAssignee } = req.body

  if (!newAssignee) {
    res.status(204).json()
  } else {
    try {
      const { user: { userid: curUsrId } } = res.locals
      const findQuery = { jobid: req.params.id, cancelled: false }

      const updates = {
        modifiedBy: curUsrId,
        assignee: newAssignee
      }

      const updatedJob = await JobModel.findOneAndUpdate(
        findQuery,
        updates,
        { fields: EXCLUDE_FIELDS, new: true }
      )

      if (!updatedJob) {
        res.status(404).json({ error: 'Job not found' })
      } else {
        res.status(200).json({ result: updatedJob })
      }
    } catch (err) {
      logger.error(`${JOBPFX}.updateJobAssignee: ${err}`)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

/**
 * PATCH /job/:id/approve
 * Approve / reject job
 */
controller.approveJob = async (req, res) => {
  const { approved: isApproved } = req.body

  if (typeof isApproved !== 'boolean') {
    res.status(204).json()
  } else {
    try {
      const { user: { userid: curUsrId } } = res.locals
      const findQuery = { jobid: req.params.id, cancelled: false, status: 'DONE' }

      const updates = {
        modifiedBy: curUsrId,
        approved: isApproved
      }

      const updatedJob = await JobModel.findOneAndUpdate(
        findQuery,
        updates,
        { fields: EXCLUDE_FIELDS, new: true }
      )

      if (!updatedJob) {
        res.status(404).json({ error: 'Job not found' })
      } else {
        res.status(200).json({ result: updatedJob })
      }
    } catch (err) {
      logger.error(`${JOBPFX}.approveJob: ${err}`)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

/**
 * POST /job/:id/problem
 */
controller.addProblems = async (req, res) => {
  /**
   * Adding job problems logic stub
   * 1. check caller id (TBD)
   * 2. check user permission (TBD) - [2 + 3] create a generic user util
   *    i.   Restricted to job admin / assignee only
   *    ii.  No permission - HTTP 401
   * 3. check job ID - [1. + 1i.] put to common job util function
   *    i. If not found - HTTP 404
   * 4. 'whitelist' the allowed fields from request payload. Take only whitelisted fields (TBD)
   * 5. Generate unique problem id
   * 6. Structure response output with status codes (TBD)
   */
  const { probDesc: inputProbDesc } = req.body

  if (!inputProbDesc) {
    res.status(204).json()
  } else {
    try {
      const { user = {} } = res.locals
      const { userid: curUsrId } = user
      let findQuery = { jobid: req.params.id, cancelled: false }
      const newProbid = `PRB-${generate()}`

      const updates = {
        $set: { modifiedBy: curUsrId },
        $push: { problems: { probid: newProbid, probDesc: inputProbDesc } }
      }

      const updatedJob = await JobModel.findOneAndUpdate(
        findQuery,
        updates,
        { fields: EXCLUDE_FIELDS, new: true }
      )

      if (!updatedJob) {
        res.status(404).json({ error: 'Job not found' })
      } else {
        res.status(200).json({ result: updatedJob })
      }
    } catch (err) {
      logger.error(`${JOBPFX}.addProblems: ${err}`)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

/**
 * PUT /job/:id/problem/:probid
 */
controller.updateProblem = async (req, res) => {
  /**
   * Update job problem logic stub
   * 1. check caller id (TBD)
   * 2. check user permission (TBD)
   *    i.   Restricted to job admin / assignee only
   *    ii.  No permission - HTTP 401
   * 3. check job ID
   *    i. If not found - HTTP 404
   * 4. check problem ID
   *    i. If not found - HTTP 404
   * 5. 'whitelist' the allowed fields from request payload. Take only whitelisted fields (TBD)
   * 6. Structure response output with status codes (TBD)
   */
  const { probDesc: inputProbDesc } = req.body

  if (!inputProbDesc) {
    res.status(204).json()
  } else {
    try {
      const { id: inputJobid, probid: inputProbid } = req.params
      const { user = {} } = res.locals
      const { userid: curUsrId } = user

      let findQuery = { jobid: inputJobid, cancelled: false, 'problems.probid': inputProbid }

      const updates = {
        $set: { modifiedBy: curUsrId, 'problems.$.probDesc': inputProbDesc }
      }

      const updatedJob = await JobModel.findOneAndUpdate(
        findQuery,
        updates,
        { fields: EXCLUDE_FIELDS, new: true }
      )

      if (!updatedJob) {
        res.status(404).json({ error: 'Job not found' })
      } else {
        res.status(200).json({ result: updatedJob })
      }
    } catch (err) {
      logger.error(`${JOBPFX}.updateProblem: ${err}`)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

/**
 * DELETE /job/:id/problem/:probid
 */
controller.deleteProblem = async (req, res) => {
  /**
   * Delete job problem logic stub
   * 1. check caller id (TBD)
   * 2. check user permission (TBD)
   *    i.   Restricted to job admin / assignee only
   *    ii.  No permission - HTTP 401
   * 3. check job ID
   *    i. If not found - HTTP 404
   * 4. check problem ID
   *    i. If not found - HTTP 404
   * 5. 'whitelist' the allowed fields from request payload. Take only whitelisted fields (TBD)
   * 6. Structure response output with status codes (TBD)
   */
  try {
    const { id: inputJobid, probid: inputProbid } = req.params
    const { user = {} } = res.locals
    const { userid: curUsrId } = user

    let findQuery = { jobid: inputJobid, cancelled: false }

    const updates = {
      $set: { modifiedBy: curUsrId },
      $pull: { problems: { probid: inputProbid } }
    }

    const updatedJob = await JobModel.findOneAndUpdate(
      findQuery,
      updates,
      { fields: EXCLUDE_FIELDS, new: true }
    )

    if (!updatedJob) {
      res.status(404).json({ error: 'Job not found' })
    } else {
      res.status(200).json({ result: updatedJob })
    }
  } catch (err) {
    logger.error(`${JOBPFX}.deleteProblem: ${err}`)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * POST /job/:id/part
 */
controller.addParts = async (req, res) => {
  /**
   * Adding job parts logic stub
   * 1. check caller id
   * 2. check user permission - [2 + 3] create a generic user util
   *    i.   Restricted to job admin / assignee only
   *    ii.  No permission - HTTP 401
   * 3. check job ID - [1. + 1i.] put to common job util function
   *    i. If not found - HTTP 404
   * 4. check stockid
   *    i. If not found - HTTP 404
   * 5. 'whitelist' the allowed fields from request payload. Take only whitelisted fields
   *    i.   each item qty must be greater than 0
   *    ii.  If payload not valid - HTTP 400
   * 6. Do Part request flow / stock integration:
   *    6.1 Insert into PartRequest - poid = null
   * 7. Update job, inserts the requested parts into parts: [] object array
   * 8. Structure response output with status codes
   */
  const { stockid: inputStockid = '', qty: inputQty = 0 } = req.body
  const { id: inputJobid } = req.params
  const { user = {} } = res.locals
  const { userid: curUsrId } = user
  let findQuery = { jobid: inputJobid, cancelled: false }

  if (inputStockid === '' || inputQty <= 0) {
    return res.status(400).json({ error: 'Stock ID cannot be empty and quantity cannot be less than 1' })
  }

  try {
    // Checks whether job exists and whether job is assigned to user
    const assignedJob = await JobModel.findOne(findQuery)

    if (!assignedJob) {
      return res.status(403).json({ error: 'Only job admin or assignee can request for parts' })
    }

    const stock = await findStockById(inputStockid)

    if (!stock) {
      return res.status(404).json({ error: 'Part not found' })
    }

    const { stockDesc: inputStockDesc } = stock

    const reqPart = {
      stockid: inputStockid,
      stockDesc: inputStockDesc,
      qty: inputQty
    }

    // Adding new part request
    const partReqRes = await addNewRequest(curUsrId, inputJobid, reqPart)

    if (!partReqRes) {
      return res.status(404).json({ error: 'Error when adding new part request' })
    } else {
      const { prqid: newPRQID } = partReqRes
      console.log('New part request:', partReqRes)
      console.log('New PRQID:', newPRQID)

      const updates = {
        $set: { modifiedBy: curUsrId },
        $push: { parts: { prqid: newPRQID } }
      }

      const updatedJob = await JobModel.findOneAndUpdate(
        findQuery,
        updates,
        { fields: EXCLUDE_FIELDS, new: true }
      )

      res.status(200).json({ result: updatedJob })
    }
  } catch (err) {
    logger.error(`${JOBPFX}.addParts: ${err}`)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * DELETE /job/:id/part/:partid
 */
controller.deletePart = async (req, res) => {
  /**
   * Delete job part logic stub
   * 1. check caller id (TBD)
   * 2. check user permission (TBD)
   *    i.   restricted to assignee & job admin only
   *    ii.  No permission - HTTP 403
   * 3. check job ID
   *    i. If not found - HTTP 404
   * 4. check job part ID
   *    i. If not found - HTTP 404
   * 5. 'whitelist' the allowed fields from request payload. Take only whitelisted fields (TBD)
   * 6. Do Part request flow / stock integration:
   *    i. Update from PartRequest where stockid = [stockid] and jobid = [jobid]
   *       SET status to 'CANCELLED'
   * 7. Remove the part from parts array
   * 8. Structure response output with status codes (TBD)
   */
  const { id: inputJobid, partid: inputPartid } = req.params
  const { user = {} } = res.locals
  const { userid: curUsrId } = user
  let findQuery = { jobid: inputJobid, cancelled: false, billed: false }

  try {
    const updates = {
      $set: { modifiedBy: curUsrId },
      $pull: { parts: { prqid: inputPartid } }
    }

    const updatedJob = await JobModel.findOneAndUpdate(
      findQuery,
      updates,
      { fields: EXCLUDE_FIELDS, new: true }
    )

    if (!updatedJob) {
      return res.status(404).json({ error: 'Job not found' })
    } else {
      // Cancel part request
      await cancelRequest(curUsrId, inputJobid, inputPartid)
      res.status(200).json({ result: updatedJob })
    }
  } catch (err) {
    logger.error(`${JOBPFX}.deletePart: ${err}`)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export default controller
