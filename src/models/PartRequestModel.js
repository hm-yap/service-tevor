/**
 * Data Model for 'PartRequest' document
 * Keeps track of part requests (purchasing, deduct from stock, etc)
 * All parts requested by job needs to be added to PartRequest to keep track of parts movement
 *
 * {
 *   prqid: part request id, system generated unique id (short id, 10 char, PQ-XXXXXXXXXX)
 *   stockid: stock id of the requested stock
 *   shortName: custom short name from user
 *   stockDesc: Long name of the part requested
 *   reqQty: requested quantity
 *   createdBy: user id who created this request
 *   modifiedBy: last user who modified this request
 *   createdAt: timestamp when this data is created. automatically handled by Mongoose
 *   updatedAt: timestamp when this data was last updated. automatically handled by Mongoose
 * }
 */
import Mongoose from 'mongoose'

const prqSchema = new Mongoose.Schema({

}, { timestamps: true })

const prqModel = Mongoose.model('PartRequest', prqSchema)

export default prqModel
