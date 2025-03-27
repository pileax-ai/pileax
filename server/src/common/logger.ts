import { pino } from 'pino'
import packageInfo from '../../package.json'

// logger
export const logger = pino({ name: packageInfo.name });
