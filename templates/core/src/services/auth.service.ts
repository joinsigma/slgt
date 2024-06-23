import crypto from 'crypto'
import Environment from '../config/environment'

class AuthService {
  encryptKey: string

  constructor() {
    this.encryptKey = Environment.config().encryptKey
  }

  public encryptObject(payload: any) {
    const algorithm = 'aes-128-ecb'
    const secretKey = Buffer.from(this.encryptKey, 'hex')
    const cipher = crypto.createCipheriv(algorithm, secretKey, '')
    const result = Buffer.concat([cipher.update(payload), cipher.final()])
    return result.toString('hex')
  }

  public decryptObject = (encryptedData: any) => {
    const algorithm = 'aes-128-ecb'
    const secretKey = Buffer.from(this.encryptKey, 'hex')
    const decipher = crypto.createDecipheriv(algorithm, secretKey, '')

    return Buffer.concat([
      decipher.update(encryptedData, 'hex'),
      decipher.final(),
    ]).toString()
  }
}

export default AuthService
