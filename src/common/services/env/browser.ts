import { Env, Lang, Theme, GetOptions, CoreEnvService } from './core'
import { UrlService } from '../url'

export const defaultGetEnvOptions: GetOptions<Env> = {
  regExps: {
    // localhost, 10.8.73.123, m.reotest.com, m.wlbtester.com 等
    local: /localhost|127\.0\.0\.1/i,
    dev: /((reo)?test|localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.((1[6-9]|2\d|3[01]))\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3})/i,
    qa: /-(qa|uat)\./i,
    stage: /-(stage)\./i,
    live: undefined,
  },
  queryStringKey: () => document.domain,
  defaultValue: 'live',
}

export const defaultGetLangOptions: GetOptions<Lang> = {
  regExps: {
    'zh-hans': /zh-hans/i,
    'zh-hant': /zh-hant/i,
    en: /en/i,
  },
  queryStringKey: 'lang',
  defaultValue: 'zh-hans',
}

export const defaultGetThemeOptions: GetOptions<Theme> = {
  regExps: {
    dark: /1/,
    light: /0/,
  },
  queryStringKey: 'theme',
  defaultValue: 'dark',
}

type Platform = 'Android' | 'Ios' | 'Windows' | 'Linux' | 'Mac'
type Browser =
  | 'ie'
  | 'chrome'
  | 'firefox'
  | 'opera'
  | 'safari'
  | 'edge'
  | 'qq'
  | 'wx'
  | 'other'

/**
 * 在浏览器环境中取得环境信息
 */
export class BrowserEnvService extends CoreEnvService {
  constructor(private urlService: UrlService) {
    super()
  }

  getQuery<T extends string>(options: GetOptions<T>): T {
    const { regExps, queryStringKey, defaultValue } = options
    let result: string | undefined
    if (typeof queryStringKey === 'string') {
      result = this.urlService.getQueryString(queryStringKey)
    } else {
      result = queryStringKey()
    }
    if (typeof result === 'string') {
      for (const [key, regExp] of Object.entries<RegExp | undefined>(regExps)) {
        if (regExp && regExp.test(result)) {
          return key as T
        }
      }
    }
    return defaultValue
  }

  /**
   * 通过 document.domain 得到当前环境
   */
  getEnv(options = defaultGetEnvOptions): Env {
    return this.getQuery(options)
  }

  /**
   * 通过 query string 得到当前语言
   */
  getLang(options = defaultGetLangOptions): Lang {
    return this.getQuery(options)
  }

  /**
   * 通过 query string 得到当前主题
   */
  getTheme(options = defaultGetThemeOptions): Theme {
    return this.getQuery(options)
  }

  private testUserAgent(key: RegExp) {
    return key.test(navigator.userAgent)
  }
  // MajikWealth
  isStockApp(key = /MajikWealth/i) {
    return this.testUserAgent(key)
  }
  // ReOrientWM
  isWmApp(key = /ReOrientWM/i) {
    return this.testUserAgent(key)
  }
  isApp(key1 = /MajikWealth/i, key2 = /ReOrientWM/i) {
    return this.isStockApp(key1) || this.isWmApp(key2)
  }
  isIosPlatform() {
    return this.testUserAgent(/iphone|ipod|ipad/i)
  }
  isAndroidPlatform() {
    return this.testUserAgent(/android/i)
  }
  isMacOSPlatform() {
    return this.testUserAgent(/mac os x/i)
  }
  isWindowsPlatform() {
    return this.testUserAgent(/windows/i)
  }
  isMobilePlatform() {
    return this.isIosPlatform() || this.isAndroidPlatform()
  }
  isPCPlatform() {
    return this.isMacOSPlatform() || this.isWindowsPlatform()
  }
  getPlatform(): Platform {
    if (this.isAndroidPlatform()) {
      return 'Android'
    }
    if (this.isIosPlatform()) {
      return 'Ios'
    }
    if (this.isWindowsPlatform()) {
      return 'Windows'
    }
    if (this.isMacOSPlatform()) {
      return 'Mac'
    }
    return 'Linux'
  }
  platform = this.getPlatform()

  isIEBrowser() {
    return 'ActiveXObject' in window
  }
  isChromeBrowser() {
    return this.testUserAgent(/chrome/i)
  }
  isFirefoxBrowser() {
    return this.testUserAgent(/firefox/i)
  }
  isOperaBrowser() {
    return this.testUserAgent(/opera/i)
  }
  isSafariBrowser() {
    return this.testUserAgent(/safari/i) && this.isChromeBrowser()
  }
  isEdgeBrowser() {
    return this.testUserAgent(/edge/i)
  }
  isQQBrowser() {
    return this.testUserAgent(/qqbrowser/i)
  }
  isWxBrowser() {
    return this.testUserAgent(/MicroMessenger/i)
  }
  getBrowser(): Browser {
    if (this.isIEBrowser()) {
      return 'ie'
    }
    if (this.isChromeBrowser()) {
      return 'chrome'
    }
    if (this.isFirefoxBrowser()) {
      return 'firefox'
    }
    if (this.isOperaBrowser()) {
      return 'opera'
    }
    if (this.isSafariBrowser()) {
      return 'safari'
    }
    if (this.isEdgeBrowser()) {
      return 'edge'
    }
    if (this.isQQBrowser()) {
      return 'qq'
    }
    if (this.isWxBrowser()) {
      return 'wx'
    }
    return 'other'
  }
  browser = this.getBrowser()

  lang = navigator.language
}
