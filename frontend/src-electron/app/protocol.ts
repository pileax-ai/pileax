import { protocol, session } from 'electron'
import fs from 'node:fs'
import { lookup } from 'mime-types'
import log from 'electron-log'

import { server } from '../server/fastapi'

import { PROTOCOL_SCHEME, VIRTUAL_HOST } from './constant'
import { joinPath } from '../utils/path'

export const registerSchemes = () => {
  if (process.env.NODE_ENV !== 'production') {
    return
  }

  protocol.registerSchemesAsPrivileged([
    {
      scheme: PROTOCOL_SCHEME,
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        allowServiceWorkers: true,
        corsEnabled: true,
      },
    },
  ])
}

export const registerProtocol = () => {
  if (process.env.NODE_ENV !== 'production') {
    return
  }

  protocol.handle(PROTOCOL_SCHEME, async (request) => {
    const url = new URL(request.url)

    // Restrict interception to virtual domain
    if (url.hostname !== VIRTUAL_HOST) {
      return fetch(request)
    }

    let pathname = url.pathname
    if (pathname === '/') pathname = 'index.html'

    const root = joinPath(process.resourcesPath, 'app.asar')
    const filePath = joinPath(root, pathname)

    try {
      const data = await fs.promises.readFile(filePath)
      const contentType = lookup(filePath)

      return new Response(data, {
        headers: {
          'Content-Type': contentType || 'text/plain',
          'Cache-Control': 'no-cache'
        },
      })
    } catch (err) {
      // SPA fallback
      log.info('❌ Fallback: ', filePath, err)
      const index = await fs.promises.readFile(
        joinPath(root, 'index.html')
      )
      return new Response(index, {
        headers: { 'Content-Type': 'text/html' },
      })
    }
  })
}

export const registerApiHostSession = () => {
  if (process.env.NODE_ENV !== 'production') {
    return
  }

  const filter = { urls: ['https://api.pileax.ai/*'] }

  session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
    const url = new URL(details.url)
    url.hostname = 'localhost'
    url.port = `${server.serverInfo.port}`

    log.info('Redirect', url)

    callback({ redirectURL: url.toString() })
  })
}
