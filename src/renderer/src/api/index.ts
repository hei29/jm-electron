import { request } from '../utils/request'

export const api = {
  search: (keyword: string) => request.get('/search', { params: { keyword } })
}
