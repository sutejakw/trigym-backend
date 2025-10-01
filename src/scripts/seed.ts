import { db } from '@/db/db'
import { users, membership_plans } from '@/db/schema'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs')

async function seed() {
  // Seed users
  await db.insert(users).values({
    name: 'Admin',
    email: 'admin@example.com',
    password_hash: await bcrypt.hash('password', 10),
    phone: '1234567890',
    gender: 'Male',
    date_of_birth: new Date('2025-05-01').toDateString(),
    role: 'admin',
  })

  // Seed membership plans
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
      features: 'All VIP features, Guest passes, Priority customer support, Annual health check-up',
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

  console.log('Seed selesai!')
  process.exit(0)
}

seed()
