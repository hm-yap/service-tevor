import fs from 'fs'
import { transports, createLogger, format } from 'winston'

const logDir = './logs'

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.printf(info => `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`)
  ),
  transports: [
    new (transports.Console)({
      colorize: true
    }),
    new transports.File({
      filename: `${logDir}/app.log`,
      maxsize: 20971520, // 20MB
      maxFiles: 25,
      tailable: true
    })
  ]
})

export default logger
