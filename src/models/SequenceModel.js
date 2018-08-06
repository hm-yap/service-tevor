/**
 * Data Model for 'Sequence' document
 * Store sequence for running numbers
 *
 * {
 *   seqid: id field for the sequence
 *   nextSeq: next running number for the id field
 * }
 */
import Mongoose from 'mongoose'

const seqSchema = new Mongoose.Schema({
  seqid: { type: String, unique: true, required: true },
  nextSeq: { type: Number, default: 1 }
}, { timestamps: true })

const seqModel = Mongoose.model('Sequence', seqSchema)

export const next = async (id) => {
  const { nextSeq = 1 } = await seqModel.findOneAndUpdate(
    { seqid: id },
    { $inc: { nextSeq: 1 } },
    { upsert: true, new: true }) || {}
  return nextSeq
}

export default seqModel
