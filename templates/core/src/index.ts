import express, { Express } from 'express'
import * as dotenv from 'dotenv'
dotenv.config()

import cors from 'cors'
import healthRoute from './routes/health.route'
import authRoute from './routes/auth.route'

const app: Express = express()

// configure the app to use bodyParser()
app.use(express.json())
app.use(cors())

const port = process.env.PORT

const router = express.Router()
app.use(router)
app.use('/', healthRoute)
app.use('/auth', authRoute)

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`)
})
