// Models
import { next } from '../models/SequenceModel'

/**
 * Generates next running number for a given id
 * @param {*} id name of the id, refer to respective models for value, e.g. jobid for JobModel
 * @param {*} prefix prefix of the id, so the id will be formatted like PREFIX-XXXX
 * @param {*} padLength padding length for the id, padLength = 4 will yield 0013 if running number id = 13
 */
export const nextId = async (id = '', prefix = '', padLength = 8) => {
  let nextId = '0'

  if (id !== '') {
    nextId = `${await next(id)}`
  }

  return `${prefix}-${nextId.padStart(padLength, '0')}`
}

/**
 * Find and delete keys with undefined values from a given object
 */
export const delEmpObjValue = (obj) => {
  if (typeof obj === 'object') {
    Object
      .keys(obj)
      .filter(key => obj[key] === undefined)
      .forEach(empty => delete obj[empty])
  }

  return obj
}
