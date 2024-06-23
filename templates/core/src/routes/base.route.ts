import { Router } from 'express'
// import { createValidator } from 'express-joi-validation'

export abstract class BaseRoute {
  protected router: Router
  protected validator: any

  constructor() {
    this.router = Router({
      mergeParams: true,
    })
    // this.validator = createValidator() TODO: add validation
    this.initRoutes()
    console.log(`${this.constructor.name} created`)
  }

  public getRouter(): Router {
    return this.router
  }

  protected abstract initRoutes(): void
}
