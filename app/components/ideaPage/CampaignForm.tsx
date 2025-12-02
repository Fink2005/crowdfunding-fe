import { useMediaQuery } from '@/apis/queries/media'
import { useSendTelegramNotification } from '@/apis/queries/telegram'
import { campaignRequests } from '@/apis/requests/campaign'
import TelegramDialog from '@/components/ideaPage/TelegramDialog'
import { Button } from '@/components/ui/button'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { contractAbi, contractAddress } from '@/contract/ContractClient'
import { campaignSchema, type CampaignFormData } from '@/schema/campaign'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { decodeEventLog, parseEther } from 'viem'
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'

const CampaignForm = () => {
  const [image, setImage] = useState<{ url: string; isUploading: boolean }>({
    url: '',
    isUploading: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  useState<CampaignFormData | null>(null)
  const { isConnected, address } = useAccount()

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      campaignName: '',
      description: '',
      goal: undefined
    }
  })

  // Watch file input
  const imageFiles = form.watch('image')

  // Request signed URL
  const { data: signed } = useMediaQuery({
    fileName: imageFiles && imageFiles[0]?.name,
    fileType: imageFiles && imageFiles[0]?.type
  })

  // Handle image upload
  useEffect(() => {
    ;(async () => {
      if (imageFiles && imageFiles[0]) {
        setImage((prev) => ({ ...prev, isUploading: true }))

        const reader = new FileReader()
        reader.onloadend = () => {
          setImage((prev) => ({ ...prev, url: reader.result as string }))
        }
        reader.readAsDataURL(imageFiles[0])

        try {
          if (signed) {
            await fetch(signed.signedUrl, {
              method: 'PUT',
              headers: { 'Content-Type': imageFiles[0].type },
              body: imageFiles[0]
            })
            toast.success('Image uploaded!')
          }
        } catch (err) {
          toast.error('Upload failed')
        } finally {
          const publicUrl = `https://cdn.fundhive.pro.vn/cdn-cgi/image/quality=75/${imageFiles[0].name}`
          setImage({ url: publicUrl, isUploading: false })
        }
      }
    })()
  }, [imageFiles, signed])

  // Wagmi hooks
  const { data: txHash, writeContract, error: writeError } = useWriteContract()

  const { data: receipt, isSuccess: txSuccess } = useWaitForTransactionReceipt({
    hash: txHash
  })

  const { data: creationFee } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'creationFee',
    query: { enabled: isConnected }
  })

  const { mutate: sendNotification } = useSendTelegramNotification()

  useEffect(() => {
    ;(async () => {
      if (!txSuccess || !receipt) return

      try {
        const log = receipt.logs[0]

        const event = decodeEventLog({
          abi: contractAbi,
          data: log.data,
          topics: log.topics
        }) as { args?: Record<string, any> }

        if (!event.args) {
          throw new Error('Invalid event args')
        }

        const campaignId = Number(event.args.id)
        const campaignName = form.getValues('campaignName')
        const goal = form.getValues('goal')

        await campaignRequests.createCampaign({
          campaignId,
          title: campaignName,
          description: form.getValues('description'),
          imageUrl: image.url,
          creator: address as `0x${string}`
        })

        // Send Telegram notification
        sendNotification({
          address: address as string,
          message: `🎉 <b>Campaign Created Successfully!</b>\n\n🎯 Campaign: <b>${campaignName}</b>\n💰 Goal: <b>${goal} ETH</b>\n🆔 Campaign ID: <code>${campaignId}</code>\n\nYour campaign is now live! Share it with your network to start receiving contributions. 🚀`,
          campaignId: String(campaignId)
        })

        toast.success('Create campaign success!')
        form.reset()
        setIsSubmitting(false)
      } catch (err) {
        console.error('Decode error:', err)
        toast.error('Failed to decode event')
      }
    })()
  }, [txSuccess, receipt])

  // 🛑 Transaction error
  useEffect(() => {
    if (writeError) {
      toast.error(writeError.message || 'Transaction failed')
      setIsSubmitting(false)
    }
  }, [writeError])

  const onSubmit = async (data: CampaignFormData) => {
    if (!isConnected) return toast.error('Connect your wallet')
    createCampaign(data)
  }

  const createCampaign = (data: CampaignFormData) => {
    const goalInWei = parseEther(String(data.goal))
    const durationInSeconds = BigInt(7 * 24 * 60 * 60)
    const fee = BigInt(creationFee!.toString())

    setIsSubmitting(true)

    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'createCampaign',
      args: [goalInWei, durationInSeconds],
      value: fee
    })

    toast.info('Waiting for confirmation...')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 overflow-auto">
      <h1 className="text-3xl font-bold mb-2">Kickstart Your Idea</h1>
      <p className="text-muted-foreground mb-8">
        Create your crowdfunding project and bring your vision to life
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Campaign Name */}
          <FormField
            control={form.control}
            name="campaignName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campaign Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Goal */}
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goal (ETH)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <FormField
            control={form.control}
            name="image"
            render={({ field: { value, onChange, ...props } }) => (
              <FormItem>
                <FormLabel>Campaign Image</FormLabel>
                <FormControl>
                  <div className="border-2 border-dashed p-6 rounded-lg relative min-h-[300px] flex items-center justify-center">
                    {image.isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <LoaderCircle className="animate-spin" size={40} />
                      </div>
                    )}
                    <input
                      {...props}
                      type="file"
                      className="hidden"
                      id="img-upload"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files)}
                    />
                    <label
                      htmlFor="img-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      {image.url ? (
                        <img
                          src={image.url}
                          className="max-h-56 object-cover rounded"
                        />
                      ) : (
                        <p>Click to upload</p>
                      )}
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button
            disabled={isSubmitting || !isConnected}
            type="submit"
            className="w-full"
          >
            {!isConnected
              ? 'Connect Wallet First'
              : isSubmitting
                ? 'Creating...'
                : 'Create Campaign'}
          </Button>
        </form>
      </Form>

      {!localStorage.getItem('telegram_connected') && (
        <TelegramDialog address={address as any} />
      )}
    </div>
  )
}

export default CampaignForm
