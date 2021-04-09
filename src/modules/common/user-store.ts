import { createStore } from '@/common/utils/create-store'
import { makeAutoObservable } from 'mobx'
import { UserInfo } from './lib'
export enum UserErrorCode {
  账号或密码错误 = 7008,
}

class userStore {
  constructor() {
    makeAutoObservable(this)
  }
  info: UserInfo = {
    username: '',
    thunbnail: '',
    email: '',
    rndkey: '',
    motto: '',
  }
}
export const [useUserStore, store, context] = createStore(userStore)
