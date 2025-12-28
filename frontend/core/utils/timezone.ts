/**
 * TimeZone
 *
 * @author Xman
 * @version 1.0
 */

export const currentTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export const getTimeZones = () => {
  const timeZones = Intl.supportedValuesOf('timeZone')

  return timeZones.map(zone => {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        timeZoneName: 'shortOffset'
      }).formatToParts(new Date())

      const gmtPart = parts.find(p => p.type === 'timeZoneName')?.value || 'GMT+0'
      const gmt = gmtPart.replace('GMT', '')

      return {
        label: zone,
        value: zone,
        gmt: gmt === '' ? '+0:00' : gmt
      } as Indexable
    } catch (e) {
      return { }
    }
  }).filter(Boolean)
}


export const getCurrentTimeZone = () => {
  return getTimeZones().find(item => item?.value === currentTimeZone())
}

