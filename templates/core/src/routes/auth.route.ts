import { BaseRoute } from './base.route'
import controller from '../controllers/auth.controller'
export class AuthRoute extends BaseRoute {
  constructor() {
    super()
  }

  protected initRoutes(): void {
    this.router.route('/register').post(controller.register)
    this.router.route('/login').post(controller.login)
    this.router.route('/encrypt-payload').post(controller.encryptObject)
    this.router.route('/decrypt-payload').post(controller.decryptObject)
  }
}

export default new AuthRoute().getRouter()
