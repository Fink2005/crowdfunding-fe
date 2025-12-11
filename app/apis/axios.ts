import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
})

export default api

export const apiClient = {
  get: (url: string, params?: any) => api.get(url, { params }),
  post: (url: string, body: any) => api.post(url, body),
  put: (url: string, body: any) => api.put(url, body),
  delete: (url: string) => api.delete(url)
}
