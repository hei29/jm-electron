import axios, { type InternalAxiosRequestConfig } from 'axios'

interface CancelableRequestConfig extends InternalAxiosRequestConfig { requestId?: string }

class RequestQueue {
  private readonly controllers = new Map<string, AbortController>()

  add = (requestId: string, controller: AbortController): void => { this.controllers.set(requestId, controller) }
  remove = (requestId?: string): void => { if (requestId) this.controllers.delete(requestId) }
  cancelAll = (reason = '路由已切换，取消未完成请求'): void => {
    this.controllers.forEach((controller) => controller.abort(reason))
    this.controllers.clear()
  }
}

export const requestQueue = new RequestQueue()

export const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10_000
})

request.interceptors.request.use((config) => {
  const cancelableConfig = config as CancelableRequestConfig
  const requestId = crypto.randomUUID()
  const controller = new AbortController()
  cancelableConfig.requestId = requestId
  cancelableConfig.signal = controller.signal
  requestQueue.add(requestId, controller)
  return cancelableConfig
})

request.interceptors.response.use(
  (response) => { requestQueue.remove((response.config as CancelableRequestConfig).requestId); return response },
  (error: unknown) => {
    if (axios.isAxiosError(error)) requestQueue.remove((error.config as CancelableRequestConfig | undefined)?.requestId)
    return Promise.reject(error)
  }
)
