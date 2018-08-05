import logger from '../util/logger'
import jobModel from '../models/JobModel'

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
    const allJobs = await jobModel.find()
    res.send(allJobs)
  } catch (err) {
    logger.error('error occured')
    res.send('error occurred')
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
    *    i. if neither, HTTP 401
    * 4. Structure response output with status codes (TBD)
    */
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
 * PUT /job/:id/problem/:id
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
 * DELETE /job/:id/problem/:id
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
 * DELETE /job/:id/part/:id
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
