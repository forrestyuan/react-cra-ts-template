import { UrlService } from '@/common/services/url'
import { BrowserEnvService } from '@/common/services/env'

export const urlService = new UrlService()
export const envService = new BrowserEnvService(urlService)