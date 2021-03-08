import { HttpResponse } from '../protocols'
import { InternalServerError as ServerError } from '../errors'

export const BadRequest = (error: Error): HttpResponse => ({
	statusCode: 400,
	body: error
})

export const InternalServerError = (): HttpResponse => ({
	statusCode: 500,
	body: new ServerError()
})

export const Success = (data: any): HttpResponse => ({
	statusCode: 200,
	body: data
})
