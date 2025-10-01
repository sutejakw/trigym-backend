import { Hono } from 'hono'
import { loginValidator, refreshTokenValidator } from '@/validations/authSchema'
import { refresh_tokens, users } from '@/db/schema'
import { db } from '@/db/db'
import { eq } from 'drizzle-orm'
import { generateJWT } from '@/utils/jwt'
import { respondError, respondSuccess } from '@/utils/response'
import * as crypto from 'crypto'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs')

const app = new Hono()

app.post('/login', loginValidator, async (c) => {
  const body = await c.req.json()
  const { email, password } = body

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .then((r) => r[0])
  if (!user) {
    return respondError(c, 401, 'Invalid email or password')
  }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    return respondError(c, 401, 'Invalid email or password')
  }

  const token = await generateJWT({
    id: user.id,
    email: user.email,
    role: user.role,
  })

  // Delete existing refresh tokens for this user (one token per user strategy)
  await db.delete(refresh_tokens).where(eq(refresh_tokens.user_id, user.id))

  // Create new refresh token
  const refreshToken = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
  await db.insert(refresh_tokens).values({
    user_id: user.id,
    token: refreshToken,
    expires_at: expiresAt,
  })

  return respondSuccess(c, {
    token,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  })
})

app.post('/refresh-token', refreshTokenValidator, async (c) => {
  const body = await c.req.json()
  const { refreshToken } = body

  type TokenRow = {
    id: number
    user_id: number | null
    token: string
    expires_at: Date
    created_at: Date
  }
  const tokenRow: TokenRow | undefined = await db
    .select()
    .from(refresh_tokens)
    .where(eq(refresh_tokens.token, refreshToken))
    .then((r) => r[0])
  if (!tokenRow || tokenRow.expires_at < new Date() || !tokenRow.user_id) {
    return respondError(c, 401, 'Refresh token invalid or expired')
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, tokenRow.user_id as number))
    .then((r) => r[0])
  if (!user) {
    return respondError(c, 404, 'User not found')
  }

  const token = await generateJWT({
    id: user.id,
    email: user.email,
    role: user.role,
  })

  const newRefreshToken = crypto.randomBytes(32).toString('hex')
  const newExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  await db
    .update(refresh_tokens)
    .set({ token: newRefreshToken, expires_at: newExpiresAt })
    .where(eq(refresh_tokens.id, tokenRow.id))

  return respondSuccess(c, {
    token,
    refreshToken: newRefreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  })
})

app.post('/logout', refreshTokenValidator, async (c) => {
  const body = await c.req.json()
  const { refreshToken } = body

  await db.delete(refresh_tokens).where(eq(refresh_tokens.token, refreshToken))

  return respondSuccess(c, null, { message: 'Logged out successfully' })
})

export default app
