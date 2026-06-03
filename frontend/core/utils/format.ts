/**
 * Format
 *
 * @author Xman
 * @version 1.0
 */
import { BigNumber } from 'bignumber.js'
import type { ManipulateType } from 'dayjs'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(localizedFormat)

// =========================================================
// File
// =========================================================
export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  const size = bytes / Math.pow(k, i)
  return `${parseFloat(size.toFixed(decimals))} ${sizes[i]}`
}

// =========================================================
// Number
// =========================================================
export function formatNumber(value: number, {
  decision = 2,
  unit = '',
  group = true
} = {}) {
  const absValue = Math.abs(value || 0)
  let bigValue = new BigNumber(value || 0)
  if (unit === '亿' && absValue > 1e+8) {
    bigValue = bigValue.dividedBy(1e+8)
  } else if (unit === '万' && absValue > 1e+4) {
    bigValue = bigValue.dividedBy(1e+4)
  }

  if (group) {
    const fmt = {
      decimalSeparator: '.',
      groupSeparator: ',',
      groupSize: 3,
    }
    return bigValue.toFormat(decision, fmt)
  } else {
    return bigValue.toFixed(decision)
  }

}

/**
 * Removes all double and single quotes from a string for clean UI display
 * @param str - The raw font name or string that may contain quotes
 * @returns string
 */
export function stripQuotes(str: string): string {
  if (!str) return ''
  // Use regex to globally replace all single and double quotes with an empty string
  return str.replace(/['"]/g, '')
}

// =========================================================
// Time
// =========================================================
export const timeMulti = (time :string, format = 'YYYY/MM/DD HH:mm:ss') => {
  const  d = dayjs(time).utc().local()
  return {
    fromNow: d.fromNow(),
    timestamp: d.format(format)
  }
}

export const timeAdd = (time :string, value: number, unit:ManipulateType = 'day') => {
  const start = dayjs(time)
  return start.add(value, unit)
}

export const dayDiff = (time :string) => {
  const now = dayjs()
  return now.diff(time, 'day')
}


export const uint8ArrayToBase64 = (bytes: Uint8Array) => {
  const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("")
  return window.btoa(binString)
}

export const base64ToUint8Array = (base64String: string) => {
  const binString = window.atob(base64String)
  return Uint8Array.from(binString, (m) => m.codePointAt(0)!)
}

export const parseBool = (value: any): boolean => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    // Handle cases like 'TRUE', ' true ', or '1'
    const normalized = value.trim().toLowerCase()
    return normalized === 'true' || normalized === '1'
  }

  return false
}
