/**
 * URL
 *
 * @author Xman
 * @version 1.0
 */
import { StandardColors } from 'core/constants/metadata'

// ================================================================================
// Common API
// ================================================================================
export const getHostname = (url: string) => {
  try {
    const { hostname } = new URL(url)
    return hostname
  } catch {
    return url
  }
}

export const getRootDomain = (url: string) => {
  const hostname = getHostname(url)
  const parts = hostname.split('.')

  if (parts.length <= 2) {
    return hostname
  }

  // Take the last two parts: e.g., 'yistars.cc'
  return parts.slice(-2).join('.')
}
