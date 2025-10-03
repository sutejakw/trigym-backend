import 'dotenv/config'
import { seedBase } from './seed'
import { seedMemberships } from './seedMemberships'
import { seedTrainers } from './seedTrainers'

async function main() {
  const start = Date.now()
  console.log('--- Running Full Seed ---')
  try {
    await seedBase()
    await seedTrainers()
    await seedMemberships()
    const elapsed = Date.now() - start
    console.log(`Full seed completed in ${elapsed}ms`)
  } catch (e) {
    console.error('Full seed failed', e)
    process.exit(1)
  }
}

if (require.main === module) {
  main().then(() => process.exit(0))
}
