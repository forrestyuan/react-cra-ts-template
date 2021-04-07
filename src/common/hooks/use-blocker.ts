import React from 'react'
import { Modal } from 'antd'
import { useBlocker } from 'react-router'

export const useCustomBlocker = (
  predShouldPrompt: boolean | (() => boolean) = true,
  title: string,
  icon: React.ReactElement,
  message: string,
  okText: string,
) => {
  const shouldPrompt =
    typeof predShouldPrompt === 'boolean'
      ? predShouldPrompt
      : predShouldPrompt()

  // retry 有歧义啊 这个明明是continue的意思....
  useBlocker(({ retry }) => {
    Modal.confirm({
      width: '4.1rem',
      className: 'custom-modal-wrap',
      centered: true,
      okText: okText,
      icon: icon,
      title: title,
      content: message,
      onOk() {
        retry()
      },
    })
  }, shouldPrompt)
}
