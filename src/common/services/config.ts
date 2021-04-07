import type { Env } from './env'
import { CoreEnvService } from './env'
import type { DomainSuffix } from './url'

type EnvValue = [string, string, string, string, string]

export type EnvValueMap<T = string> = Record<Env, T>

/**
 * 根据 env 获取不用的 value
 */
export class ConfigService {
  constructor(private envService: CoreEnvService) {}

  getValueByEnv(
    value1: string,
    value2: string,
    value3: string,
    value4: string,
    value5: string,
  ) {
    const indexMap: Record<Env, 0 | 1 | 2 | 3 | 4> = {
      local: 0,
      dev: 1,
      qa: 2,
      stage: 3,
      live: 4,
    }
    const envValue: EnvValue = [value1, value2, value3, value4, value5]
    const env = this.envService.getEnv()
    const index = indexMap[env]
    return envValue[index]
  }

  getValueByEnvMap(envMap: EnvValueMap) {
    const env = this.envService.getEnv()
    return envMap[env]
  }

  getBaseUrlForDomain(
    domainSuffix: DomainSuffix,
    cnUrl1: string,
    cnUrl2: string,
    cnUrl3: string,
    cnUrl4: string,
    cnUrl5: string,
    hkUrl1: string,
    hkUrl2: string,
    hkUrl3: string,
    hkUrl4: string,
    hkUrl5: string,
  ) {
    switch (domainSuffix) {
      case 'cn':
        return this.getValueByEnv(cnUrl1, cnUrl2, cnUrl3, cnUrl4, cnUrl5)
      case 'hk':
        return this.getValueByEnv(hkUrl1, hkUrl2, hkUrl3, hkUrl4, hkUrl5)
    }
  }
}
