/**
 * Data Model for 'Stock' document
 * Keeps track of stock balances
 *
 * {
 *   stockid: custom short name from user (unique)
 *   stockDesc: Name of the stock
 *   balQty: Current balance of the stock
 *   deleted: whether this stock is marked as deleted
 *   createdBy: user id who created this request
 *   modifiedBy: last user who modified this request
 *   createdAt: timestamp when this data is created. automatically handled by Mongoose
 *   updatedAt: timestamp when this data was last updated. automatically handled by Mongoose
 * }
 */
import Mongoose from 'mongoose'

const stockSchema = new Mongoose.Schema({
  stockid: { type: String, required: true, unique: true },
  stockDesc: { type: String, default: '' },
  balQty: { type: Number, default: 0, min: [0, 'Quantity cannot be less than 0'] },
  deleted: { type: Boolean, default: false },
  createdBy: { type: String, required: true },
  modifiedBy: { type: String, required: true }
}, { timestamps: true })

const stockModel = Mongoose.model('Stock', stockSchema)

export default stockModel
