import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

type MetaPayload = Record<string, unknown>

type SuccessMeta = {
  success: true
  status: number
  timestamp: string
} & MetaPayload

type ErrorMeta = {
  success: false
  status: number
  error: string
  timestamp: string
} & MetaPayload

export const respondSuccess = <T>(
  c: Context,
  data: T,
  meta: MetaPayload = {},
  status: ContentfulStatusCode = 200
) => {
  const payload = {
    meta: {
      success: true,
      status,
      timestamp: new Date().toISOString(),
      ...meta,
    } satisfies SuccessMeta,
    data,
  }

  return c.json(payload, status)
}

export const respondError = (
  c: Context,
  status: ContentfulStatusCode,
  error: string,
  meta: MetaPayload = {}
) => {
  const payload = {
    meta: {
      success: false,
      status,
      error,
      timestamp: new Date().toISOString(),
      ...meta,
    } satisfies ErrorMeta,
    data: null,
  }

  return c.json(payload, status)
}
