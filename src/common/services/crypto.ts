// sjcl没有md5哈希算法, 因此采用crypto-js, 同时用了aes加密(默认cbc mode, Pkcs7 padding)
import CryptoJS from 'crypto-js'
// npm包的版本没有cbc mode, 只能用自己build的版本, 主要使用pbkdf2(默认哈希算法就是hmac256)
import sjcl from '../utils/sjcl'
import { v1 as uuid_v1 } from 'uuid'

sjcl.beware[
  "CBC mode is dangerous because it doesn't protect message integrity."
]()

/**
 * 本模块变量后缀:
 * raw: 原始字符串, utf-8, 用来表示原始的data
 * hex: 十六进制字符串, 用来传输key, iv, salt, auth等
 * bits: 二进制数组, 用在sjcl内部
 */
export class CryptoService {
  constructor(ivHex: string) {
    this.ivHex = ivHex
  }

  // iv信息是从configService得到的
  private ivHex: string

  // 将数字转为hex字符串
  private numberToHex(num: number, digits = 4) {
    const bytes: number[] = []
    let i = digits
    do {
      bytes[--i] = num & 255
      num = num >> 8
    } while (i)
    // 这个reverse主要涉及到 https://developer.mozilla.org/en-US/docs/Glossary/Endianness
    return bytes.reverse().reduce<string>((prev, curr) => {
      let s = (curr & 0xff).toString(16)
      return prev + (s.length < 2 ? `0${s}` : s)
    }, '')
  }

  private rawDataToString<T>(raw: T) {
    let str: string
    if (typeof raw !== 'string') {
      str = JSON.stringify(raw)
    } else {
      str = raw
    }
    return str
  }

  /**
   * aes解密 返回解密的数据
   *
   * @param encryptedDataBase64 加密的数据, base64格式
   * @param keyHex 加解密需要的key, hex字符串格式
   */
  aesDecrypt<T>(encryptedDataBase64: string, keyHex: string): T {
    const resultRawString = CryptoJS.AES.decrypt(
      encryptedDataBase64,
      CryptoJS.enc.Hex.parse(keyHex),
      {
        iv: CryptoJS.enc.Hex.parse(this.ivHex),
      },
    ).toString(CryptoJS.enc.Utf8)
    return JSON.parse(resultRawString)
  }

  /**
   * aes加密 返回base64字符串
   *
   * @param dataRaw 要加密的数据, 如果非字符串会被JSON.stringify
   * @param keyHex 加解密需要的key, hex字符串格式
   */
  aesEncrypt<T>(dataRaw: T, keyHex: string) {
    const result = CryptoJS.AES.encrypt(
      this.rawDataToString(dataRaw),
      CryptoJS.enc.Hex.parse(keyHex),
      {
        iv: CryptoJS.enc.Hex.parse(this.ivHex),
      },
    ).toString()
    return result
  }

  hmacSha256<T>(dataRaw: T, keyHex: string) {
    const result = CryptoJS.HmacSHA256(
      this.rawDataToString(dataRaw),
      CryptoJS.enc.Hex.parse(keyHex),
    ).toString()
    return result
  }

  /** 获取指定位数(Byte)的随机hex字符串 */
  genRndKeyHex(/** 多少Byte */ num = 32) {
    return CryptoJS.lib.WordArray.random(num).toString()
  }

  /** pbkdf2加密迭代次数 */
  private iterations = 10000
  /** pbkdf2加密key size */
  private keySize = 256

  /** s1 = pbkdf2(password, salt) */
  getS1Hex(passwordRaw: string, saltHex: string) {
    const s1 = sjcl.misc.pbkdf2(
      sjcl.codec.hex.toBits(
        // sjcl没有MD5
        CryptoJS.MD5(passwordRaw).toString(),
      ),
      sjcl.codec.hex.toBits(saltHex),
      this.iterations,
      this.keySize,
    )
    return sjcl.codec.hex.fromBits(s1)
  }

  /** s2 = pbkdf2(uin + s1), salt) */
  getS2Hex(passwordRaw: string, saltHex: string, uin: number | string) {
    const s1Hex = this.getS1Hex(passwordRaw, saltHex)
    const s2 = sjcl.misc.pbkdf2(
      sjcl.codec.hex.toBits(this.numberToHex(+uin) + s1Hex),
      sjcl.codec.hex.toBits(saltHex),
      this.iterations,
      this.keySize,
    )
    return sjcl.codec.hex.fromBits(s2)
  }

