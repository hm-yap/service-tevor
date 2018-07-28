/**
 * Data Model for 'StockAudit' document
 * Keeps track of stock movement
 *
 * {
 *   auditid: system generated unique id (short id, 10 char, AD-XXXXXXXXXX)
 *   refid: reference id involved in this transaction. Equals to jobid if added from Job
 *   module: main module of the transaction, e.g. 'JOB|STOCK|BILLING'
 *   stockid: stock id involved in this transaction
 *   stockDesc: Name of the stock (taken from stock document)
 *   prevQty: previous balance before the transaction
 *   adjQty: adjusted quantity for this transaction, negative if used, positive during parts purchase
 *   balQty: new stock balance after the transaction
 *   type: Transaction type: 'IN|OUT|ADJUSTMENT|RETURNED|EXCHANGE|DELETED'
 *   operator: User involved in this transaction
 *   createdAt: timestamp when this data is created. automatically handled by Mongoose
 *   updatedAt: timestamp when this data was last updated. automatically handled by Mongoose
 * }
 */
import Mongoose from 'mongoose'

const stockAuditSchema = new Mongoose.Schema({

}, { timestamps: true })

const stockAuditModel = Mongoose.model('StockAudit', stockAuditSchema)

export default stockAuditModel
