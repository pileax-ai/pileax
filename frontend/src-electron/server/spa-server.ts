import log from 'electron-log'
import getPort from 'get-port'

import http, { IncomingMessage, Server, ServerResponse } from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { lookup } from 'mime-types'

export class SpaServer {
  private server: Server | null = null
  private port: number

  constructor() {
    this.server = null
    this.port = 3000
  }

  async start(): Promise<number> {
    this.port = await getPort({ port: 3000 })
    this.server = http.createServer(this.handleRequest)

    return new Promise<number>((resolve, reject) => {
      this.server!.once('error', reject)
      this.server!.listen(this.port, 'localhost', () => {
        const addr = this.server!.address()
        if (typeof addr === 'object' && addr) {
          this.port = addr.port
        }
        log.info('✅ SPA server started')
        resolve(this.port)
      })
    })
  }

  async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          log.info('⏹️ SPA server stopped')
          resolve()
        })
      } else {
        resolve()
      }
    })
  }

  get serverInfo(): Indexable {
    if (!this.server) {
      throw new Error('❌ SPA Server is not started')
    }
    return {
      port: this.port,
      url: `http://localhost:${this.port}`
    }
  }

  private handleRequest = (req: IncomingMessage, res: ServerResponse) => {
    if (!req.url) {
      res.writeHead(400)
      res.end()
      return
    }

    const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    const safePath = urlPath === '/' ? `/index.html` : urlPath

    const root = path.join(process.resourcesPath, 'app.asar')
    const filePath = path.join(root, safePath)

    fs.readFile(filePath, (err, data) => {
      if (err) {
        // SPA fallback
        fs.readFile(path.join(root, 'index.html'), (e, index) => {
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.end(index)
        })
        return
      }

      res.writeHead(200, {
        'Content-Type': lookup(filePath) || 'application/octet-stream',
        'Cache-Control': 'no-cache',
      })
      res.end(data)
    })
  }
}

export const spaServer = new SpaServer()
