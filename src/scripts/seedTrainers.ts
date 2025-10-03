import { db } from '@/db/db'
import { trainers } from '@/db/schema'

export async function seedTrainers() {
  const data = [
    {
      user_id: 1,
      bio: 'Certified personal trainer with 5 years experience.',
      specialization: 'Strength Training',
      hourly_rate: '200000',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    // {
    //   user_id: 2,
    //   bio: 'Yoga instructor and nutritionist.',
    //   specialization: 'Yoga',
    //   hourly_rate: '150000',
    //   is_active: true,
    //   created_at: new Date(),
    //   updated_at: new Date(),
    // },
    // {
    //   user_id: 3,
    //   bio: 'HIIT and cardio specialist.',
    //   specialization: 'HIIT',
    //   hourly_rate: '180000',
    //   is_active: true,
    //   created_at: new Date(),
    //   updated_at: new Date(),
    // },
  ]
  await db.insert(trainers).values(data)
  console.log('Seeded trainers')
}

if (require.main === module) {
  seedTrainers().then(() => process.exit(0))
}
