import { Hono } from 'hono'
import { db } from '@/db/db'
import { trainers } from '@/db/schema'
import {
  createTrainerValidator,
  updateTrainerValidator,
  trainerIdValidator,
} from '@/validations/trainerSchema'
import { eq, asc, desc } from 'drizzle-orm'
import { authMiddleware } from '@/middleware/auth'
import { respondError, respondSuccess } from '@/utils/response'

const app = new Hono()
app.use(authMiddleware)

// GET /trainers
app.get('/', async (c) => {
  try {
    const rows = await db.select().from(trainers)
    return respondSuccess(c, rows)
  } catch (err) {
    return respondError(c, 500, 'Failed to fetch trainers')
  }
})

// GET /trainers/:id
app.get('/:id', trainerIdValidator, async (c) => {
  const { id } = c.req.param()
  try {
    const row = await db
      .select()
      .from(trainers)
      .where(eq(trainers.id, parseInt(id)))
      .then((r) => r[0])

    if (!row) return respondError(c, 404, 'Trainer not found')

    return respondSuccess(c, row)
  } catch (err) {
    return respondError(c, 500, 'Failed to fetch trainer')
  }
})

// POST /trainers
app.post('/', createTrainerValidator, async (c) => {
  const body = await c.req.json()
  try {
    const newRow = await db
      .insert(trainers)
      .values({
        ...body,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning()
      .then((r) => r[0])

    return respondSuccess(c, newRow, { message: 'Trainer created successfully' }, 201)
  } catch (err) {
    return respondError(c, 500, 'Failed to create trainer')
  }
})

// PUT /trainers/:id
app.put('/:id', trainerIdValidator, updateTrainerValidator, async (c) => {
  const { id } = c.req.param()
  const body = await c.req.json()
  try {
    const existing = await db
      .select()
      .from(trainers)
      .where(eq(trainers.id, parseInt(id)))
      .then((r) => r[0])

    if (!existing) return respondError(c, 404, 'Trainer not found')

    const updated = await db
      .update(trainers)
      .set({
        ...body,
        updated_at: new Date(),
      })
      .where(eq(trainers.id, parseInt(id)))
      .returning()
      .then((r) => r[0])

    return respondSuccess(c, updated, { message: 'Trainer updated successfully' })
  } catch (err) {
    return respondError(c, 500, 'Failed to update trainer')
  }
})

// DELETE /trainers/:id
app.delete('/:id', trainerIdValidator, async (c) => {
  const { id } = c.req.param()
  try {
    const existing = await db
      .select()
      .from(trainers)
      .where(eq(trainers.id, parseInt(id)))
      .then((r) => r[0])

    if (!existing) return respondError(c, 404, 'Trainer not found')

    await db.delete(trainers).where(eq(trainers.id, parseInt(id)))
    return respondSuccess(c, null, { message: 'Trainer deleted successfully' })
  } catch (err) {
    return respondError(c, 500, 'Failed to delete trainer')
  }
})

export default app
