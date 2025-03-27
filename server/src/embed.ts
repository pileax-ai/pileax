/**
 * Embedded in Electron/Tauri
 */
import express from 'express'
import { AddressInfo } from 'net'
import getPort from 'get-port'
import cors from 'cors'
import { registerApi } from '@/api'
import { apiBase, apiRouter } from "@/common/router";
import type { ServerInfo } from '@/types/types';

export class ServerManager {
  private app = express()
  private server?: ReturnType<express.Express['listen']>
  public port?: number

  constructor() {
    this.setupMiddleware()
    this.setupRoutes()
  }

  private setupMiddleware() {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }));

    // Allowed in Electron or local
    const corsOptions = {
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || origin.startsWith('file://') || origin.startsWith('http://localhost:')) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true
    }
    this.app.use(cors(corsOptions));
  }

  private setupRoutes() {
    this.app.use(apiBase, apiRouter);
    registerApi();
  }

  public async start() {
    try {
      const port = await getPort({ port: 3000 })
      const hostname = 'localhost';
      this.server = this.app.listen(port, hostname, () => {
        this.port = (this.server?.address() as AddressInfo)?.port
        console.log(`Server running on port ${this.port}`)
      })
      return {
        port,
        hostname,
        baseURL: `http://${hostname}:${port}${apiBase}`,
      } as ServerInfo;
    } catch (error) {
      console.error('Failed to start server:', error)
      throw error
    }
  }

  public stop() {
    return new Promise<void>((resolve, reject) => {
      if (!this.server) return resolve()

      this.server.close(err => {
        err ? reject(err) : resolve()
      })
    })
  }
}

if (import.meta.url === process.argv[1]) {
  const server = new ServerManager()
  server.start().then(res => {
    console.info(`Server starts in standalone mode: ${res}`)
  }).catch(err => {
    console.error('❌ Failed to start server:', err)
    process.exit(1)
  })
}
