// Modifier keys
export const SHIFT = 'Shift'
export const CTRL = 'Ctrl'
export const ALT = 'Alt'
export const META = 'Meta'

// The Windows key
export const WIN = 'Win'

// The CMD key
export const CMD = 'Cmd'

// Check for macOS
const isMac = navigator.userAgent.includes('Macintosh')

// Determine the primary modifier key
export const PRIMARY = isMac ? CMD : CTRL

/**
 * shortcut
 */
export const getKeys = (event: KeyboardEvent) => {
  const { code, shiftKey, ctrlKey, altKey, metaKey, key } = event
  const keys = []
  if (shiftKey) keys.push(SHIFT)
  if (ctrlKey) keys.push(CTRL)
  if (altKey) keys.push(ALT)
  if (metaKey) keys.push(META)
  if (key && !keys.includes(key)) {
    keys.push(key.toUpperCase())
  }
  return keys.join('+').replaceAll(META, CMD)
}
