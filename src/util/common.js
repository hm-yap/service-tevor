// Models
import { next } from '../models/SequenceModel'

export const nextId = async (id = '', prefix = '', padLength = 8) => {
  let nextId = '0'

  if (id !== '') {
    nextId = `${await next(id)}`
  }

  return `${prefix}-${nextId.padStart(padLength, '0')}`
}

export const delEmpValue = (obj) => {
  if (typeof obj === 'object') {
    Object
      .keys(obj)
      .filter(key => obj[key] === undefined)
      .forEach(empty => delete obj[empty])
  }

  return obj
}
