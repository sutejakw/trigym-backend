import { config } from '@/config/config'
import { defineConfig } from 'drizzle-kit'

console.log('Loaded DB URL:', config.database.url) // cek log

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.database.url!,
  },
  casing: 'snake_case',
})
