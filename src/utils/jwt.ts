import { sign, verify } from 'hono/jwt'

const JWT_SECRET = Bun.env.JWT_SECRET || 'supersecretkey'
const JWT_EXPIRY = 60 * 15 // 15 minutes in seconds

export async function generateJWT(payload: any) {
  const tokenPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + JWT_EXPIRY,
  }
  return await sign(tokenPayload, JWT_SECRET)
}

export function verifyJWT(token: string) {
  return verify(token, JWT_SECRET)
}
