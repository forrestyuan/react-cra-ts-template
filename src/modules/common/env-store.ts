import { makeAutoObservable } from 'mobx'
import { createStore } from '@/common/utils/create-store'
import { Env, Lang } from '@/common/services/env'
import { localStorageService, StorageKey } from '@/common/services/storage'
import { envService } from '@/services/env-services'

export const defaultLang: Lang = 'zh-hans'

const langStorageKey: StorageKey<Lang> = 'lang'

export interface langMapType {
  key: Lang
  label: string
  shorthand: string
  headers: 'zh-hans' | 'zh-hant' | 'en-us'
  companyNameKey: 'sname' | 'tname' | 'ename'
}

export const langsMap: langMapType[] = [
  {
    key: 'zh-hans',
    label: '简体中文',
    shorthand: '简',
    headers: 'zh-hans',
    companyNameKey: 'sname',
  },
  {
    key: 'zh-hant',
    label: '繁體中文',
    shorthand: '繁',
    headers: 'zh-hant',
    companyNameKey: 'tname',
  },
  {
    key: 'en',
    label: 'English',
    shorthand: 'EN',
    headers: 'en-us',
    companyNameKey: 'ename',
  },
]
export class EnvStore {
  constructor() {
    makeAutoObservable(this)
  }

  lang: Lang = envService.getQuery<Lang>({
    // 激活邮件导航值web，需要根据lang参数匹配语言
    regExps: {
      'zh-hans': /^zh-hans$/i,
      'zh-hant': /^zh-hant$/i,
      en: /^en(-us)?$/i,
    },
    queryStringKey: 'lang',
    defaultValue: localStorageService.get(langStorageKey, defaultLang),
  })

  env: Env = envService.getEnv()

  channel: string = 'yff'
  setChannel(channel: string) {
    this.channel = channel
  }

  setLang(lang: Lang, isStorage: boolean = true) {
    this.lang = lang
    isStorage && localStorageService.set(langStorageKey, lang)
  }

  getKeyByLang(keys: string[]) {
    const indexMap: Record<Lang, 0 | 1 | 2> = {
      'zh-hans': 0,
      'zh-hant': 1,
      en: 2,
    }
    const index = indexMap[this.lang]
    return keys[index]
  }

  get currentLangMap() {
    return langsMap.find((item) => item.key === this.lang)
  }
}

export type { Env, Lang } from '@/common/services/env'
export const [useEnvStore, envStore, envStoreContext] = createStore(EnvStore)
