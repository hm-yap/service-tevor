import { generate } from 'shortid'
// Parts request / Purchase request
// Models
import PartRequestModel from '../models/PartRequestModel'
// Utils
import logger from '../util/logger'
// Job module related constants
const PRQPFX = 'PRQ'
const EXCLUDE_FIELDS = '-closed -_id -__v'

const controller = {}

/**
 * Add a new part request from job
 * Exception is expected to be handled by caller
 * @param {*} usrid User id who initiated the request
 * @param {*} jobid jobid involved in the part request
 * @param {*} reqPart part requested, must be a valid part object
 * Example:
 * {
 *   partid: xxxx
 *   stockid: xxxx
 *   stockDesc: xxxx
 *   qty: xxxx
 * }
 */
export const addNewRequest = async (usrid = '', jobid = '', reqPart = {}) => {
  let newRequest

  if (usrid !== '' && jobid !== '' && reqPart !== {}) {
    const nextPrqid = `${PRQPFX}-${generate()}`
    const {
      partid: inputPartid,
      stockid: inputStockid,
      stockDesc: inputStockDesc,
      qty: inputQty
    } = reqPart

    const createPrqRequest = new PartRequestModel({
      prqid: nextPrqid,
      jobid: jobid,
      partid: inputPartid,
      stockid: inputStockid,
      stockDesc: inputStockDesc,
      reqQty: inputQty,
      createdBy: usrid,
      modifiedBy: usrid
    })

    newRequest = await createPrqRequest.save()
  }

  return newRequest
}

export const cancelRequest = async (usrid = '', jobid = '', partid = '') => {
  let updatedRequest

  if (usrid !== '' && jobid !== '' && partid !== '') {
    const findQuery = {
      jobid: jobid,
      partid: partid,
      closed: false
    }

    updatedRequest = await PartRequestModel.findOneAndUpdate(
      findQuery,
      { status: 'CANCELLED' },
      { new: true, fields: EXCLUDE_FIELDS }
    )
  }

  return updatedRequest
}

controller.getAll = async (req, res) => {
  try {
    const allRequests = await PartRequestModel
      .find({ closed: false }, EXCLUDE_FIELDS)
      .sort({ modifiedAt: -1 })
    res.status(200).json({ result: allRequests })
  } catch (err) {
    logger.error(`${PRQPFX}.getAll: ${err}`)
    res.status(500).json({ error: 'Internal server error' })
  }
}
