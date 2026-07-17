/**
 * Book Util
 *
 * @version 1.0
 */
import CryptoJS from 'crypto-js'
import sha1 from 'crypto-js/sha1'
import encHex from 'crypto-js/enc-hex'
import { AnnotationColors } from 'core/constants/constant'

export const getFileSHA1 =  async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer()
  if (crypto?.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-1', arrayBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  } else {
    const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(arrayBuffer))
    return sha1(wordArray).toString(encHex)
  }
}

export const base64ToFile = (base64: string, name: string): File => {
  if (!base64 || typeof base64 !== 'string' || !base64.includes(',')) {
    return new File([new Uint8Array(0)], 'NA', { type: 'application/octet-stream' })
  }

  const arr = base64.split(',')
  const base64Content = arr[1] || ''
  const mimeMatch = arr[0]?.match(/:(.*?);/)
  // console.log('mimeMatch', mimeMatch)
  let mime = mimeMatch?.[1] ?? 'application/octet-stream'
  if (mime === 'application/octet-stream') {
    mime = detectImageMime(base64Content)
  }

  const extension = mime.split('/')[1] || 'png' // image/png -> png
  const filename = `${name}.${extension}`

  const bstr = atob(base64Content)
  const u8arr = new Uint8Array(bstr.length)
  for (let i = 0; i < bstr.length; i++) {
    u8arr[i] = bstr.charCodeAt(i)
  }

  return new File([u8arr], filename, { type: mime })
}

export const detectImageMime = (base64: string) => {
  if (base64.startsWith('iVBORw0KGgo')) return 'image/png'
  if (base64.startsWith('/9j/')) return 'image/jpeg'
  if (base64.startsWith('R0lGOD')) return 'image/gif'
  if (base64.startsWith('UklGR')) return 'image/webp'
  if (base64.startsWith('Qk')) return 'image/bmp'

  return 'application/octet-stream'
}

export const getAnnotationColor = (colorName: string) => {
  return AnnotationColors[colorName] || AnnotationColors.green
}

export const getWeservUrl = (url: string) => {
  if (!url || typeof url !== 'string') return url

  const path = url.replace(/^https?:\/\//, '')

  return `https://images.weserv.nl/?url=${encodeURIComponent(path)}`
}

export const isTitleSimilar = (title1: string, title2: string, threshold = 0.8): boolean => {
  const normalize = (str: string) =>
    str.toLowerCase()
      .replace(/[:：\-—\s]/g, '')
      .replace(/[[【(（][^[【(（\]】)）]*[\]】)）]$/, '')
      .trim()

  const s1 = normalize(title1)
  const s2 = normalize(title2)
  // console.log('title1', s1)
  // console.log('title2', s2)

  // simple
  if (s1 === s2) return true
  if (!s1 || !s2) return false

  // substring
  if (s1.includes(s2) || s2.includes(s1)) {
    const minLength = Math.min(s1.length, s2.length)
    if (minLength > 2) return true
  }

  // distance
  const distance = levenshteinDistance(s1, s2)

  const maxLength = Math.max(s1.length, s2.length)
  const similarity = 1 - distance / maxLength

  return similarity >= threshold
}

const levenshteinDistance = (s1: string, s2: string): number => {
  const m = s1.length
  const n = s2.length

  let prevRow: number[] = Array.from({ length: n + 1 }, (_, i) => i)

  for (let i = 1; i <= m; i++) {
    const currRow: number[] = [i]

    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1
      const insert = currRow[j - 1]! + 1
      const del = prevRow[j]! + 1
      const replace = prevRow[j - 1]! + cost

      currRow[j] = Math.min(insert, del, replace)
    }
    prevRow = currRow
  }

  return prevRow[n]!
}
