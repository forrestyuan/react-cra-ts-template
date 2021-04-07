import axiosDefault, {
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
} from 'axios'
import { NetworkError } from '../../errors'

export interface BaseHttpRequestConfig {
  baseUrl?: string
  headers?: any
  params?: any
  data?: any
  withCredentials?: boolean
  timeout?: number
  httpsAgent?: any
  responseType?: AxiosRequestConfig['responseType']
  onUploadProgress?: AxiosRequestConfig['onUploadProgress']
  onDownloadProgress?: AxiosRequestConfig['onDownloadProgress']
}

export const defaultBaseHttpRequestConfig: BaseHttpRequestConfig = {
  withCredentials: true,
  timeout: 10000,
}

export abstract class CoreHttp {
  abstract get<RES>(path: string, options?: BaseHttpRequestConfig): Promise<RES>
  abstract post<RES, DATA = any>(
    path: string,
    data?: DATA,
    options?: BaseHttpRequestConfig,
  ): Promise<RES>
  abstract put<RES, DATA = any>(
    path: string,
    data?: DATA,
    options?: BaseHttpRequestConfig,
  ): Promise<RES>
}

function verifyHttpStatusCode(status: number) {
  return status >= 200 && status < 400
}

export class AxiosHttp extends CoreHttp {
  axios: AxiosInstance
  constructor(options = defaultBaseHttpRequestConfig) {
    super()
    const {
      baseUrl,
      headers,
      params,
      timeout = defaultBaseHttpRequestConfig.timeout,
      withCredentials = defaultBaseHttpRequestConfig.withCredentials,
      httpsAgent,
    } = options
    this.axios = axiosDefault.create({
      baseURL: baseUrl,
      timeout,
      withCredentials,
      headers,
      params,
      httpsAgent,
    })
  }

  private handleResponse<T>(res: AxiosResponse<T>) {
    if (verifyHttpStatusCode(res.status)) {
      return res.data
    }
    throw new NetworkError(res.statusText, res.status)
  }

  get<RES>(path: string, options = defaultBaseHttpRequestConfig) {
    return this.axios.get<RES>(path, options).then(this.handleResponse)
  }

  post<RES, DATA = any>(
    path: string,
    data?: DATA,
    options = defaultBaseHttpRequestConfig,
  ) {
    return this.axios.post<RES>(path, data, options).then(this.handleResponse)
  }

  put<RES, DATA = any>(
    path: string,
    data?: DATA,
    options = defaultBaseHttpRequestConfig,
  ) {
    return this.axios.put<RES>(path, data, options).then(this.handleResponse)
  }
}
