import { generate } from 'shortid'
// Models
import JobModel from '../models/JobModel'
// Utils
import logger from '../util/logger'
import { nextId, delEmpValue } from '../util/common'
import { isAdmin } from '../util/auth';
// Job module related constants
const JOB_MODULE = 'job'
const JOBID = 'jobid'
const JOBPFX = 'JOB'
const JOBPAD = 8
const EXCLUDE_FIELDS = '-deleted -_id -__v'

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
    const { user = {} } = res.locals
    const { userid: curUsrId } = user
    let findQuery = {}

    if (isAdmin(user, JOB_MODULE) === false) {
      findQuery = Object.assign(findQuery, { assignee: curUsrId })
    }

    const allJobs = await JobModel.find(findQuery)
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
    const { user = {} } = res.locals
    const { userid: curUsrId } = user
    let findQuery = { jobid: req.params.id }

    if (isAdmin(user, JOB_MODULE) === false) {
      findQuery = Object.assign(findQuery, { assignee: curUsrId })
    }

    const job = await JobModel.findOne(findQuery)

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
      status: inputStatus = '',
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
 */
controller.updateJob = async (req, res) => {
  /**
   * Update job logic stub
   * 1. check caller id (TBD)
   * 2. check user permission (TBD)
   *    i.   job admin only - approved, assignee
   *    ii.  user admin only - credited (TBD)
   *    iii. other fields - job admin or assignee only
   *    iv.  No permission - HTTP 401
   * 3. check job ID
   *    i. If not found - HTTP 404
   * 4. 'whitelist' the allowed fields from request payload. Take only whitelisted fields (TBD)
   * 5. Structure response output with status codes (TBD)
   */
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
}

/**
 * POST /job/:id/part
 */
controller.addParts = async (req, res) => {
  /**
   * Adding job parts logic stub
   * 1. check caller id (TBD)
   * 2. check user permission (TBD) - [2 + 3] create a generic user util
   *    i.   Restricted to job admin / assignee only
   *    ii.  No permission - HTTP 401
   * 3. check job ID - [1. + 1i.] put to common job util function
   *    i. If not found - HTTP 404
   * 4. check stockid
   *    i. If not found - HTTP 404
   * 5. 'whitelist' the allowed fields from request payload. Take only whitelisted fields (TBD)
   *    i.   each item qty must be greater than 0
   *    ii.  If payload not valid - HTTP 400
   * 6. Do Part request flow / stock integration:
   *    6.1 check stock quantity
   *        i.   if requested quantity is higher than remaining balance
   *             AND poid not provided
   *             6.1.i.1 Insert into PartRequest - poid = null
   *        ii.  if poid is provided
   *             AND poid exists
   *             AND stock exists in the poid
   *             AND po balance (qty - usedQty) is sufficient to fulfill request
   *             6.1.ii.1 Insert into PartRequest - poid = input poid
   *             6.1.ii.2 Update PurchaseOrder where poid = input poid, claimQty = claimQty + [qty]
   *        iii. if poid provided does not exist or poid stock balance is insufficient
   *             return HTTP 400
   * 7. Update job, inserts the requested parts into parts: [] object array
   * 8. Structure response output with status codes (TBD)
   */
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
   *    ii.  No permission - HTTP 401
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
}

export default controller
