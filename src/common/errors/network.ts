import { BaseError } from './base'

export class NetworkError extends BaseError {
  constructor(msg: string, public status: number) {
    super(msg)
    Object.setPrototypeOf(this, NetworkError.prototype)
    this.name = NetworkError.name
  }
}
