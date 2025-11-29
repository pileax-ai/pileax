import { app, Tray, Menu, BrowserWindow, nativeImage } from 'electron'
import path from 'path';
import fs from 'fs';
import * as electron from 'electron'

const isProduction = process.env.NODE_ENV === 'production';

export class TrayManager {
  private tray?: electron.Tray
  private activateFn: (() => void) | undefined;

  constructor(activate?: () => void) {
    this.tray = undefined;
    this.activateFn = activate
    this.init();
  }

  init() {
    this.creatTray();
  }

  creatTray() {
    const iconPath = this.getTrayIcon();
    console.log("tray icon path:", iconPath, fs.existsSync(iconPath));
    const trayIcon = nativeImage.createFromPath(iconPath);
    this.tray = new Tray(trayIcon.resize({width: 16, height: 16}));
    this.tray.setToolTip('PileaX');
    this.updateTrayMenu();
  }

  getTrayIcon() {
    return isProduction
      ? path.join(process.resourcesPath, 'icons/tray-icon.png')
      : path.join(process.cwd(), 'src-electron/icons/tray-icon.png');
  }

  updateTrayMenu() {
    const menu = Menu.buildFromTemplate([
      {
        label: '打开 PileaX',
        click: () => {
          const win = BrowserWindow.getAllWindows()[0];
          console.log('win', win)
          if (win) {
            if (win.isMinimizable()) {
              win.restore();
            } else {
              win.show();
            }
          } else {
            if (this.activateFn) {
              this.activateFn();
            }
          }
        }
      },
      { type: 'separator' },
      {
        label: '退出',
        click: () => {
          app.quit()
        }
      }
    ])
    this.tray?.setContextMenu(menu);
  }

  destroy() {
    this.tray?.destroy()
  }
}
