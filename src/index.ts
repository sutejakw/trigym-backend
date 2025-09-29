import { Hono } from 'hono'
import authRoute from './routes/auth'
import { db } from './db'
import { authMiddleware } from './middleware/auth'

const apiApp = new Hono()

apiApp.use('*', async (c, next) => {
  c.set('db', db)
  await next()
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
