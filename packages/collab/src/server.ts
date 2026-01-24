/**
 * https://tiptap.dev/docs/hocuspocus/server/hooks
 */
import { Server } from '@hocuspocus/server'
import { Database } from '@hocuspocus/extension-database'
import { Logger } from '@hocuspocus/extension-logger'
import { createDB } from './database.js'
import { verifyToken } from './auth.js'
import dotenv from 'dotenv'

dotenv.config()

const db = createDB()

const server = new Server({
  name: 'pileax-collab',
  port: Number(process.env.PORT) || 1234,

  extensions: [
    new Database({
      async fetch({ documentName }) {
        return db.fetch(documentName)
      },
      async store({ documentName, state, document }) {
        await db.store(documentName, state, document)
      },
    }),
    new Logger()
  ],

  async onAuthenticate({ token, documentName }) {
    // 前端通过 provider 的 token 字段传入
    const payload = verifyToken(token)
    console.log('onAuthenticate', payload, documentName)
    // 这里可以检查用户是否有权限访问 documentName
    return { user: payload }
  },

  async connected() {
    console.log(`Client connected`)
  },

  async onDisconnect(data) {
    console.log(`Client disconnected: ${data.context.user.name}`)
  },
})

server.listen()
console.log(`Hocuspocus Server running on ws://localhost:${process.env.PORT}`)
