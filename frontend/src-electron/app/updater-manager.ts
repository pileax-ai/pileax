import { app, dialog } from 'electron'
import updater from 'electron-updater'
import log from 'electron-log'
import { WindowManager } from './window-manager'
import { AllPublishOptions, PublishConfiguration } from 'builder-util-runtime'

const { autoUpdater } = updater

const providers: PublishConfiguration[] | AllPublishOptions[] = [
  { provider: 'github', owner: 'pileax-ai', repo: 'pileax', releaseType: 'release' },
  { provider: 'generic', url: 'https://file.pileax.ai/updater/desktop/' }
]

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
      log.info('🔍 Checking for update...')
      this.send('checking')
    })

    autoUpdater.on('update-available', info => {
      log.info('✅ Update available:', info)
      this.updateInfo = info
      this.send('info', info)
    })

    autoUpdater.on('update-not-available', () => {
      log.info('⚠️ No update available')
      this.send('notAvailable')
    })

    autoUpdater.on('download-progress', progress => {
      log.info(
        `🫥 Download speed: ${progress.bytesPerSecond},
       Progress: ${progress.percent}%`
      )
      this.downloading = true
      this.send('progress', progress)
    })

    autoUpdater.on('update-downloaded', () => {
      this.downloading = false
      this.downloaded = true
      this.send('downloaded')
    })

    autoUpdater.on('error', err => {
      log.error('❌ AutoUpdater Error:', err == null ? 'unknown' : (err.stack || err).toString())
    })
  }

  async check() {
    for (const provider of providers) {
      try {
        autoUpdater.setFeedURL(provider)
        const result = await autoUpdater.checkForUpdates()
        log.info('✅ Check success:', provider)
        this.send('provider', (provider as Indexable).provider)
        return result
      } catch (err) {
        log.error('❌ Check Error:', provider)
      }
    }
    return {}
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

  private send(event: string, data?: any) {
    WindowManager.getMainWindow()?.webContents.send('updater', event, data)
  }
}

export const updaterManager = new UpdaterManager(true)
