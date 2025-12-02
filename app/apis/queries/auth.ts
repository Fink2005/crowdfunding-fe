import { authRequests } from '@/apis/requests/auth'
import { useMutation } from '@tanstack/react-query'
import { useSignMessage } from 'wagmi'

export const { signMessage } = useSignMessage({
  mutation: {
    onSuccess(signature) {
      console.log('✅ Signature:', signature)
    },
    onError(error) {
      console.error('❌ Sign error:', error)
    }
  }
})

export const useLogin = () => {
  return useMutation({
    mutationFn: async (payload: {
      address: string
      nonce: string
      signature: string
    }) => authRequests.login(payload)
  })
}
