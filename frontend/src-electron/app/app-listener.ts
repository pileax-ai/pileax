import { app } from 'electron'
import log from 'electron-log'
import { openFileManager } from './open-file-manager'

// ----------------------------------------------------------------------
// File associations
// ----------------------------------------------------------------------
const initFileAssociationListeners = () => {

  app.on('ready', (event, path) => {
    openFileManager.onOpenFile(process.argv, 'ready')
  })

  // app.on('second-instance', (event, commandLine) => {
  //   openFileManager.onOpenFile(commandLine, 'second-instance')
  // })

  app.on('open-file', (event, filePath) => {
    event.preventDefault()
    openFileManager.sendFile(filePath, 'open-file')
  })
}

const initWebContentListeners = () => {
  app.on('web-contents-created', (event, contents) => {
    contents.on('render-process-gone', (event, details) => {
      log.error(`Render Process: ${details.reason}, exitCode: ${details.exitCode}`)
    })
  })
}

// ----------------------------------------------------------------------
// Exports
// ----------------------------------------------------------------------
export const initAppListener = () => {
  log.info('Init App Listeners')

  initFileAssociationListeners()
  initWebContentListeners()
}


