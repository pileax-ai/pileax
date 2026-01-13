import { app, dialog } from 'electron'
import updater from 'electron-updater'
import log from 'electron-log'
import { WindowManager } from './window-manager'

const { autoUpdater } = updater

export class UpdaterManager {
  private autoDownload: boolean = true
  private autoInstallOnAppQuit: boolean = true
  private downloading: boolean = false
  private downloaded: boolean = false
  private updateInfo: any = {}

  constructor(autoDownload = false) {
    this.autoDownload = autoDownload
    autoUpdater.autoDownload = this.autoDownload
    autoUpdater.autoInstallOnAppQuit = this.autoInstallOnAppQuit

    if (process.env.DEV) {
      autoUpdater.forceDevUpdateConfig = true
      // autoUpdater.currentVersion = '0.0.2' // uncomment this line to test
    }

    this.setup()
  }

  setup() {
    autoUpdater.on('checking-for-update', () => {
      log.info('⭐ Checking for update...')
    })

    autoUpdater.on('update-available', info => {
      log.info('✅ Update available:', info)
      this.updateInfo = info
      this.send(info)
    })

    autoUpdater.on('update-not-available', () => {
      log.info('⚠️ No update available')
      this.send({notAvailable: true})
    })

    autoUpdater.on('download-progress', progress => {
      log.info(
        `🫥 Download speed: ${progress.bytesPerSecond},
       Progress: ${progress.percent}%`
      )
      this.downloading = true
      this.send({progress: progress})
    })

    autoUpdater.on('update-downloaded', () => {
      this.downloading = false
      this.downloaded = true
      this.send({downloaded: true})
    })

    autoUpdater.on('error', err => {
      log.error('❌ AutoUpdater Error:', err == null ? 'unknown' : (err.stack || err).toString())
    })
  }

  check() {
    return autoUpdater.checkForUpdates()
  }

  download() {
    if (!this.downloading) {
      autoUpdater.downloadUpdate()
    }
  }

  update(options: Indexable) {
    if (!this.downloaded) return

    dialog
      .showMessageBox({
        type: 'info',
        buttons: [
          options.restart || 'Restart',
          options.later || 'Later'
        ],
        title: options.title || 'Update Ready',
        message: options.message || 'New version downloaded, restart to install?'
      })
      .then(res => {
        if (res.response === 0) {
          autoUpdater.quitAndInstall()
        }
      })
  }

  private send(data: Indexable) {
    WindowManager.getMainWindow()?.webContents.send('updater', data)
  }
}

export const updaterManager = new UpdaterManager()
