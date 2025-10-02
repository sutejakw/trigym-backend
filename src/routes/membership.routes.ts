import { Hono } from 'hono'
import { db } from '@/db/db'
import { memberships, membership_plans } from '@/db/schema'
import {
  createMembershipValidator,
  updateMembershipValidator,
  membershipIdValidator,
  membershipDatatableQueryValidator,
} from '@/validations/membershipSchema'
import { eq, and, ilike, or, count, asc, desc, sql } from 'drizzle-orm'
import { authMiddleware } from '@/middleware/auth'
import { respondError, respondSuccess } from '@/utils/response'

const app = new Hono()
app.use(authMiddleware)

// Helper to parse YYYY-MM-DD to Date
const parseDate = (value?: string) => (value ? new Date(value + 'T00:00:00.000Z') : undefined)

// GET /memberships/datatable
app.get('/datatable', membershipDatatableQueryValidator, async (c) => {
  const { page, limit, search, sortBy, sortOrder, status } = c.req.valid('query')

  const pageNum = parseInt(page, 10) || 1
  const limitNum = parseInt(limit, 10) || 10
  const offset = (pageNum - 1) * limitNum

  try {
    const conditions: any[] = []

    if (search) {
      const searchTerm = `%${search}%`
      conditions.push(
        or(
          sql`CAST(${memberships.user_id} AS TEXT) ILIKE ${searchTerm}`,
          sql`CAST(${memberships.membership_plan_id} AS TEXT) ILIKE ${searchTerm}`,
          ilike(memberships.status, searchTerm)
        )
      )
    }

    if (status && status !== 'all') {
      conditions.push(eq(memberships.status, status))
    }

    const whereClause = conditions.length ? and(...conditions) : undefined

    const totalResult = await db.select({ count: count() }).from(memberships).where(whereClause)
    const total = totalResult[0]?.count || 0

    let orderBy
    switch (sortBy) {
      case 'id':
        orderBy = sortOrder === 'asc' ? asc(memberships.id) : desc(memberships.id)
        break
      case 'user_id':
        orderBy = sortOrder === 'asc' ? asc(memberships.user_id) : desc(memberships.user_id)
        break
      case 'membership_plan_id':
        orderBy =
          sortOrder === 'asc'
            ? asc(memberships.membership_plan_id)
            : desc(memberships.membership_plan_id)
        break
      case 'start_date':
        orderBy = sortOrder === 'asc' ? asc(memberships.start_date) : desc(memberships.start_date)
        break
      case 'end_date':
        orderBy = sortOrder === 'asc' ? asc(memberships.end_date) : desc(memberships.end_date)
        break
      case 'status':
        orderBy = sortOrder === 'asc' ? asc(memberships.status) : desc(memberships.status)
        break
      case 'created_at':
      default:
        orderBy = sortOrder === 'asc' ? asc(memberships.created_at) : desc(memberships.created_at)
        break
    }

    const rows = await db
      .select()
      .from(memberships)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limitNum)
      .offset(offset)

    const totalPages = Math.ceil(total / limitNum)

    return respondSuccess(c, {
      items: rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
      filters: {
        search: search || '',
        sortBy,
        sortOrder,
        status,
      },
    })
  } catch (err) {
    return respondError(c, 500, 'Failed to fetch memberships')
  }
})

// GET /memberships
app.get('/', async (c) => {
  try {
    const rows = await db.select().from(memberships)
    return respondSuccess(c, rows)
  } catch (err) {
    return respondError(c, 500, 'Failed to fetch memberships')
  }
})

// GET /memberships/:id
app.get('/:id', membershipIdValidator, async (c) => {
  const { id } = c.req.param()
  try {
    const row = await db
      .select()
      .from(memberships)
      .where(eq(memberships.id, parseInt(id)))
      .then((r) => r[0])

    if (!row) return respondError(c, 404, 'Membership not found')

    return respondSuccess(c, row)
  } catch (err) {
    return respondError(c, 500, 'Failed to fetch membership')
  }
})

// POST /memberships
app.post('/', createMembershipValidator, async (c) => {
  const body = await c.req.json()
  const { user_id, membership_plan_id, start_date, end_date, status } = body

  try {
    // Fetch plan to calculate end_date if needed
    const plan = await db
      .select()
      .from(membership_plans)
      .where(eq(membership_plans.id, membership_plan_id))
      .then((r) => r[0])

    if (!plan) return respondError(c, 400, 'Invalid membership_plan_id')

    let startDate = parseDate(start_date) || new Date()
    let endDate = parseDate(end_date)

    if (!endDate && plan.duration_months) {
      const tmp = new Date(startDate)
      tmp.setMonth(tmp.getMonth() + (plan.duration_months as number))
      endDate = tmp
    }

    const isActive = status || 'pending'

    const newRow = await db
      .insert(memberships)
      .values({
        user_id,
        membership_plan_id,
        start_date: startDate as any,
        end_date: endDate as any,
        status: isActive,
        updated_at: new Date(),
      })
      .returning()
      .then((r) => r[0])

    return respondSuccess(c, newRow, { message: 'Membership created successfully' }, 201)
  } catch (err) {
    return respondError(c, 500, 'Failed to create membership')
  }
})

// PUT /memberships/:id
app.put('/:id', membershipIdValidator, updateMembershipValidator, async (c) => {
  const { id } = c.req.param()
  const body = await c.req.json()

  try {
    const existing = await db
      .select()
      .from(memberships)
      .where(eq(memberships.id, parseInt(id)))
      .then((r) => r[0])

    if (!existing) return respondError(c, 404, 'Membership not found')

    let updatedValues: any = { ...body }

    if (body.start_date) updatedValues.start_date = parseDate(body.start_date)
    if (body.end_date) updatedValues.end_date = parseDate(body.end_date)

    // If membership_plan_id updated and no explicit end_date provided, maybe recalc end_date
    if (body.membership_plan_id && !body.end_date) {
      const plan = await db
        .select()
        .from(membership_plans)
        .where(eq(membership_plans.id, body.membership_plan_id))
        .then((r) => r[0])
      if (plan && plan.duration_months && (existing.start_date || body.start_date)) {
        const baseStart = body.start_date
          ? parseDate(body.start_date)!
          : existing.start_date
            ? new Date(existing.start_date as any as string | Date)
            : new Date()
        const tmp = new Date(baseStart)
        tmp.setMonth(tmp.getMonth() + (plan.duration_months as number))
        updatedValues.end_date = tmp
      }
    }

    const updated = await db
      .update(memberships)
      .set({
        ...updatedValues,
        updated_at: new Date(),
      })
      .where(eq(memberships.id, parseInt(id)))
      .returning()
      .then((r) => r[0])

    return respondSuccess(c, updated, { message: 'Membership updated successfully' })
  } catch (err) {
    return respondError(c, 500, 'Failed to update membership')
  }
})

// DELETE /memberships/:id
app.delete('/:id', membershipIdValidator, async (c) => {
  const { id } = c.req.param()
  try {
    const existing = await db
      .select()
      .from(memberships)
      .where(eq(memberships.id, parseInt(id)))
      .then((r) => r[0])

    if (!existing) return respondError(c, 404, 'Membership not found')

    await db.delete(memberships).where(eq(memberships.id, parseInt(id)))
    return respondSuccess(c, null, { message: 'Membership deleted successfully' })
  } catch (err) {
    return respondError(c, 500, 'Failed to delete membership')
  }
})

export default app
