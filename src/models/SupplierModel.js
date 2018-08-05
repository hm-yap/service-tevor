/**
 * Data Model for 'Supplier' document
 * Store supplier details
 *
 * {
 *   suppid: supplier id, system generated unique id (short id, 6 char, SP-XXXXXXXXXX)
 *   name: full name of the supplier
 *   shortname: nick name of the supplier
 *   contact: contact number of the supplier
 *   createdBy: user id who created this request
 *   modifiedBy: last user who modified this request
 *   createdAt: timestamp when this data is created. automatically handled by Mongoose
 *   updatedAt: timestamp when this data was last updated. automatically handled by Mongoose
 * }
 */
import Mongoose from 'mongoose'

const supplierSchema = new Mongoose.Schema({

}, { timestamps: true })

const supplierModel = Mongoose.model('Supplier', supplierSchema)

export default supplierModel
