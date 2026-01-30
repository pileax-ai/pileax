import { Pool } from 'pg'
import DatabaseDriver from 'better-sqlite3'
import dotenv from 'dotenv'
import * as Y from 'yjs'

dotenv.config()

export type DB = {
  fetch: (documentName: string) => Promise<Buffer | null>
  store: (documentName: string, state: Buffer, document: Y.Doc) => Promise<void>
}

export function createDB(): DB {
  const dbType = process.env.DB_PROVIDER || 'sqlite'

  const getMetadata = (document: Y.Doc) => {
    const metaMap = document.getMap('metadata')
    return {
      title: metaMap.get('title') || 'New Page',
      icon: metaMap.get('icon') || null,
      cover: metaMap.get('cover') || null
    }
  }

  if (dbType === 'postgresql') {
    const database = process.env.DB_DATABASE
    const user = process.env.DB_USERNAME
    const password = process.env.DB_PASSWORD
    const host = process.env.DB_HOST
    const port = process.env.DB_PORT

    const url = `postgres://${user}:${password}@${host}:${port}/${database}`
    const pool = new Pool({ connectionString: url })

    return {
      fetch: async (documentName) => {
        const id = documentName.replaceAll('note@', '')
        const { rows } = await pool.query(
          'SELECT doc FROM note WHERE id = $1',
          [id],
        )
        return rows[0]?.doc ?? null
      },
      store: async (documentName, state, document) => {
        const id = documentName.replaceAll('note@', '')
        const { title, icon, cover } = getMetadata(document)
        pool.query(
          `
          UPDATE note
          SET doc=$1, title=$2, icon=$3, cover=$4, update_time=NOW()
          WHERE id=$5
          `,
          [state, title, icon, cover, id],
        )
      },
    }
  } else {
    const sqliteFile = process.env.DB_DATABASE
    const db = new DatabaseDriver(sqliteFile)

    return {
      fetch: async (documentName) => {
        const id = documentName.replaceAll('note@', '')
        const row = db.prepare('SELECT doc FROM note WHERE id = ?').get(id)
        // @ts-ignore
        return row ? row.doc : null
      },
      store: async (documentName, state, document) => {
        const id = documentName.replaceAll('note@', '')
        const { title, icon, cover } = getMetadata(document)
        db.prepare(`
          UPDATE note
          SET doc=?, title=?, icon=?, cover=?, update_time = CURRENT_TIMESTAMP
          WHERE id=?
        `).run(state, title, icon, cover, id)
      },
    }
  }
}

