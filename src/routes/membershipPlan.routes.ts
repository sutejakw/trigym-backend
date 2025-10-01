import { Hono } from 'hono'
import {
  createMembershipPlanValidator,
  updateMembershipPlanValidator,
  membershipPlanIdValidator,
  datatableQueryValidator,
} from '@/validations/membershipPlanSchema'
import { membership_plans } from '@/db/schema'
import { db } from '@/db/db'
import { eq, ilike, and, count, asc, desc, or, sql } from 'drizzle-orm'
import { authMiddleware } from '@/middleware/auth'

const app = new Hono()
app.use(authMiddleware)

// GET /membership-plans/datatable - Get membership plans for datatable
app.get('/datatable', datatableQueryValidator, async (c) => {
  const { page, limit, search, sortBy, sortOrder, status } = c.req.valid('query')

  const pageNum = parseInt(page, 10) || 1
  const limitNum = parseInt(limit, 10) || 10
  const offset = (pageNum - 1) * limitNum

  try {
    // Build where conditions
    const conditions = []

    // Search condition
    if (search) {
      const searchTerm = `%${search}%`
      conditions.push(
        or(
          ilike(membership_plans.name, searchTerm),
          ilike(membership_plans.description, searchTerm),
          ilike(membership_plans.features, searchTerm),
          sql`CAST(${membership_plans.price} AS TEXT) ILIKE ${searchTerm}`,
          sql`CAST(${membership_plans.duration_months} AS TEXT) ILIKE ${searchTerm}`
        )
      )
    }

    // Status filter
    if (status && status !== 'all') {
      conditions.push(eq(membership_plans.is_active, status === 'active'))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(membership_plans)
      .where(whereClause)

    const total = totalResult[0]?.count || 0

    // Get data with pagination and sorting
    let orderBy
    switch (sortBy) {
      case 'id':
        orderBy = sortOrder === 'asc' ? asc(membership_plans.id) : desc(membership_plans.id)
        break
      case 'name':
        orderBy = sortOrder === 'asc' ? asc(membership_plans.name) : desc(membership_plans.name)
        break
      case 'price':
        orderBy = sortOrder === 'asc' ? asc(membership_plans.price) : desc(membership_plans.price)
        break
      case 'duration_months':
        orderBy =
          sortOrder === 'asc'
            ? asc(membership_plans.duration_months)
            : desc(membership_plans.duration_months)
        break
      case 'is_active':
        orderBy =
          sortOrder === 'asc' ? asc(membership_plans.is_active) : desc(membership_plans.is_active)
        break
      case 'created_at':
      default:
        orderBy =
          sortOrder === 'asc' ? asc(membership_plans.created_at) : desc(membership_plans.created_at)
        break
    }

    const plans = await db
      .select()
      .from(membership_plans)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limitNum)
      .offset(offset)

    const totalPages = Math.ceil(total / limitNum)

    return c.json({
      success: true,
      data: plans,
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
  } catch (error) {
    return c.json({ error: 'Failed to fetch membership plans' }, 500)
  }
})

// GET /membership-plans/:id - Get membership plan by ID
app.get('/:id', membershipPlanIdValidator, async (c) => {
  const { id } = c.req.param()

  try {
    const plan = await db
      .select()
      .from(membership_plans)
      .where(eq(membership_plans.id, parseInt(id)))
      .then((r) => r[0])

    if (!plan) {
      return c.json({ error: 'Membership plan not found' }, 404)
    }

    return c.json({
      success: true,
      data: plan,
    })
  } catch (error) {
    return c.json({ error: 'Failed to fetch membership plan' }, 500)
  }
})

// POST /membership-plans - Create new membership plan
app.post('/', createMembershipPlanValidator, async (c) => {
  const body = await c.req.json()
  const { name, description, price, duration_months, features, is_active } = body

  try {
    const newPlan = await db
      .insert(membership_plans)
      .values({
        name,
        description,
        price,
        duration_months,
        features,
        is_active,
        updated_at: new Date(),
      })
      .returning()
      .then((r) => r[0])

    return c.json(
      {
        success: true,
        data: newPlan,
        message: 'Membership plan created successfully',
      },
      201
    )
  } catch (error) {
    return c.json({ error: 'Failed to create membership plan' }, 500)
  }
})

// PUT /membership-plans/:id - Update membership plan
app.put('/:id', membershipPlanIdValidator, updateMembershipPlanValidator, async (c) => {
  const { id } = c.req.param()
  const body = await c.req.json()

  try {
    // Check if plan exists
    const existingPlan = await db
      .select()
      .from(membership_plans)
      .where(eq(membership_plans.id, parseInt(id)))
      .then((r) => r[0])

    if (!existingPlan) {
      return c.json({ error: 'Membership plan not found' }, 404)
    }

    const updatedPlan = await db
      .update(membership_plans)
      .set({
        ...body,
        updated_at: new Date(),
      })
      .where(eq(membership_plans.id, parseInt(id)))
      .returning()
      .then((r) => r[0])

    return c.json({
      success: true,
      data: updatedPlan,
      message: 'Membership plan updated successfully',
    })
  } catch (error) {
    return c.json({ error: 'Failed to update membership plan' }, 500)
  }
})

// DELETE /membership-plans/:id - Delete membership plan
app.delete('/:id', membershipPlanIdValidator, async (c) => {
  const { id } = c.req.param()

  try {
    // Check if plan exists
    const existingPlan = await db
      .select()
      .from(membership_plans)
      .where(eq(membership_plans.id, parseInt(id)))
      .then((r) => r[0])

    if (!existingPlan) {
      return c.json({ error: 'Membership plan not found' }, 404)
    }

    await db.delete(membership_plans).where(eq(membership_plans.id, parseInt(id)))

    return c.json({
      success: true,
      message: 'Membership plan deleted successfully',
    })
  } catch (error) {
    return c.json({ error: 'Failed to delete membership plan' }, 500)
  }
})

export default app
