export type Env = 'local' | 'dev' | 'qa' | 'stage' | 'live'
export type Lang = 'zh-hans' | 'zh-hant' | 'en'
export type Theme = 'dark' | 'light'

export type getQueryStringKey = () => string

export interface GetOptions<T extends string> {
  regExps: Record<T, RegExp | undefined>
  queryStringKey: string | getQueryStringKey
  defaultValue: T
}

export abstract class CoreEnvService {
  //#region 环境相关
  /** 当前环境 */
  abstract getEnv(): Env
  isLocalEnv() {
    return this.getEnv() === 'local'
  }
  isDevEnv() {
    return this.getEnv() === 'dev'
  }
  isQaEnv() {
    return this.getEnv() === 'qa'
  }
  isStageEnv() {
    return this.getEnv() === 'stage'
  }
  isLiveEnv() {
    return this.getEnv() === 'live'
  }
  /** 这个是用来区分是开发环境还是 build 完的环境 */
  isDevelopment() {
    return process.env.NODE_ENV === 'development'
  }
  isProduction() {
    return process.env.NODE_ENV === 'production'
  }
  //#endregion

  //#region 语言相关
  abstract getLang(options?: GetOptions<Lang>): Lang
  isZhHansLang() {
    return this.getLang() === 'zh-hans'
  }
  isZhHantLang() {
    return this.getLang() === 'zh-hant'
  }
  isEnLang() {
    return this.getLang() === 'en'
  }
  //#endregion

  //#region 主题相关
  abstract getTheme(options?: GetOptions<Theme>): Theme
  isDarkTheme() {
    return this.getTheme() === 'dark'
  }
  isLightTheme() {
    return this.getTheme() === 'light'
  }
  //#endregion
}
