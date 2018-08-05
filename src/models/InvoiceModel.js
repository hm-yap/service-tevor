/**
 * Data Model for 'Invoice' document
 * Store invoice details
 *
 * {
 *   invid: invoice id, system generated unique id (short id, 6 char, IN-XXXXXXXXXX)
 *   cusid: customer id, billed to which customer
 *   createdBy: user id who created this request
 *   modifiedBy: last user who modified this request
 *   createdAt: timestamp when this data is created. automatically handled by Mongoose
 *   updatedAt: timestamp when this data was last updated. automatically handled by Mongoose
 * }
 */
import Mongoose from 'mongoose'

const invoiceSchema = new Mongoose.Schema({

}, { timestamps: true })

const invoiceModel = Mongoose.model('Invoice', invoiceSchema)

export default invoiceModel
