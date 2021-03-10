import { Express } from 'express'

import { BodyParser, ContentType, cors } from '../middlewares'

export default (app: Express): void => {
	app.use(BodyParser)
	app.use(ContentType)
	app.use(cors)
}