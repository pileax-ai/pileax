/**
 * Controls
 *
 * @version 1.0
 */

import { Notify } from 'quasar'

// ------------------------------------------------------------
// Notify
// ------------------------------------------------------------
/**
 * Success
 * @see https://quasar.dev/quasar-plugins/notify#positioning
 */
export function notifySuccess (message :string, {
  position = 'top',
  timeout = 1500,
  progress = false,
  defaultAnimation = false} = {}
) {
  Notify.create({
    progress: progress,
    type: 'positive',
    message: message,
    timeout: timeout,
    position: position as 'top',
    classes: defaultAnimation ? '' : `o-animation-${position}`,
  })
}

export function notifyWarning (message :string, {
  position = 'top',
  timeout = 2500,
  progress = false,
  defaultAnimation = false} = {}
) {
  Notify.create({
    progress: progress,
    type: 'warning',
    textColor: 'black',
    message: message,
    timeout: timeout,
    position: position as 'top',
    classes: defaultAnimation ? 'o-notify-warning' : `o-notify-warning o-animation-${position}`,
  })
}

export function notifyInfo(message :string, {
  position = 'top',
  icon = 'info',
  color = 'primary',
  timeout = 1000,
  html = false,
  progress = false,
  defaultAnimation = false} = {}
) {
  Notify.create({
    progress: progress,
    color: color,
    icon: icon,
    html: html,
    message: message,
    timeout: timeout,
    position: position as 'top',
    classes: defaultAnimation ? '' : `o-animation-${position}`,
  })
}

export function notifyError (message :string, {
  position = 'top',
  timeout = 2500,
  progress = false,
  defaultAnimation = false} = {}
) {
  Notify.create({
    progress: progress,
    type: 'negative',
    message: message,
    timeout: timeout,
    position: position as 'top',
    classes: defaultAnimation ? '' : `o-animation-${position}`,
  })
}

export function notifyDone (timeout = 1500) {
  Notify.create({
    type: 'positive',
    color: 'black',
    icon: 'done',
    timeout: timeout,
    position: 'center',
    classes: 'o-notify-done o-animation-center'
  })
}
