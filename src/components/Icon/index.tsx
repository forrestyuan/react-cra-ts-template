import styles from './index.module.scss'
import React, { CSSProperties } from 'react'
import { translatePxToRem } from '@/utils'

const images = {}
const requireImage = require.context(
  // 其组件目录的相对路径
  '../../assets/Icon',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /icon-(\w|-)+\.(png|svg|jpeg|jpg)$/i,
)

requireImage.keys().forEach((fileName: string) => {
  // 获取组件配置
  const imageConfig = requireImage(fileName)
  const ImagePathArr = (fileName as string).split('/')
  const ImageNameWithExt = ImagePathArr.pop()
  const ImageName = (ImageNameWithExt as string).replace(/\.\w+$/, '')

  images[ImageName] = imageConfig.default || imageConfig
})

interface IconProps {
  onClick?: (...args: any) => any
  className?: string
  icon?: string
  src?: string
  size?: string
  width?: string | number
  height?: string | number
  style?: CSSProperties
}

const Icon: React.FC<IconProps> = (props) => {
  const { className, icon, width, height, style = {}, src, ...reset } = props
  let sizeClass = 'esop-icon-size_mini'
  switch (props.size) {
    case 'mini':
      //16*16
      sizeClass = 'esop-icon-size_mini'
      break
    case 'small':
      //32*32
      sizeClass = 'esop-icon-size_small'
      break
    case 'medium':
      // 48*48
      sizeClass = 'esop-icon-size_medium'
      break
    case 'large':
      //64*64
      sizeClass = 'esop-icon-size_large'
      break
    default:
      sizeClass = 'esop-icon-size_mini'
      break
  }

  let _src = src || images['icon-' + icon]

  // hack: pxToRem 单位转换
  let _width = translatePxToRem(width || style.width)
  let _height = translatePxToRem(height || style.height)

  if (!_width || !_height) {
    if (!_width) {
      _width = _height
    } else {
      _height = _width
    }
  }

  let _styles: CSSProperties = {
    ...style,
    width: _width,
    height: _height,
  }

  let _ClassNames = `${(styles['esop-icon'], styles[sizeClass], className)}`
  return (
    <img
      className={_ClassNames}
      src={_src}
      style={_styles}
      {...reset}
      alt=""
    ></img>
  )
}

export default Icon
export { Icon }
