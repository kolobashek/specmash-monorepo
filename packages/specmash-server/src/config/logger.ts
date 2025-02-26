import winston from 'winston'
import * as path from 'path'

const timezonedTime = new Date().toLocaleString('ru-RU', {
    timeZone: 'Asia/Bangkok',
  })

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
    // new winston.transports.Console({
    //   format: winston.format.combine(
    //     winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    //     winston.format.json()
    //   ),
    // }),
    new winston.transports.File({
      filename: 'logs/debug.log',
      level: 'debug',
      format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
    }),
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.label({
          label: path.basename(import.meta.url || 'elsewhere'),
        }),

        winston.format.prettyPrint(),
        winston.format.printf((info) => {
          return `[${timezonedTime}] ${info.level}: ${info.message}`
        })
      ),
    }),
  ],
})

export default logger
