import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../drizzle/schema'

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  user: 'user',
  password: 'password',
  database: 'trigym',
})

export const db = drizzle(pool, { schema })
