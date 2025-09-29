import { eq } from 'drizzle-orm'
import { users, refresh_tokens } from '@/../drizzle/schema'
import { generateJWT } from '@/utils/jwt'
import { db } from '@/db'
import { loginSchema, refreshTokenSchema } from '@/validations/authSchema'
import * as crypto from 'crypto'
import { Context } from 'hono'

import { parseAndValidate } from '@/utils/validation'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs')

export async function loginService(c: Context) {
  const { data, error, status } = await parseAndValidate(c, loginSchema)
  if (error)
    return new Response(JSON.stringify(error), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  const { email, password } = data

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .then((r) => r[0])
  if (!user) {
    return c.json({ error: 'Invalid email or password' }, 401)
  }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    return c.json({ error: 'Invalid email or password' }, 401)
  }

  const token = await generateJWT({
    id: user.id,
    email: user.email,
    role: user.role,
  })

  const refreshToken = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  await db.insert(refresh_tokens).values({
    user_id: user.id,
    token: refreshToken,
    expires_at: expiresAt,
  })

  return c.json({
    token,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  })
}

export async function refreshService(c: Context) {
  const { data, error, status } = await parseAndValidate(c, refreshTokenSchema)
  if (error)
    return new Response(JSON.stringify(error), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  const { refreshToken } = data

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
    return c.json({ error: 'Refresh token invalid or expired' }, 401)
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, tokenRow.user_id as number))
    .then((r) => r[0])
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
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

  return c.json({
    token,
    refreshToken: newRefreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  })
}

export async function logoutService(c: Context) {
  const { data, error, status } = await parseAndValidate(c, refreshTokenSchema)
  if (error)
    return new Response(JSON.stringify(error), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  const { refreshToken } = data

  await db.delete(refresh_tokens).where(eq(refresh_tokens.token, refreshToken))

  return c.json({ success: true })
}
