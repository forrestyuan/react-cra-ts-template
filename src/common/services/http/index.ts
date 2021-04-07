import {
  CoreHttp,
  AxiosHttp,
  BaseHttpRequestConfig,
  defaultBaseHttpRequestConfig,
} from './core'

import cookie from 'cookie'
import qs from 'qs'
import { Method } from 'axios'

import { BaseError, ServerError } from '../../errors'

import { CryptoService } from '../crypto'

export interface CryptoInfo {
  rndKey?: string
  terminalKey?: string
}

export interface AuthInfo {
  uin: string
  session: string
}

export interface ProductInfo {
  name: string
  version: string
}

export interface DeviceInfo {
  platform: string
  browser: string
  lang: string
}

export interface Data<T> {
  code: number
  msg: string
  data: T
}

interface HttpServiceConfig {
  /** 进行ajax请求的内核, 默认为axios */
  coreHttpType?: 'axios'
  baseUrl?: string
  productInfo?: ProductInfo
  deviceInfo?: DeviceInfo
  timeout?: number
  withCredentials?: boolean
  httpsAgent?: any
}

interface EnvInfoConfig {
  withLang?: boolean
  withChannel?: boolean
  lang?: string
  channel?: string
  withLog?: boolean
}

interface CryptoInfoConfig {
  withCrypto?: boolean
  withBeforeLoginCrypto?: boolean
  /** 加密信息 random key */
  cryptoInfo?: CryptoInfo
}

interface LoginInfoConfig {
  /**
   * 请求是否携带登录信息
   */
  withLoginInfo?: boolean
  /**
   * 登录信息 uin + session
   */
  authInfo?: AuthInfo
}

type OnError = (err: any) => never

interface OnErrorConfig {
  onError?: OnError
}

export type HttpConstructorConfig = HttpServiceConfig &
  EnvInfoConfig &
  CryptoInfoConfig &
  LoginInfoConfig &
  OnErrorConfig & {
    withRandomParams?: boolean
  }

export type HttpRequestConfig = BaseHttpRequestConfig &
  EnvInfoConfig &
  CryptoInfoConfig &
  LoginInfoConfig

function getCookieString<K extends string, V extends string>(
  record: Record<K, V>,
) {
  return Object.entries<string>(record)
    .map(([key, val]) =>
      cookie.serialize(key, val, { sameSite: 'none', secure: true }),
    )
    .join(';')
}

export class HttpService {
  private coreHttp: CoreHttp
  private baseUrl?: string

  // 大部分接入层需要header中加入 Accept-Language 来返回多语言数据
  withLang: boolean
  private lang?: string
  setLang(lang: string) {
    this.lang = lang
  }

  withChannel: boolean
  private channel?: string
  setChannel(channel: string) {
    this.channel = channel
  }

  private productInfo?: ProductInfo
  setProductInfo(productInfo: ProductInfo) {
    this.productInfo = productInfo
  }

  private deviceInfo?: DeviceInfo
  setDeviceInfo(deviceInfo: DeviceInfo) {
    this.deviceInfo = deviceInfo
  }

  private withCrypto: boolean
  private withBeforeLoginCrypto: boolean
  private cryptoInfo: CryptoInfo = {}
  setCryptoRndKey(rndKey: string) {
    this.cryptoInfo.rndKey = rndKey
  }
  setCryptoTerminalKey(terminalKey: string) {
    this.cryptoInfo.terminalKey = terminalKey
  }

  private withLoginInfo: boolean
  private authInfo?: AuthInfo
  setAuthInfo(authInfo: AuthInfo) {
    this.authInfo = authInfo
  }
  private withRandomParams: boolean
  private withLog: boolean

  onError: OnError = (err) => {
    throw err
  }

