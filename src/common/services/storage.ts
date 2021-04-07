// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface StorageKey<T> extends String {}

type Name<T> = StorageKey<T> | string

class StorageService {
  private storage: Storage

  constructor(type: 'local' | 'session') {
    switch (type) {
      case 'local': {
        this.storage = localStorage
        break
      }
      case 'session': {
        this.storage = sessionStorage
        break
      }
    }
  }

  private getKeyFromName<T>(name: Name<T>) {
    if (name instanceof String) {
      return name.toString()
    }
    return name
  }

  get<T>(name: Name<T>): T | undefined
  get<T>(name: Name<T>, defaultValue: T): T
  get<T>(name: Name<T>, defaultValue?: T): T | undefined {
    const item = this.storage.getItem(this.getKeyFromName(name))
    if (item !== null && item !== '') {
      return JSON.parse(item)
    }
    return defaultValue
  }

  set<T>(name: Name<T>, value: T) {
    this.storage.setItem(this.getKeyFromName(name), JSON.stringify(value))
  }

  remove<T>(name: Name<T>) {
    this.storage.removeItem(this.getKeyFromName(name))
  }

  clear() {
    this.storage.clear()
  }
}

export const localStorageService = new StorageService('local')
export const sessionStorageService = new StorageService('session')
