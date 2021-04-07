// npm 包其实已经有types定义了, 因为npm包的sjcl的aes算法没有cbc mode, 所以使用本地build版本, 同时引用types的定义

import sjcl from 'sjcl'

// 扩展下types定义
declare module 'sjcl' {
  export const beware: {
    "CBC mode is dangerous because it doesn't protect message integrity.": () => void
  }
}

export default sjcl
