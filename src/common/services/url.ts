import { BaseError } from '../errors'
import qs from 'qs'

export type DomainSuffix = 'cn' | 'hk'

export class UrlService {
  getDomainSuffix(): DomainSuffix {
    const hkReg = /.hk$/
    const cnReg = /.cn$/
    const hostname = window.location.hostname
    if (hkReg.test(hostname)) {
      return 'hk'
    }
    if (cnReg.test(hostname)) {
      return 'cn'
    }
    throw new BaseError(`${hostname} do not support`)
  }

  getCookieDomain() {
    return `.youyu.${this.getDomainSuffix()}`
  }

  getQueryString(name: string) {
    const result = qs.parse(window.location.search, { ignoreQueryPrefix: true })
    return result[name] as string | undefined
  }
}
