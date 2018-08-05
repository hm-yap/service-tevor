/**
 * Data Model for 'Customer' document
 * Store customer details
 *
 * {
 *   cusid: customer id, system generated unique id (short id, 6 char, CS-XXXXXXXXXX)
 *   name: full name of the customer
 *   shortname: nick name of the customer
 *   contact: contact number of the customer
 *   address: address of customer
 *   createdBy: user id who created this request
 *   modifiedBy: last user who modified this request
 *   createdAt: timestamp when this data is created. automatically handled by Mongoose
 *   updatedAt: timestamp when this data was last updated. automatically handled by Mongoose
 * }
 */
import Mongoose from 'mongoose'

const customerSchema = new Mongoose.Schema({

}, { timestamps: true })

const customerModel = Mongoose.model('Customer', customerSchema)

export default customerModel
