import { app, Tray, Menu, BrowserWindow, nativeImage } from 'electron'
import path from 'path'
import fs from 'fs'
import type * as electron from 'electron'
import os from 'os'

const platform = process.platform || os.platform()
const isProduction = process.env.NODE_ENV === 'production'

export class TrayManager {
  private tray?: electron.Tray
  private activateFn: (() => void) | undefined

  constructor(activate?: () => void) {
    this.tray = undefined
    this.activateFn = activate
    this.init()
  }

  init() {
    this.creatTray()
  }

  creatTray() {
    const iconPath = this.getTrayIcon()
    console.log("tray icon path:", iconPath, fs.existsSync(iconPath))
    const trayIcon = nativeImage.createFromPath(iconPath)
    this.tray = new Tray(trayIcon.resize({width: 16, height: 16}))
    this.tray.setToolTip('PileaX')
    this.updateTrayMenu()
  }

  getTrayIcon() {
    const iconName = platform === 'win32' ? 'icon' : 'tray-icon'
    return isProduction
      ? path.join(process.resourcesPath, `icons/${iconName}.png`)
      : path.join(process.cwd(), `src-electron/icons/${iconName}.png`)
  }

  updateTrayMenu(labels: Indexable = {
    openApp: '打开 PileaX',
    quit: '退出',
  }) {
    const menu = Menu.buildFromTemplate([
      {
        label: labels.openApp,
        click: () => {
          const win = BrowserWindow.getAllWindows()[0]
          if (win) {
            if (win.isMinimizable()) {
              win.restore()
            } else {
              win.show()
            }
          } else {
            if (this.activateFn) {
              this.activateFn()
            }
          }
        }
      },
      { type: 'separator' },
      {
        label: labels.quit,
        click: () => {
          app.quit()
        }
      }
    ])
    this.tray?.setContextMenu(menu)
  }

  destroy() {
    this.tray?.destroy()
  }
}
