import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export function verifyToken(token?: string) {
  if (!token) throw new Error('No token provided')
  if (token.startsWith('Bearer ')) {
    token = token.replace('Bearer ', '')
  }
  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY!)
    return {
      user: {
        id: payload.sub
      }
    }
  } catch (e) {
    console.error(e, token)
    throw new Error('Invalid token')
  }
}
