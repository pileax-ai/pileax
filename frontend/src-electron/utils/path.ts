
export const joinPath = (...segments: string[]): string => {
  const parts = segments.map((s, i) => {
    if (i === 0) return s.replace(/\/+$/g, '')
    return s.replace(/^\/+|\/+$/g, '')
  })

  let joined = parts.join('/')

  // Keep Windows Driver, such as C:/Program Files
  if (/^[a-zA-Z]:$/.test(parts[0] || '')) {
    joined = parts[0] + '/' + parts.slice(1).join('/')
  }

  return joined
}
