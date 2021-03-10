import { Encrypter, AddAccountModel, AccountModel, AddAccountRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
	sut: DbAddAccount
	encrypterStub: Encrypter
	addAccountRepositoryStub: AddAccountRepository
}

// Factory
const makeEncrypter = (): Encrypter => {
	class EncrypterStub implements Encrypter {
		async encrypt(value: string): Promise<string> {
			return new Promise(resolve => resolve('hashed_password'))
		} 
	}

	return new EncrypterStub()
}

// Factory
const makeAddAccountRepository = (): AddAccountRepository => {
	class AddAccountRepositoryStub implements AddAccountRepository {
		async add (account: AddAccountModel): Promise<AccountModel> {
			const fakeAccount = {
				id: 'valid_id',
				name: 'valid_name',
				email: 'valid_email@email.com',
				password: 'hashed_password'
			}

			return new Promise(resolve => resolve(fakeAccount))
		} 
	}

	return new AddAccountRepositoryStub()
}

// Factory
const makeSut = (): SutTypes => {
	const encrypterStub = makeEncrypter()
	const addAccountRepositoryStub = makeAddAccountRepository()
	const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

	return {
		sut,
		encrypterStub,
		addAccountRepositoryStub
	}
}

describe('DbAddAccount Usecase', () => {
	test('Should call {Encrypter} with correct password', async () => {
		const { sut, encrypterStub } = makeSut()
		const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
		const account = {
			name: 'valid_name',
			email: 'valid_email@email.com',
			password: 'valid_password'
		}

		await sut.add(account)
		expect(encryptSpy).toHaveBeenCalledWith('valid_password')
	})

	test('Should throw if {Encrypter} throws', async () => {
		const { sut, encrypterStub } = makeSut()
		jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
		
		const account = {
			name: 'valid_name',
			email: 'valid_email@email.com',
			password: 'valid_password'
		}

		const promise = sut.add(account)
		await expect(promise).rejects.toThrow()
	})

	test('Should call {AddAccountRepository} with correct values', async () => {
		const { sut, addAccountRepositoryStub } = makeSut()
		const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
		const account = {
			name: 'valid_name',
			email: 'valid_email@email.com',
			password: 'valid_password'
		}

		await sut.add(account)
		expect(addSpy).toHaveBeenCalledWith({
			name: 'valid_name',
			email: 'valid_email@email.com',
			password: 'hashed_password'
		})
	})

	test('Should throw if {AddAccountRepository} throws', async () => {
		const { sut, addAccountRepositoryStub } = makeSut()
		jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
		
		const account = {
			name: 'valid_name',
			email: 'valid_email@email.com',
			password: 'valid_password'
		}

		const promise = sut.add(account)
		await expect(promise).rejects.toThrow()
	})

	test('Should return an account on success', async () => {
		const { sut } = makeSut()
		const account = {
			name: 'valid_name',
			email: 'valid_email@email.com',
			password: 'valid_password'
		}

		const createdAccount = await sut.add(account)
		expect(createdAccount).toEqual({
			id: 'valid_id',
			name: 'valid_name',
			email: 'valid_email@email.com',
			password: 'hashed_password'
		})
	})
})