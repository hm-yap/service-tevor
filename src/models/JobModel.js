/**
 * Data Model for 'Job' document
 * {
 *   jobid: system_generated unique id
 *   client: client id from 'Client' document
 *   imei: user input, imei of the phone
 *   jobno: client jobno for client reference
 *   brand: phone brand for this job, e.g. 'APPLE',  referred from 'Phone'
 *   model: phone model for this job, e.g. 'IPHONE 4', referred from 'Phone'
 *   parts: list of spare parts used in this repair job, referred from 'Stock'
 *   problems: list of problems discovered / fixed for this job
 *   status: current status of the job, 'NEW|ASSIGNED|FIXING|RETURNED|DONE|APPROVED|BILLED|REWORKED'
 *   asignee: employee working on the job, user id from 'User'
 *   createdAt: timestamp when this data is created. automatically handled by Mongoose
 *   updatedAt: timestamp when this data was last updated. automatically handled by Mongoose
 *   dateIn: date when this job is retrieved from client site. defaults to createdAt
 *   dateOut: date when this job is completed and deliver to client. defaults to time when job is marked 'DONE'
 * }
 */
import { Schema, model } from 'mongoose'

const jobSchema = new Schema({
  jobid: String,
  client: String,
  imei: String,
  jobno: String,
  brand: String,
  model: String,
  parts: [{
    stockid: String,
    stockDesc: String,
    qty: Number
  }],
  problems: [String],
  status: String,
  assignee: String,
  dateIn: Date,
  dateOut: Date
}, { timestamps: true })

const jobModel = model('Job', jobSchema)

export default jobModel
