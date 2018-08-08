/**
 * Data Model for 'PartRequest' document
 * Keeps track of part requests (purchasing, deduct from stock, etc)
 * All parts requested by job needs to be added to PartRequest to keep track of parts movement
 *
 * {
 *   prqid: part request id, system generated unique id (short id, 10 char, PRQ-XXXXXXXXXX)
 *   jobid: request came from which jobid
 *   partid: part id from the job
 *   stockid: stock id of the requested stock
 *   poid: this request was fulfilled by which poid
 *   stockDesc: Long name of the part requested
 *   reqQty: requested quantity
 *   closed: whether this request is closed or not
 *   status: status of the request: 'NEW|CANCELLED|ORDERED|DELIVERED|RETURNED'
 *   createdBy: user id who created this request
 *   modifiedBy: last user who modified this request
 *   createdAt: timestamp when this data is created. automatically handled by Mongoose
 *   updatedAt: timestamp when this data was last updated. automatically handled by Mongoose
 * }
 */
import Mongoose from 'mongoose'

const prqSchema = new Mongoose.Schema({
  prqid: { type: String, unique: true, required: true },
  jobid: { type: String, required: true },
  partid: { type: String, required: true },
  stockid: { type: String, required: true },
  poid: { type: String, default: '' },
  stockDesc: { type: String, required: true },
  reqQty: { type: Number, min: [0, 'Parts quantity cannot be less than 0'] },
  closed: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['NEW', 'ORDERED', 'DELIVERED', 'RETURNED', 'CANCELLED'],
    required: true,
    default: 'NEW'
  },
  createdBy: { type: String, required: true },
  modifiedBy: { type: String, required: true }
}, { timestamps: true })

const prqModel = Mongoose.model('PartRequest', prqSchema)

export default prqModel
