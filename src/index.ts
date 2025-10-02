import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'
import { cors } from 'hono/cors'
import authRoute from './routes/auth.routes'
import membershipPlanRoute from './routes/membershipPlan.routes'
import membershipRoute from './routes/membership.routes'
import { authMiddleware } from './middleware/auth'
import { logger } from 'hono/logger'
import { logger as appLogger } from './utils/logger'

const app = new Hono()
app
  .use(secureHeaders())
  .use('/api/*', cors())
  .use(logger())
  .route('api/auth', authRoute)
  .route('api/membership-plans', membershipPlanRoute)
  .route('api/memberships', membershipRoute)
  .get('/me', authMiddleware, (c) => {
    const user = c.get('jwtPayload')
    return c.json({ user })
  })
  .get('/', (c) => {
    return c.text('Hello Hono!')
  })

// Error logging middleware
app.onError((err, c) => {
  appLogger.error({ err }, '[ERROR]')
  if (err instanceof Response) return err
  return c.json({ error: 'Internal Server Error' }, 500)
})

export default app
