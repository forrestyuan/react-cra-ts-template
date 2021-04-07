import { entries } from 'mobx'

let _utils = {}

export function typeofVariable(value) {
  let typeString = Object.prototype.toString.call(value)
  let type = typeString.slice(8, -1)
  return type
}

_utils.objectFilter = function (obj, predicate) {
  var result = {},
    key

  for (key in obj) {
    if (obj.hasOwnProperty(key) && predicate(obj[key], key)) {
      result[key] = obj[key]
    }
  }

  return result
}

_utils.getUrlObj = function (encodeSearch) {
  let urlObj = {}
  let search = decodeURIComponent(encodeSearch)
  if (search.length) {
    let queryStr = search.indexOf('?') > -1 ? search.split('?')[1] : search
    let queryArr = queryStr.length ? queryStr.split('&') : []
    queryArr.map((item) => {
      if (item.indexOf('=') > -1) {
        let tmpArr = item.split('=')
        urlObj[tmpArr[0]] = tmpArr[1]
      } else {
        urlObj[item] = ''
      }
      return item
    })
  }
  return urlObj
}

_utils.obj2query = function (obj) {
  var result = ''
  var item
  for (item in obj) {
    if (obj[item] !== undefined) {
      result += '&' + item + '=' + encodeURIComponent(obj[item])
    }
  }
  if (result) {
    result = result.slice(1)
  }
  return result
}

_utils.isEmpty = function (value, nozero = false) {
  return (
    value === undefined ||
    value === null ||
    Number.isNaN(value) ||
    (typeof value === 'string' && _utils.trim(value) === '') ||
    (nozero && value === 0)
  )
}

_utils.formatEmptyData = function (val) {
  return _utils.isEmpty(val) ? '--' : val
}

/**
 * 去掉空格
 */
//去左空格;
_utils.ltrim = function (s) {
  if (s === undefined || s === null) {
    return s
  }
  return s.replace(/(^\s*)/g, '')
}
//去右空格;
_utils.rtrim = function (s) {
  if (s === undefined || s === null) {
    return s
  }
  return s.replace(/(\s*$)/g, '')
}
//去左右空格;
_utils.trim = function (s) {
  if (s === undefined || s === null) {
    return s
  }
  return s.replace(/(^\s*)|(\s*$)/g, '')
}

export function getDevice() {
  let UserAgent = navigator.userAgent.toLowerCase()
  let browserMap = {
    IE: window.ActiveXObject || 'ActiveXObject' in window, // IE
    Chrome:
      UserAgent.indexOf('chrome') > -1 && UserAgent.indexOf('safari') > -1, // Chrome浏览器
    Firefox: UserAgent.indexOf('firefox') > -1, // 火狐浏览器
    Opera: UserAgent.indexOf('opera') > -1, // Opera浏览器
    Safari:
      UserAgent.indexOf('safari') > -1 && UserAgent.indexOf('chrome') === -1, // safari浏览器
    Edge: UserAgent.indexOf('edge') > -1, // Edge浏览器
    QQBrowser: /qqbrowser/.test(UserAgent), // qq浏览器
    WeixinBrowser: /MicroMessenger/i.test(UserAgent), // 微信浏览器
  }
  let OSMap = {
    Windows: navigator.platform === 'Win32' || navigator.platform === 'Windows',
    Mac:
      navigator.platform === 'Mac68K' ||
      navigator.platform === 'MacPPC' ||
      navigator.platform === 'Macintosh' ||
      navigator.platform === 'MacIntel',
    iphone: UserAgent.indexOf('iPhone') > -1,
    ipod: UserAgent.indexOf('iPod') > -1,
    ipad: UserAgent.indexOf('iPad') > -1,
    Android: UserAgent.indexOf('Android') > -1,
  }
  let returnData = {}
  for (let key in browserMap) {
    if (browserMap[key]) {
      returnData.browser = key
    }
  }
  for (let key in OSMap) {
    if (OSMap[key]) {
      returnData.platform = key
    }
  }
  returnData.lang = navigator.language
  return returnData
}

_utils.getLanguage = function () {
  let language = localStorage.getItem('language')
  const lang = navigator.language || navigator.userLanguage // 常规浏览器语言和IE浏览器
  language = language || lang
  language = language.replace(/-/, '_').toLowerCase()
  if (language === 'zh_cn' || language === 'zh') {
    language = 'zh_hans'
  } else if (language === 'zh_tw' || language === 'zh_hk') {
    language = 'zh_hant'
  } else {
    language = 'en'
  }
  return language
}

/**
 * 对象key排序
 * @param {*} obj
 * @returns
 */
_utils.objectKeySort = function (obj = {}) {
  if (Object.prototype.toString.call(obj) !== '[object Object]') {
    obj = {}
  }
  let newkey = Object.keys(obj).sort()
  let newObj = {}
  newkey.map((key) => (newObj[key] = obj[key]))
  return newObj
}

/**
 * 将number每三位添加一个","
 * @param {Number | string} number
 */
export function numberToComma(number) {
  let _number = Number.parseInt(number)
  if (Number.isNaN(_number) || typeofVariable(_number) !== 'Number') {
    return number
  }

  let numStr = number + ''
  let numArr = numStr.split('.')
  let int = numArr[0]
  let float = numArr[1] || ''

  int = int.replace(/(\d)(?=(\d{3})+$)/g, '$1,')
  return int + (float !== '' ? '.' : '') + float
}

export function translatePxToRem(value) {
  if (!value) {
    return value
  }

  if (!Number.isNaN(Number(value)) || value.indexOf('px') !== -1) {
    let parseFloat = Number.parseFloat || window.parseFloat
    let v = parseFloat(value)
    let result = v / 100
    return result + 'rem'
  } else {
    return value
  }
}

export function labelFinder(
  options,
  value,
  { valueProp = 'value', labelProp = 'label' } = {},
) {
  let label = value
  if (options instanceof Array) {
    let finder = options.find((option) => option[valueProp] === value)
    label = finder ? finder[labelProp] : value
  }
  return label
}

export function addBase64Prefix(str) {
  return 'data:image/png;base64,' + str
}

export default _utils

export const compare = (p, v) => (p & v) === v

export const mobxEntriesFormat = (item) => {
  let result = {}
  entries(item).map((v) => (result[v[0]] = v[1]))
  return result
}
