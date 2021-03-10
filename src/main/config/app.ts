import express from 'express'

import useMiddlewares from './middlewares'
import useRoutes from './routes'

const app = express()

useMiddlewares(app)
useRoutes(app)

export default app