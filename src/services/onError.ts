import { ServerError, NetworkError, BaseError } from '@/common/errors'
import { UserErrorCode } from '@/modules/common/user-store'

import { message } from 'antd'

export const onError = (err: any) => {
  console.log('debug => onError => err', err.code)
  if (err instanceof ServerError) {
    switch (err.code) {
      case UserErrorCode.账号或密码错误:
        message.error('账号或密码错误')
        break
      default:
        console.error(err.name, err.code, err.message)
        break
    }
  } else if (err instanceof NetworkError) {
    message.error('网络异常')
  } else if (err instanceof BaseError) {
    console.error(err.name, err.message, err.stack)
  } else {
    console.error(err)
  }
  throw err
}
