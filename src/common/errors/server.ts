import { BaseError } from './base'

export class ServerError extends BaseError {
  constructor(msg: string, public code: number) {
    super(msg)
    Object.setPrototypeOf(this, ServerError.prototype)
    this.name = ServerError.name
  }
}
