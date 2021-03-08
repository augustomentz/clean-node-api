import { HttpResponse, HttpRequest, Controller, EmailValidator, AddAccount } from './signup-protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { BadRequest, InternalServerError, Success } from '../../helpers/http-helper'

export class SignUpController implements Controller {
	private readonly emailValidator: EmailValidator
	private readonly addAccount: AddAccount

	constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
		this.emailValidator = emailValidator
		this.addAccount = addAccount
	}

	async handle (request: HttpRequest): Promise<HttpResponse> {
		try {
			const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
			for (const field of requiredFields) {
				if (!request.body[field]) {
					return BadRequest(new MissingParamError(field))
				}
			}
	
			const { name, email, password, passwordConfirmation } = request.body
			if (password !== passwordConfirmation) {
				return BadRequest(new InvalidParamError('passwordConfirmation'))
			}

			const isValid = this.emailValidator.isValid(email)
			if (!isValid) {
				return BadRequest(new InvalidParamError('email'))
			}

			const account = await this.addAccount.add({
				name,
				email,
				password
			})

			return Success(account)
		} catch (error) {
			return InternalServerError()
		}
	}
}