  constructor(
    private cryptoService: CryptoService,
    {
      coreHttpType = 'axios',
      baseUrl,
      timeout = defaultBaseHttpRequestConfig.timeout,
      withCredentials = defaultBaseHttpRequestConfig.withCredentials,
      httpsAgent,
      productInfo,
      deviceInfo,
      withLang = true,
      lang,
      withChannel = false,
      channel,
      withLoginInfo = false,
      authInfo,
      withCrypto = false,
      withBeforeLoginCrypto = false,
      withRandomParams = false,
      withLog = false,
      cryptoInfo,
      onError,
    }: HttpConstructorConfig = defaultBaseHttpRequestConfig,
  ) {
    switch (coreHttpType) {
      case 'axios':
      default:
        this.coreHttp = new AxiosHttp({
          baseUrl,
          timeout,
          withCredentials,
          httpsAgent,
        })
    }
    this.baseUrl = baseUrl

    if (productInfo) {
      this.setProductInfo(productInfo)
    }
    if (deviceInfo) {
      this.setDeviceInfo(deviceInfo)
    }
    this.withLang = withLang
    if (lang) {
      this.setLang(lang)
    }
    this.withChannel = withChannel
    if (channel) {
      this.setChannel(channel)
    }
    this.withLoginInfo = withLoginInfo
    if (authInfo) {
      this.setAuthInfo(authInfo)
    }
    this.withCrypto = withCrypto
    this.withBeforeLoginCrypto = withBeforeLoginCrypto
    if (cryptoInfo && cryptoInfo.rndKey) {
      this.setCryptoRndKey(cryptoInfo.rndKey)
    }
    if (cryptoInfo && cryptoInfo.terminalKey) {
      this.setCryptoTerminalKey(cryptoInfo.terminalKey)
    }
    this.withRandomParams = withRandomParams
    this.withLog = withLog
    if (onError) {
      this.onError = onError
    }
  }

  /** 生成 value1||value2=someValue 的字符串 */
  private getHeaderValueString(values: (string | [string, string])[]) {
    return values
      .map((val) => {
        if (typeof val === 'string') {
          return val
        }
        return `${val[0]}=${val[1]}`
      })
      .join('||')
  }

  private generateCommonHeaders(): Record<string, string | number> {
    const result: Record<string, string> = {
      'X-requestid': this.cryptoService.uuid_v1(),
    }
    if (this.productInfo) {
      result['X-product'] = this.getHeaderValueString([
        this.productInfo.name,
        ['version', this.productInfo.version],
      ])
    }
    if (this.deviceInfo) {
      result['X-device'] = this.getHeaderValueString([
        this.deviceInfo.platform,
        ['browser', this.deviceInfo.browser],
        ['lang', this.deviceInfo.lang],
        // TODO: add brover(browser version)
      ])
    }
    if (this.withLang && this.lang) {
      result['Accept-Language'] = this.lang
    }
    return result
  }

  private getCookie(config?: HttpRequestConfig) {
    const authInfo = config?.authInfo ?? this.authInfo
    let Cookie: string
    if (authInfo) {
      Cookie = getCookieString(authInfo)
      return Cookie
    }
    throw new BaseError(`no login info: ${JSON.stringify(this.authInfo)}`)
  }

  private consoleLog(...args: any[]) {
    this.withLog && console.log(...args)
  }

  getXSignHeader(
    method: Method,
    path: string,
    config?: HttpRequestConfig,
    headers: any = {},
    data?: any,
  ) {
    let paramsString = ''
    const params = config?.params ?? {}
    const sortedParams = Object.keys(params)
      .sort()
      .reduce<Record<string, string>>((prev, curr) => {
        if (params[curr] !== undefined && params[curr] !== null) {
          prev[curr] = params[curr]
        }
        return prev
      }, {})
    paramsString = qs.stringify(sortedParams, {
      addQueryPrefix: false,
      encode: false,
    })
    // 有的path可能没以/开始
    const handledPath = (path[0] === '/' ? '' : '/') + path
    const requestDataPart =
      method.toUpperCase() +
      (this.baseUrl + handledPath).split('://')[1] +
      paramsString +
      (headers['X-requestid'] ?? '') +
      (headers['X-device'] ?? '') +
      (headers['X-product'] ?? '') +
      (headers['X-antispams'] ?? '') +
      (headers['X-timestamp'] ?? '') +
      (headers['Content-Type'] ?? '') +
      (headers['Accept-Language'] ?? '')
    const bodyDataPart = data ? JSON.stringify(data) : ''
    const requestData = requestDataPart + bodyDataPart
    this.consoleLog('requestData: ', requestData)

    if (config?.withBeforeLoginCrypto ?? this.withBeforeLoginCrypto) {
      // 只用terminalKey
      if (this.cryptoInfo.terminalKey) {
        return this.cryptoService.hmacSha256(
          requestData,
          this.getTempRndKey(this.cryptoInfo.terminalKey, headers),
        )
      } else {
        this.throwCryptoError()
      }
    } else if (config?.withCrypto ?? this.withCrypto) {
      // 这种一般已经登录了
      // note:涉及到交易密码的rndKey，是auth2加密里面的rndKey，不是login-rndKey
      // this.cryptoInfo.rndKey  是login-rndKey
      const cryptoInfo = config?.cryptoInfo ?? this.cryptoInfo
      if (cryptoInfo.rndKey && this.cryptoInfo.terminalKey) {
        return this.cryptoService.hmacSha256(
          requestData,
          cryptoInfo.rndKey +
            this.getTempRndKey(this.cryptoInfo.terminalKey, headers),
        )
      } else {
        this.throwCryptoError()
      }
    }
    return ''
  }

