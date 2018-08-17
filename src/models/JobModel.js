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
 *   createdBy: user id who created this request
 *   modifiedBy: last user who modified this request
 *   createdAt: timestamp when this data is created. automatically handled by Mongoose
 *   updatedAt: timestamp when this data was last updated. automatically handled by Mongoose
 * }
 */
import Mongoose from 'mongoose'

const jobSchema = new Mongoose.Schema({
  jobid: { type: String, unique: true, required: true },
  client: { type: String, required: true, uppercase: true },
  imei: { type: String, default: '', uppercase: true },
  jobno: { type: String, default: '', uppercase: true },
  brand: { type: String, required: true, uppercase: true },
  model: { type: String, required: true, uppercase: true },
  parts: [{
    partid: String,
    stockid: String,
    stockDesc: String,
    qty: { type: Number, min: [0, 'Parts quantity cannot be less than 0'] }
  }],
  problems: [{
    probid: String,
    probDesc: String
  }],
  status: {
    type: String,
    enum: ['NEW', 'ASSIGNED', 'FIXING', 'DONE', 'REWORK'],
    required: true,
    uppercase: true,
    default: 'NEW'
  },
  billed: { type: Boolean, default: false },
  approved: { type: Boolean, default: null },
  credited: { type: Boolean, default: false },
  assignee: { type: String, uppercase: true },
  dateIn: { type: Date, default: Date.now },
  dateOut: Date,
  cancelled: { type: Boolean, default: false },
  createdBy: { type: String, required: true, uppercase: true },
  modifiedBy: { type: String, required: true, uppercase: true }
}, { timestamps: true })

const jobModel = Mongoose.model('Job', jobSchema)

export default jobModel
