/**
 * 请使用 next.ts
 */
import React, { useState, useEffect, useCallback } from 'react'
import { useBlocker, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Modal } from 'antd'
import Icon from '@/components/Icon'

const DialogQuestionIcon = (
  <Icon
    icon="dialog-question"
    className="anticon anticon-close-circle"
    width="22px"
    height="22px"
  />
)
function CustomBlcoker({ isBlocking, message = '', title = '' }) {
  const { t } = useTranslation(['common'])
  const useCallbackPrompt = (when) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [showPrompt, setShowPrompt] = useState(false)
    const [lastLocation, setLastLocation] = useState(null)
    const [confirmedNavigation, setConfirmedNavigation] = useState(false)

    const cancelNavigation = useCallback(() => {
      setShowPrompt(false)
    }, [])

    const handleBlockedNavigation = useCallback(
      (nextLocation) => {
        if (
          !confirmedNavigation &&
          nextLocation.location.pathname !== location.pathname
        ) {
          setShowPrompt(true)
          setLastLocation(nextLocation)
          return false
        }
        return true
      },
      [confirmedNavigation, location.pathname],
    )

    const confirmNavigation = useCallback(() => {
      setShowPrompt(false)
      setConfirmedNavigation(true)
    }, [])

    useEffect(() => {
      if (confirmedNavigation && lastLocation) {
        navigate(lastLocation.location.pathname)
      }
    }, [confirmedNavigation, lastLocation, navigate])

    useBlocker(handleBlockedNavigation, when)

    return [showPrompt, confirmNavigation, cancelNavigation]
  }

  const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(
    isBlocking,
  )

  useEffect(() => {
    if (showPrompt) {
      Modal.confirm({
        width: '4.1rem',
        className: 'custom-modal-wrap',
        centered: true,
        okText: t('common:confirm'),
        icon: DialogQuestionIcon,
        title: title || t('routerPromptTitle'),
        content: message,
        onOk: confirmNavigation,
        onCancel: cancelNavigation,
      })
    }
  }, [showPrompt, cancelNavigation, confirmNavigation, message, t, title])
  return <></>
}

export default CustomBlcoker
