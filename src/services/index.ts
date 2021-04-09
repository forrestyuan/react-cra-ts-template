import { HttpService, HttpConstructorConfig } from '@/common/services/http'
import { ConfigService } from '@/common/services/config'
// import { CryptoService } from '@/common/services/crypto'

import { baseUrlsMap, iv } from './domain'
import { reaction } from 'mobx'
import { envService } from './env-services'
import { envStore } from '@/modules/common/env-store'
import { onError } from './onError'
import { CryptoService } from '@/common/services/crypto'
import { store as userStore } from '@/modules/common/user-store'

export const configService = new ConfigService(envService)
export const cryptoService = new CryptoService(iv)

export const baseUrl = configService.getValueByEnvMap(baseUrlsMap)

const commonConfig: HttpConstructorConfig = {
  baseUrl,
  productInfo: { name: 'esop-member', version: '1.0.0' },
  lang: envStore.lang,
  // withLoginInfo: userStore.isLogin,
  deviceInfo: {
    platform: envService.getPlatform(),
    browser: envService.getBrowser(),
    lang: envService.getLang(),
  },
  onError,
  withChannel: true,
  channel: envStore.channel,
  withRandomParams: true,
}
const crytoConfig: HttpConstructorConfig = {
  // withBeforeLoginCrypto: !userStore.isLogin,
  // withCrypto: false,
  // withLog: !envService.isLiveEnv(),
  // cryptoInfo: {
  //   terminalKey: configService.getValueByEnvMap(terminalKeyMap),
  //   rndKey: userStore.info.rndkey,
  // },
}

export const httpService = new HttpService(cryptoService, {
  ...commonConfig,
  ...crytoConfig,
})

// channel
reaction(
  () => envStore.channel,
  (channel) => {
    httpService.setChannel(channel)
  },
)
// rndkey reaction
reaction(
  () => userStore.info.rndkey,
  (rndkey) => {
    httpService.setCryptoRndKey(rndkey ?? '')
  },
)
//lang
reaction(
  () => envStore.lang,
  (lang) => {
    httpService.setLang(lang)
  },
)
