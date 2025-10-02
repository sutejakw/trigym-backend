import { db } from '@/db/db'
import { users, membership_plans } from '@/db/schema'
import bcrypt from 'bcryptjs'

export async function seedBase() {
  console.log('[seedBase] Seeding users & membership plans...')
  // Check if admin already exists to make idempotent
  const existingAdmin = await db
    .select()
    .from(users)
    .where((users.email as any).eq ? (users.email as any).eq('admin@example.com') : undefined)
    .catch(() => [])

  if (!existingAdmin || existingAdmin.length === 0) {
    await db.insert(users).values({
      name: 'Admin',
      email: 'admin@example.com',
      password_hash: await bcrypt.hash('password', 10),
      phone: '1234567890',
      gender: 'Male',
      date_of_birth: new Date('2025-05-01').toDateString(),
      role: 'admin',
    })
    console.log('[seedBase] Admin user inserted')
  } else {
    console.log('[seedBase] Admin user already exists, skipping')
  }

  const planCount = await db
    .select({ count: membership_plans.id as any })
    .from(membership_plans)
    .catch(() => [])

  if (!planCount || (planCount[0] as any)?.count === 0) {
    await db.insert(membership_plans).values([
      {
        name: 'Basic Plan',
        description: 'Perfect for beginners who want to start their fitness journey',
        price: '299000',
        duration_months: 1,
        features: 'Access to gym equipment, Basic workout plan, Locker access',
        is_active: true,
      },
      {
        name: 'Premium Plan',
        description: 'Ideal for regular gym-goers who want more features',
        price: '799000',
        duration_months: 3,
        features: 'All Basic features, Group classes, Nutrition consultation, Free towel service',
        is_active: true,
      },
      {
        name: 'VIP Plan',
        description: 'Ultimate fitness experience with all premium features',
        price: '1499000',
        duration_months: 6,
        features:
          'All Premium features, Personal trainer sessions, Priority booking, VIP lounge access, Free supplements',
        is_active: true,
      },
      {
        name: 'Annual Plan',
        description: 'Best value for committed fitness enthusiasts',
        price: '2499000',
        duration_months: 12,
        features:
          'All VIP features, Guest passes, Priority customer support, Annual health check-up',
        is_active: true,
      },
      {
        name: 'Student Plan',
        description: 'Special discounted plan for students',
        price: '199000',
        duration_months: 1,
        features: 'Access to gym equipment, Basic workout plan, Student ID required',
        is_active: true,
      },
    ])
    console.log('[seedBase] Membership plans inserted')
  } else {
    console.log('[seedBase] Membership plans already exist, skipping')
  }

  console.log('[seedBase] Done.')
}

if (import.meta.main) {
  seedBase()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error('seedBase failed', e)
      process.exit(1)
    })
}