  private mergeConfig<T>(
    method: Method,
    path: string,
    config?: HttpRequestConfig,
    data?: any,
  ) {
    const headers = this.generateCommonHeaders()
    if (config?.withLoginInfo ?? this.withLoginInfo) {
      headers.Cookie = this.getCookie()
    }
    const params: Record<string, string | number> = {}
    if (this.withChannel && this.channel) {
      params.channel = this.channel
    }
    if (this.withRandomParams && method === 'get') {
      params._random = Date.now()
    }

    const finalConfig = {
      // 默认值放这里
      // ...
      path,
      ...config,
      headers: {
        ...headers,
        ...config?.headers,
      },
      params: {
        ...params,
        ...config?.params,
      },
    }

    if (method.toUpperCase() !== 'GET' && !data) {
      data = {}
    }

    const withBeforeLoginEncrypt =
      config?.withBeforeLoginCrypto ?? this.withBeforeLoginCrypto
    const withCryptoInfo = config?.withCrypto ?? this.withCrypto
    if (withBeforeLoginEncrypt || withCryptoInfo) {
      if (data === undefined) {
        finalConfig.data = null
      }
      finalConfig.headers['X-timestamp'] = Date.now()
      finalConfig.headers['X-antispams'] = `0:${this.cryptoService.uuid_v1()}`
      finalConfig.headers['Content-Type'] = 'text/encrypted; aver=1'
      finalConfig.headers['X-sign'] = this.getXSignHeader(
        method,
        path,
        finalConfig,
        finalConfig.headers,
        data,
      )
    }

    return finalConfig
  }

  private getTempRndKey(terminalKey: string, headers: Record<string, string>) {
    return this.cryptoService.sha256Encrypt(
      terminalKey +
        headers['X-device'] +
        headers['X-antispams'] +
        headers['X-timestamp'],
    )
  }

  private throwCryptoError(): never {
    throw new BaseError(`no crypto info: ${JSON.stringify(this.cryptoInfo)}`)
  }

  private handleBody<T>(data?: any, config?: HttpRequestConfig) {
    data = data ?? {}
    this.consoleLog('debug handleBody: ', data)
    if (data && (config?.withBeforeLoginCrypto ?? this.withBeforeLoginCrypto)) {
      const beforeLoginEncryptInfo = config?.cryptoInfo ?? this.cryptoInfo
      if (beforeLoginEncryptInfo.terminalKey) {
        return this.cryptoService.aesEncrypt(
          data,
          this.getTempRndKey(
            beforeLoginEncryptInfo.terminalKey,
            config?.headers ?? {},
          ),
        )
      } else {
        this.throwCryptoError()
      }
    }
    if (data && (config?.withCrypto ?? this.withCrypto)) {
      const cryptoInfo = config?.cryptoInfo ?? this.cryptoInfo
      if (cryptoInfo.rndKey) {
        return this.cryptoService.aesEncrypt(data, cryptoInfo.rndKey)
      } else {
        this.throwCryptoError()
      }
    }
    return data
  }

