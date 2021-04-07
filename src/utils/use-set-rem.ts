import { useLifecycles } from 'react-use'
import _debounce from 'lodash.debounce'

/**
 * 设置html元素font-size，rem自适应
 * @param {*} pwidth 设计稿的宽度
 * @param {*} prem 换算比例
 */
class Px2Rem {
  oWidth: number = 1440
  pwidth: number = 1440
  prem: number = 100
  constructor(pwidth: number, prem: number) {
    this.pwidth = pwidth
    this.prem = prem
  }
  setRem = (): void => {
    let html = document.getElementsByTagName('html')[0]
    let oWidth =
      document.body.clientWidth || document.documentElement.clientWidth
    this.oWidth = oWidth > 1440 ? 1440 : oWidth < 800 ? 800 : oWidth
    html.style.fontSize = (this.oWidth / this.pwidth) * this.prem + 'px'
  }

  getPxByRem = (rem: number) => (this.oWidth / this.pwidth) * this.prem * rem
}

export const px2Rem = new Px2Rem(1440, 100)

const setRemFunc = () => px2Rem.setRem()
const resizeHandler = _debounce(setRemFunc, 200)

export const useSetRem = () => {
  useLifecycles(
    () => {
      setRemFunc()
      window.addEventListener('resize', resizeHandler)
    },
    () => {
      window.removeEventListener('resize', resizeHandler)
    },
  )
}
