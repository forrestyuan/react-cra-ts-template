export class BaseError extends Error {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, BaseError.prototype)
    this.name = BaseError.name
  }
}
