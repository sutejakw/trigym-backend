import { Hono } from 'hono'
import { loginService, refreshService, logoutService } from '@/services/authService'

const app = new Hono()

app.post('/login', loginService)
app.post('/refresh-token', refreshService)
app.post('/logout', logoutService)

export default app
