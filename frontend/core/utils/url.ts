/**
 * URL
 *
 * @author Xman
 * @version 1.0
 */

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

export const createEmojiFavicon = (emoji: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <text y=".9em" font-size="90">${emoji}</text>
    </svg>
  `
  return 'data:image/svg+xml,' + encodeURIComponent(svg)
}
