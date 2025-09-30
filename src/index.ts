import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'
import { cors } from 'hono/cors'
import authRoute from './routes/auth'
import { authMiddleware } from './middleware/auth'
import { csrf } from 'hono/csrf'
import { logger } from 'hono/logger'
import { logger as appLogger } from './utils/logger'

const apiApp = new Hono()
apiApp.use(secureHeaders())
apiApp.use('/api/*', cors())
apiApp.use(csrf())

apiApp.use(logger())

// Error logging middleware
apiApp.onError((err, c) => {
  appLogger.error({ err }, '[ERROR]')
  if (err instanceof Response) return err
  return c.json({ error: 'Internal Server Error' }, 500)
})

apiApp.get('/me', authMiddleware, (c) => {
  const user = c.get('jwtPayload')
  return c.json({ user })
})

apiApp.route('/auth', authRoute)

const app = new Hono()
app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.route('/api', apiApp)

export default app
