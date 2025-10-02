import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

export const config = {
  database: {
    url: process.env.DATABASE_URL || '',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10'),
    idleTimeoutMs: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expirySeconds: parseInt(process.env.JWT_EXPIRY_SECONDS || '900'), // 15 minutes
  },
  server: {
    port: parseInt(process.env.PORT || '3000'),
    nodeEnv: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
}

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET']

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
}
