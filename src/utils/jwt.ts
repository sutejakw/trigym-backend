import { config } from '@/config/config'
import { sign, verify } from 'hono/jwt'

export async function generateJWT(payload: any, expiryInSeconds?: number) {
  const expiry = expiryInSeconds || config.jwt.expirySeconds
  const tokenPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiry,
  }
  return await sign(tokenPayload, config.jwt.secret)
}

export async function verifyJWT(token: string) {
  try {
    const payload = await verify(token, config.jwt.secret)
    return payload
  } catch (error) {
    return null
  }
}
