import { sign, verify } from 'hono/jwt'

const secret = Bun.env.JWT_SECRET || 'supersecretkey'

export function generateJWT(payload: object) {
  return sign(payload as Record<string, any>, secret)
}

export function verifyJWT(token: string) {
  return verify(token, secret)
}
