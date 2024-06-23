export interface SimpleResponse<T> {
  status: number
  message: string
  data: T
  errors: T
}
