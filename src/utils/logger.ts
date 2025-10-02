import { config } from '@/config/config'
import pino from 'pino'

export const logger = pino({
  level: config.server.logLevel,
})
