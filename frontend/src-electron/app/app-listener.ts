import { app } from 'electron'
import log from 'electron-log'
import { openFileManager } from './open-file-manager'

// ----------------------------------------------------------------------
// File associations
// ----------------------------------------------------------------------
app.on('ready', (event, path) => {
  openFileManager.onOpenFile(process.argv, 'ready')
})

app.on('second-instance', (event, commandLine) => {
  openFileManager.onOpenFile(commandLine, 'second-instance')
})

app.on('open-file', (event, filePath) => {
  event.preventDefault()
  openFileManager.sendFile(filePath, 'open-file')
})

// ----------------------------------------------------------------------
// Exports
// ----------------------------------------------------------------------
export const initAppListener = () => {
  log.info('Init App Listeners')
}


