/**
 * Data Model for 'User' document
 * Store user identity, roles
 *
 * {
 *   userid: user id, system generated unique id (short id, 6 char, UR-XXXXXXXXXX)
 *   name: full name of the user
 *   shortname: nick name of the user
 *   roles: list of roles of the user
 *   certs: list of client certificates provisioned to the user for MTLS authentication
 *   createdBy: user id who created this request
 *   modifiedBy: last user who modified this request
 *   createdAt: timestamp when this data is created. automatically handled by Mongoose
 *   updatedAt: timestamp when this data was last updated. automatically handled by Mongoose
 * }
 */
import Mongoose from 'mongoose'

const userSchema = new Mongoose.Schema({

}, { timestamps: true })

const userModel = Mongoose.model('User', userSchema)

export default userModel
