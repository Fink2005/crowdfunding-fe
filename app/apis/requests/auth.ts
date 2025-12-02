import { apiClient } from '@/apis/axios'

export const authRequests = {
  login: (data: { address: string; nonce: string; signature: string }) =>
    apiClient.post('/auth/login', data),
  getMessageNonce: (address: string) =>
    apiClient.post('/auth/message-nonce', { address })
}
