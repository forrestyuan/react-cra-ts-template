import React from 'react'

import Icon from '@ant-design/icons'

import { ReactComponent as AddSvg } from '@/assets/antd-svg-icons/add.svg'
import { ReactComponent as ClosedSvg } from '@/assets/antd-svg-icons/close.svg'
import { ReactComponent as TrashSvg } from '@/assets/antd-svg-icons/Trash.svg'
import { ReactComponent as DeleteCrossSvg } from '@/assets/antd-svg-icons/delete-cross.svg'
import { ReactComponent as ResetDisabledSvg } from '@/assets/antd-svg-icons/reset-disabled.svg'
import { ReactComponent as ResetNormalSvg } from '@/assets/antd-svg-icons/reset-normal.svg'
import { ReactComponent as Notification } from '@/assets/antd-svg-icons/notification.svg'
import { ReactComponent as Notification_new } from '@/assets/antd-svg-icons/notification_new.svg'
import { ReactComponent as notification_empty } from '@/assets/antd-svg-icons/notification_empty.svg'
import { ReactComponent as warning } from '@/assets/antd-svg-icons/warning.svg'
import { ReactComponent as ToDoNotice } from '@/assets/antd-svg-icons/to_do_notice.svg'
import { ReactComponent as Success_rd } from '@/assets/antd-svg-icons/success_rd.svg'
import { ReactComponent as Vest_plan } from '@/assets/antd-svg-icons/vest_plan.svg'
import { ReactComponent as Vest_name } from '@/assets/antd-svg-icons/vest_name.svg'
import { ReactComponent as Vest_date } from '@/assets/antd-svg-icons/vest_date.svg'
import { ReactComponent as Account } from '@/assets/antd-svg-icons/account.svg'
import { ReactComponent as FileDownload } from '@/assets/antd-svg-icons/file-download.svg'
import { ReactComponent as FilePreview } from '@/assets/antd-svg-icons/file-preview.svg'

interface CustomIconProps {
  onClick?: (...args: any) => any
  style?: React.CSSProperties
  className?: string
}

export const AddIcon = generateIcon(AddSvg)
export const ClosedIcon = generateIcon(ClosedSvg)
export const TrashIcon = generateIcon(TrashSvg)
export const DeleteCrossIcon = generateIcon(DeleteCrossSvg)
export const ResetDisabledIcon = generateIcon(ResetDisabledSvg)
export const ResetNormalIcon = generateIcon(ResetNormalSvg)
export const NotificationIcon = generateIcon(Notification)
export const NotificationNewsIcon = generateIcon(Notification_new)
export const NotificationEmptyIcon = generateIcon(notification_empty)
export const WarningIcon = generateIcon(warning)
export const ToDoNoticeIcon = generateIcon(ToDoNotice)
export const SuccessRdIcon = generateIcon(Success_rd)
export const VestPlanIcon = generateIcon(Vest_plan)
export const VestNameIcon = generateIcon(Vest_name)
export const VestDateIcon = generateIcon(Vest_date)
export const AccountIcon = generateIcon(Account)

export const FileDownloadIcon = generateIcon(FileDownload)
export const FilePreviewIcon = generateIcon(FilePreview)
export function generateIcon(svgComponent: React.ComponentType) {
  const MyIcon: React.FC<CustomIconProps> = (props) => {
    return <Icon {...props} component={svgComponent} />
  }
  return MyIcon
}
