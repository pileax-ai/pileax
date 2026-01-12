import { app, dialog } from 'electron'
import updater from 'electron-updater'
import log from 'electron-log'

const { autoUpdater } = updater

export class UpdaterManager {
  private autoDownload: boolean = true
  private autoInstallOnAppQuit: boolean = true

  constructor(autoDownload = true) {
    this.autoDownload = autoDownload
    autoUpdater.autoDownload = this.autoDownload
    autoUpdater.autoInstallOnAppQuit = this.autoInstallOnAppQuit

    this.setup()
  }

  setup() {
    if (!app.isPackaged) return

    autoUpdater.on('checking-for-update', () => {
      log.info('⭐ Checking for update...')
    })

    autoUpdater.on('update-available', info => {
      log.info('✅ Update available:', info)
    })

    autoUpdater.on('update-not-available', () => {
      log.info('⚠️ No update available')
    })

    autoUpdater.on('download-progress', progress => {
      log.info(
        `🫥 Download speed: ${progress.bytesPerSecond},
       Progress: ${progress.percent}%`
      )
    })

    autoUpdater.on('update-downloaded', () => {
      dialog
        .showMessageBox({
          type: 'info',
          buttons: ['Restart', 'Later'],
          title: 'Update Ready',
          message: 'Update downloaded, restart to install?'
        })
        .then(res => {
          if (res.response === 0) {
            autoUpdater.quitAndInstall()
          }
        })
    })

    autoUpdater.on('error', err => {
      log.error('❌ AutoUpdater Error:', err == null ? 'unknown' : (err.stack || err).toString())
    })
  }

  check() {
    return autoUpdater.checkForUpdates()
  }

}

export const updaterManager = new UpdaterManager()
