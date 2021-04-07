import React from 'react'
// import { useTranslation } from 'react-i18next'
import Icon from '@/components/Icon'
import { useCustomBlocker } from '@/common/hooks/use-blocker'

const DialogQuestionIcon = (
  <Icon
    icon="dialog-question"
    className="anticon anticon-close-circle"
    width="22px"
    height="22px"
  />
)
export interface propT {
  isBlocking: boolean | (() => boolean)
  title?: string
  icon?: React.ReactElement
  message?: string
  okText?: string
}

function CustomBlcoker(props: propT) {
  // const { t } = useTranslation(['common', 'prepare'])
  const title = props.title ?? '确认退出？'
  const icon = props.icon ?? DialogQuestionIcon
  const message = props.message ?? '退出后将不会保存数据！'
  const okText = props.okText ?? '确认'
  useCustomBlocker(props.isBlocking, title, icon, message, okText)
  return <></>
}

export default CustomBlcoker
