/**
 * Data Model for 'PurchaseOrder' document
 * Keeps track of stock purchases (arriving, ordered, cancelled, etc)
 *
 * {
 *   poid: stock purchase id, system generated unique id (short id, 10 char, PO-XXXXXXXXXX)
 *   items: Items in this purchase order, array of objects with following field
 *         itemid: system generated unique id for this item
 *         stockid: stockid for this item, referred from 'Stock'
 *         stockDesc: stockDesc for this item, referred from 'Stock'
 *         unitPrice: unit price during purchase
 *         qty: quantity of items ordered
 *   delivered: whether the ordered items fully delivered
 *   supplier: Supplied by which supplier, id taken from 'Supplier'
 *   createdAt: timestamp when this data is created. automatically handled by Mongoose
 *   updatedAt: timestamp when this data was last updated. automatically handled by Mongoose
 * }
 */
import Mongoose from 'mongoose'

const poSchema = new Mongoose.Schema({

}, { timestamps: true })

const poModel = Mongoose.model('PurchaseOrder', poSchema)

export default poModel
