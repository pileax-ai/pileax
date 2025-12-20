import log from 'electron-log'
import express, { Express } from 'express'
import path from 'path'
import getPort from 'get-port'

export class ExpressServer {
  private app: Express
  private server: any
  private port: number

  constructor() {
    this.app = express()
    this.server = null
    this.port = 3000
  }

  async start(): Promise<number> {
    this.port = await getPort({ port: 3000 })
    return new Promise((resolve, reject) => {
      try {
        const staticPath = path.join(process.resourcesPath, 'app')
        log.info(`Express server static path: ${staticPath}`)

        this.app.use(express.static(staticPath))
        this.app.get(/^\/.*$/, (req, res) => {
          res.sendFile(path.join(staticPath, 'index.html'))
        })

        this.server = this.app.listen(this.port, () => {
          log.info(`Express server running at http://localhost:${this.port}`)
          resolve(this.port)
        })

        this.server.on('error', (err: any) => {
          reject(err)
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          console.log('Express server stopped')
          resolve()
        })
      } else {
        resolve()
      }
    })
  }

  getUrl(): string {
    return `http://localhost:${this.port}`
  }
}
