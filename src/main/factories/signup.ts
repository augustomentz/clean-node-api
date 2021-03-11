import { SignUpController } from '../../presentation/controllers/signup/signup-controller'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BCryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/database/mongodb/repositories/account/account'

export const makeSignUpController = (): SignUpController => {
	const salt = 12
	const emailValidatorAdapter = new EmailValidatorAdapter()
	const bcryptAdapter = new BCryptAdapter(salt)
	const accountMongoRepository = new AccountMongoRepository()
	const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
	
	return new SignUpController(emailValidatorAdapter, dbAddAccount)
}