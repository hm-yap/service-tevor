/**
 * Data Model for 'Job' document
 * Records status of job
 *
 * {
 *   jobid: system generated unique id (short id, 8 char, JB-XXXXXXXX)
 *   client: client id from 'Client' document
 *   imei: user input, imei of the phone
 *   jobno: client jobno for client reference
 *   brand: phone brand for this job, e.g. 'APPLE',  referred from 'Phone'
 *   model: phone model for this job, e.g. 'IPHONE 4', referred from 'Phone'
 *   parts: list of spare parts used in this repair job, referred from 'Stock'
 *   problems: list of problems discovered / fixed for this job
 *   status: current status of the job, 'NEW|ASSIGNED|FIXING|RETURNED|DONE|APPROVED|BILLED|REWORKED'
 *   approved: whether this completed job has been approved by supervisor
 *   credited: whether this job has been credited to payroll
 *   asignee: employee working on the job, user id from 'User'
 *   dateIn: date when this job is retrieved from client site. defaults to createdAt
 *   dateOut: date when this job is completed and deliver to client. defaults to time when job is marked 'DONE'
 *   deleted: whether this record is deleted
 *   createdAt: timestamp when this data is created. automatically handled by Mongoose
 *   updatedAt: timestamp when this data was last updated. automatically handled by Mongoose
 * }
 */
import Mongoose from 'mongoose'

const jobSchema = new Mongoose.Schema({
  jobid: { type: String, unique: true, required: true },
  client: { type: String, required: true },
  imei: { type: String, required: true },
  jobno: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  parts: [{
    itemid: String,
    stockid: String,
    stockDesc: String,
    qty: { type: Number, min: [0, 'Parts quantity cannot be less than 0'] }
  }],
  problems: [String],
  status: {
    type: String,
    enum: ['NEW', 'ASSIGNED', 'FIXING', 'CANCELLED', 'DONE', 'BILLED', 'REWORK'],
    required: true
  },
  approved: { type: Boolean, default: false },
  credited: { type: Boolean, default: false },
  assignee: String,
  dateIn: { type: Date, default: Date.now },
  dateOut: Date,
  deleted: { type: Boolean, default: false }
}, { timestamps: true })

const jobModel = Mongoose.model('Job', jobSchema)

export default jobModel
