import { BaseRoute } from './base.route'
import controller from '../controllers/health.controller'

export class HealthRoute extends BaseRoute {
  constructor() {
    super()
  }
  protected initRoutes(): void {
    this.router.route('/health').get(controller.healthCheck)
  }
}

export default new HealthRoute().getRouter()
