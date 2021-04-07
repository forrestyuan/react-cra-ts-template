import { makeAutoObservable } from 'mobx'
import { createStore } from '../../common/utils/create-store'
class LoginStore {
  constructor() {
    makeAutoObservable(this)
  }
  name: string = '登录页面'
}

export const [useLoginStore, store, context] = createStore(LoginStore)
