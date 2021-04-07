import dayjsDefault from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/zh-hk'
import 'dayjs/locale/en-gb'

import localeData from 'dayjs/plugin/localeData'
import updateLocale from 'dayjs/plugin/updateLocale'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

// import type { Lang } from '@/modules/common/env-store'

dayjsDefault.extend(localeData)
dayjsDefault.extend(updateLocale)
dayjsDefault.extend(isBetween)
dayjsDefault.extend(isSameOrBefore)
dayjsDefault.extend(isSameOrAfter)

// export const changeLocale = (lang: Lang) => {
//   switch (lang) {
//     case 'zh-hans': {
//       dayjsDefault.locale('zh-cn')
//       break
//     }
//     case 'zh-hant': {
//       dayjsDefault.locale('zh-hk')
//       break
//     }
//     case 'en': {
//       dayjsDefault.locale('en-gb')
//       break
//     }
//   }
// }

export const dayjs = dayjsDefault
