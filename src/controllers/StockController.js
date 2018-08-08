// Models
import StockModel from '../models/StockModel'
// Utils
import logger from '../util/logger'
import { delEmpObjValue } from '../util/common'
// Job module related constants
const stockCache = new Map()
const STKPFX = 'STK'
const EXCLUDE_FIELDS = '-deleted -_id -__v'

const controller = {}

export const findStockById = async (stkid, includeDelete = false) => {
  let stock
  logger.info(`Cached stocks: ${stockCache.size}`)

  if (stockCache.has(stkid) === true) {
    stock = stockCache.get(stkid)
  }

  // If not found from cache
  if (!stock) {
    logger.info('Stock not found from cache - fetch from DB...')
    let query = { stockid: stkid }

    if (includeDelete === false) {
      query = Object.assign(query, { deleted: false })
    }

    stock = await StockModel.findOne(query, EXCLUDE_FIELDS)

    // Not adding user to cache if deleted user are included in search
    if (stock && includeDelete === false) {
      stockCache.set(stkid, stock)
    }
  }

  return stock
}

/**
 * Adjust balance quantity of a given stock
 * Exception is expected to be handled by caller
 * @param {*} usrid User id who initiated the request
 * @param {*} stkid stock id for stock adjustment
 * @param {*} adjQty adjustment quantity, negative value to decrease
 */
export const adjStockBal = async (usrid = '', stkid = '', adjQty = 0) => {
  let adjustedStock
  if (usrid !== '' && stkid !== '') {
    adjustedStock = await StockModel.findOneAndUpdate(
      { stockid: stkid },
      { $set: { modifiedBy: usrid }, $inc: { balQty: adjQty } },
      { fields: EXCLUDE_FIELDS, new: true }
    )

    if (adjustedStock) {
      stockCache.set(stkid, adjustedStock)
    }
  }
  return adjustedStock
}

/**
 * POST /stock
 * Stock Admin only
 * Creates a new item
 */
controller.addNewItem = async (req, res) => {
  const { stockid: inputStockid = '', stockDesc: inputStockDesc = '', qty: inputQty = 0 } = req.body

  if (inputStockid === '') {
    return res.status(400).json({ error: 'New stock id cannot be blank' })
  }

  const { user: { userid: curUsrId } } = res.locals

  try {
    const createItem = new StockModel({
      stockid: inputStockid,
      stockDesc: inputStockDesc,
      balQty: inputQty,
      createdBy: curUsrId,
      modifiedBy: curUsrId
    })

    const newItem = await createItem.save()
    const { stockid: newStockid } = newItem

    res.status(200).json({
      result: {
        userid: newStockid
      }
    })
  } catch (err) {
    logger.error(`${STKPFX}.addNewItem: ${err}`)
    res.status(500).json({ error: err })
  }
}
