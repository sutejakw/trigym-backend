import { db } from '@/db/db'
import { users } from '@/db/schema'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs')

async function seed() {
  await db.insert(users).values({
    name: 'Admin',
    email: 'admin@example.com',
    password_hash: await bcrypt.hash('password', 10),
    phone: '1234567890',
    gender: 'Male',
    date_of_birth: new Date('2025-05-01').toDateString(),
    role: 'admin',
  })
  console.log('Seed selesai!')
  process.exit(0)
}

seed()
