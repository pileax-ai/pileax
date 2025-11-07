/**
 * Controls
 *
 * @version 1.0
 */

import { Notify } from 'quasar'

// ------------------------------------------------------------
// Notify
// ------------------------------------------------------------
export function notifySuccess (message :string, {
  position = 'top',
  timeout = 1500,
  progress = false} = {}
) {
  Notify.create({
    progress: progress,
    color: 'green',
    icon: 'check_circle',
    message: message,
    timeout: timeout,
    position: position as 'top'
  })
}

export function notifyWarning (message :string, {
  position = 'top',
  timeout = 2500,
  progress = false} = {}
) {
  Notify.create({
    progress: progress,
    color: 'red',
    icon: 'info',
    message: message,
    timeout: timeout,
    position: position as 'top'
  })
}

export function notifyInfo (message :string, {
  position = 'top',
  icon = 'info',
  color = 'primary',
  timeout = 1000,
  html = false,
  progress = false} = {}
) {
  Notify.create({
    progress: progress,
    color: color,
    icon: icon,
    html: html,
    message: message,
    timeout: timeout,
    position: position as 'top'
  })
}

export function notifyError (message :string, {
  position = 'top',
  timeout = 2500,
  progress = false} = {}
) {
  Notify.create({
    progress: progress,
    color: 'red',
    icon: 'warning',
    message: message,
    timeout: timeout,
    position: position as 'top'
  })
}

export function notifyDone (timeout = 1500) {
  Notify.create({
    type: 'positive',
    color: 'black',
    icon: 'done',
    timeout: timeout,
    // timeout: 100000,
    position: 'center',
    classes: 'o-notify-done'
  })
}

export function notifyIfDev (message :string, {
  position = 'top',
  timeout = 2500,
  progress = false} = {}
) {
  if (process.env.DEV) {
    Notify.create({
      progress: progress,
      color: 'light-blue',
      icon: 'info',
      message: message,
      timeout: timeout,
      position: position as 'top'
    })
  }
}