  /** auth = aes(aver + uin + s1 + timestamp + rndKey, s2) */
  getAuthHex(passwordRaw: string, saltHex: string, uin: number, aver: number) {
    const dataHex =
      this.numberToHex(aver) +
      this.numberToHex(uin) +
      this.getS1Hex(passwordRaw, saltHex) +
      this.numberToHex(Math.floor(new Date().getTime() / 1000), 8) +
      this.genRndKeyHex()

    const keyBits = sjcl.codec.hex.toBits(
      this.getS2Hex(passwordRaw, saltHex, uin),
    )
    const authBits = sjcl.mode.cbc.encrypt(
      new sjcl.cipher.aes(keyBits),
      sjcl.codec.hex.toBits(dataHex),
      sjcl.codec.hex.toBits(this.ivHex),
    )
    return sjcl.codec.hex.fromBits(authBits)
  }

  getAuth2Hex(
    passwordRaw: string,
    saltHex: string,
    uin: number,
    aver: number,
    loginRndKey: string,
  ) {
    const tradeRndKeyHex = this.genRndKeyHex()
    const dataHex =
      this.numberToHex(aver) +
      this.numberToHex(uin) +
      this.getS1Hex(passwordRaw, saltHex) +
      this.numberToHex(Math.floor(new Date().getTime() / 1000), 8) +
      tradeRndKeyHex

    const keyBits = sjcl.codec.hex.toBits(
      this.getS2Hex(passwordRaw, saltHex, uin),
    )
    const authBits = sjcl.mode.cbc.encrypt(
      new sjcl.cipher.aes(keyBits),
      sjcl.codec.hex.toBits(dataHex),
      sjcl.codec.hex.toBits(this.ivHex),
    )
    // auth2 用loginRndKey 加密
    const auth2Base64 = CryptoJS.AES.encrypt(
      CryptoJS.enc.Hex.parse(sjcl.codec.hex.fromBits(authBits)),
      CryptoJS.enc.Hex.parse(loginRndKey),
      {
        iv: CryptoJS.enc.Hex.parse(this.ivHex),
      },
    ).toString()
    //base64 转hex
    const auth2HEX = CryptoJS.enc.Hex.stringify(
      CryptoJS.enc.Base64.parse(auth2Base64),
    ).toUpperCase()
    //data  需要auth加密
    return [auth2HEX, tradeRndKeyHex]
  }

  aesEncryptWithTrade<T>(
    passwordRaw: string,
    dataRaw: T,
    saltHex: string,
    uin: number,
    aver: number,
    loginRndKey: string,
  ): [string, string, string] {
    const tradeRndKeyHex = this.genRndKeyHex()
    const dataHex =
      this.numberToHex(aver) +
      this.numberToHex(uin) +
      this.getS1Hex(passwordRaw, saltHex) +
      this.numberToHex(Math.floor(new Date().getTime() / 1000), 8) +
      tradeRndKeyHex

    const keyBits = sjcl.codec.hex.toBits(
      this.getS2Hex(passwordRaw, saltHex, uin),
    )
    const authBits = sjcl.mode.cbc.encrypt(
      new sjcl.cipher.aes(keyBits),
      sjcl.codec.hex.toBits(dataHex),
      sjcl.codec.hex.toBits(this.ivHex),
    )
    // auth2 用loginRndKey 加密
    const auth2Base64 = CryptoJS.AES.encrypt(
      CryptoJS.enc.Hex.parse(sjcl.codec.hex.fromBits(authBits)),
      CryptoJS.enc.Hex.parse(loginRndKey),
      {
        iv: CryptoJS.enc.Hex.parse(this.ivHex),
      },
    ).toString()
    //base64 转hex
    const auth2HEX = CryptoJS.enc.Hex.stringify(
      CryptoJS.enc.Base64.parse(auth2Base64),
    ).toUpperCase()
    //data  需要auth加密
    const resultRowString = this.aesEncrypt(dataRaw, tradeRndKeyHex)
    return [auth2HEX, resultRowString, tradeRndKeyHex]
  }

  /** newPasswordAuth = aes(newPassword, s2) */
  getNewPasswordAuthHex(newPassword: string, s2Hex: string) {
    return CryptoJS.enc.Hex.stringify(
      CryptoJS.enc.Base64.parse(this.aesEncrypt(newPassword, s2Hex)),
    )
  }

  /** Create a version 1 (timestamp) UUID */
  uuid_v1() {
    return uuid_v1()
  }

  sha256Encrypt<T>(dataRaw: T) {
    return CryptoJS.SHA256(this.rawDataToString(dataRaw)).toString()
  }
}
