import request from 'supertest'

import { MongoHelper } from '../../infra/database/mongodb/helpers/mongo-helper'
import app from '../config/app'

describe('SignUp Routes', () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL)
	})

	afterAll(async () => {
		await MongoHelper.disconnect()
	})

	beforeEach(async () => {
		const collection = await MongoHelper.getCollection('accounts')

		await collection.deleteMany({})
	})
	
	test('Should return an account on success', async () => {
		await request(app)
			.post('/api/signup')
			.send({
				name: 'Augusto',
				email: 'augustohmn.tech@gmail.com',
				password: 'admin',
				passwordConfirmation: 'admin'
			})
			.expect(200)
	})
})