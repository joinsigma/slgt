import { SimpleResponse } from '../interfaces/response.interface'

export class ApiResponse<T> implements SimpleResponse<T> {
  public status: number = 200
  public message: string = 'OK'
  public data: T
  public errors: T

  constructor({
    status,
    message,
    data,
    errors,
  }: {
    status: number
    message: string
    data: T
    errors: T
  }) {
    this.status = status
    this.message = message
    this.data = data
    this.errors = errors
  }

  public static create<T>(
    data: T,
    status?: number,
    message?: string,
    errors?: T
  ) {
    return new ApiResponse<T>({ data, status, message, errors })
  }
}
