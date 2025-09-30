import * as dotenv from 'dotenv'
dotenv.config() // PASTIKAN INI ADA DI PALING ATAS!
import { defineConfig } from 'drizzle-kit'

console.log('Loaded DB URL:', process.env.DATABASE_URL) // cek log

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  casing: 'snake_case',
})
