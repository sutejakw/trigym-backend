import 'dotenv/config'
import { db } from '@/db/db'
import { memberships, users, membership_plans } from '@/db/schema'
import { eq } from 'drizzle-orm'

/*
  Membership Seeder
  ------------------
  Generates membership rows for existing users & membership plans.
  Strategy:
    - Fetch all users (skip if none)
    - Fetch all membership plans (skip if none)
    - For first N users (configurable), create varied memberships:
        * active: start in past within duration
        * expired: start long enough ago that end_date < now
        * pending: start today with future end_date (status pending)
    - Avoid duplicating if a membership with same user+plan+status already exists (simple check)
*/

interface PlanMapItem {
  id: number
  duration_months: number | null
}

function addMonths(date: Date, months: number) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

export async function seedMemberships() {
  const allUsers = await db.select().from(users)
  if (allUsers.length === 0) {
    console.log('No users found. Run base seed first.')
    return
  }

  const plans = await db.select().from(membership_plans)
  if (plans.length === 0) {
    console.log('No membership plans found. Run base seed first.')
    return
  }

  const planPrimary = plans[0]
  const planSecondary = plans[1] || plans[0]
  const planLong = plans.find((p) => (p.duration_months || 0) >= 6) || plans[plans.length - 1]

  const now = new Date()
  let created = 0

  for (const u of allUsers.slice(0, 10)) {
    // Active membership (started within its duration window)
    const activeStart = new Date(now)
    activeStart.setMonth(activeStart.getMonth() - 1)
    const activeEnd = planPrimary.duration_months
      ? addMonths(activeStart, planPrimary.duration_months)
      : addMonths(activeStart, 1)

    // Expired membership (ended before now)
    const expiredStart = new Date(now)
    expiredStart.setMonth(expiredStart.getMonth() - 8)
    const expiredEnd = planLong.duration_months
      ? addMonths(expiredStart, planLong.duration_months)
      : addMonths(expiredStart, 3)

    // Pending membership (starts now, future end)
    const pendingStart = new Date(now)
    const pendingEnd = planSecondary.duration_months
      ? addMonths(pendingStart, planSecondary.duration_months)
      : addMonths(pendingStart, 1)

    // Insert three rows per user if not already present (simple existence check by status + plan)
    const existing = await db.select().from(memberships).where(eq(memberships.user_id, u.id))

    const want: Array<{
      membership_plan_id: number
      start_date: Date
      end_date: Date
      status: string
    }> = [
      {
        membership_plan_id: planPrimary.id,
        start_date: activeStart,
        end_date: activeEnd,
        status: 'active',
      },
      {
        membership_plan_id: planLong.id,
        start_date: expiredStart,
        end_date: expiredEnd,
        status: 'expired',
      },
      {
        membership_plan_id: planSecondary.id,
        start_date: pendingStart,
        end_date: pendingEnd,
        status: 'pending',
      },
    ]

    for (const row of want) {
      const dup = existing.find(
        (e) =>
          e.membership_plan_id === row.membership_plan_id &&
          e.status === row.status &&
          new Date(e.start_date as any).toDateString() === row.start_date.toDateString()
      )
      if (dup) continue

      await db.insert(memberships).values({
        user_id: u.id,
        membership_plan_id: row.membership_plan_id,
        start_date: row.start_date as any,
        end_date: row.end_date as any,
        status: row.status,
        updated_at: new Date(),
      })
      created++
    }
  }

  console.log(`Membership seeding completed. Created ${created} rows.`)
}

if (require.main === module) {
  seedMemberships()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error('Membership seed failed', e)
      process.exit(1)
    })
}