  private handleEncryptedData<T>(
    data: T,
    config?: HttpRequestConfig & { path: string },
  ): T {
    if (typeof data === 'string') {
      if (config?.withBeforeLoginCrypto ?? this.withBeforeLoginCrypto) {
        const beforeLoginCryptoInfo = config?.cryptoInfo ?? this.cryptoInfo
        if (beforeLoginCryptoInfo.terminalKey) {
          let decrtpyData: T = this.cryptoService.aesDecrypt(
            data,
            this.getTempRndKey(
              beforeLoginCryptoInfo.terminalKey,
              config?.headers ?? {},
            ),
          )
          this.consoleLog('debug decrtpyData: ', config?.path, decrtpyData)
          return decrtpyData
        } else {
          this.throwCryptoError()
        }
      }
      if (config?.withCrypto ?? this.withCrypto) {
        const cryptoInfo = config?.cryptoInfo ?? this.cryptoInfo
        if (cryptoInfo.rndKey) {
          let decrtpyData: T = this.cryptoService.aesDecrypt(
            data,
            cryptoInfo.rndKey,
          )
          this.consoleLog('debug decrtpyData: ', config?.path, decrtpyData)
          return decrtpyData
        } else {
          this.throwCryptoError()
        }
      }
    } else {
      // 如果typeof data !== 'string' 说明有非加密的报错, 直接走到最后的返回
    }
    // 如果withBeforeLoginEncrypt和withCryptoInfo都没有设置, 直接返回
    return data
  }

  private handleYouyuResponse<T>(res: Data<T>) {
    if (res instanceof Blob) {
      if (res.type === 'application/json') {
        return res.text().then((json) => {
          const data = JSON.parse(json) as Data<T>
          return Promise.reject(new ServerError(data.msg, data.code))
        })
      }
      return (res as unknown) as T
    }
    if (res instanceof ArrayBuffer) {
      return (res as unknown) as T
    }
    if (res.code === 0) {
      return res.data
    }
    throw new ServerError(res.msg, res.code)
  }

  youyuGet<RES>(path: string, config?: HttpRequestConfig) {
    const mergedConfig = this.mergeConfig('get', path, config)
    return this.coreHttp
      .get<Data<RES>>(path, mergedConfig)
      .then((res) => this.handleEncryptedData(res, mergedConfig))
      .then(this.handleYouyuResponse)
      .catch(this.onError)
  }

  youyuPost<RES, DATA = any>(
    path: string,
    data?: DATA,
    config?: HttpRequestConfig,
  ) {
    const mergedConfig = this.mergeConfig('post', path, config, data)
    return this.coreHttp
      .post<Data<RES>>(path, this.handleBody(data, mergedConfig), mergedConfig)
      .then((res) => this.handleEncryptedData(res, mergedConfig))
      .then(this.handleYouyuResponse)
      .catch(this.onError)
  }

  youyuPut<RES, DATA = any>(
    path: string,
    data?: DATA,
    config?: HttpRequestConfig,
  ) {
    const mergedConfig = this.mergeConfig('put', path, config, data)
    return this.coreHttp
      .put<Data<RES>>(path, this.handleBody(data, mergedConfig), mergedConfig)
      .then((res) => this.handleEncryptedData(res, mergedConfig))
      .then(this.handleYouyuResponse)
      .catch(this.onError)
  }

  get<RES>(path: string, config?: HttpRequestConfig) {
    const mergedConfig = this.mergeConfig('get', path, config)
    return this.coreHttp
      .get<RES>(path, mergedConfig)
      .then((res) => this.handleEncryptedData(res, mergedConfig))
      .catch(this.onError)
  }

  post<RES, DATA = any>(path: string, data?: DATA, config?: HttpRequestConfig) {
    const mergedConfig = this.mergeConfig('post', path, config, data)
    return this.coreHttp
      .post<RES>(path, this.handleBody(data, mergedConfig), mergedConfig)
      .then((res) => this.handleEncryptedData(res, mergedConfig))
      .catch(this.onError)
  }

  put<RES, DATA = any>(path: string, data?: DATA, config?: HttpRequestConfig) {
    const mergedConfig = this.mergeConfig('put', path, config, data)
    return this.coreHttp
      .put<RES>(path, this.handleBody(data, mergedConfig), mergedConfig)
      .then((res) => this.handleEncryptedData(res, mergedConfig))
      .catch(this.onError)
  }
}
