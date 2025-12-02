import { z } from 'zod'

export const campaignSchema = z.object({
  campaignName: z
    .string()
    .min(3, 'Campaign name must be at least 3 characters')
    .max(100, 'Campaign name must not exceed 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
  goal: z
    .number({ message: 'Funding goal must be a number' })
    .positive('Funding goal must be a positive number')
    .min(1, 'Funding goal must be at least 1 ETH'),
  image: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, 'Image is required')
    .refine(
      (files) => files?.[0]?.size <= 5000000,
      'Image size must be less than 5MB'
    )
    .refine(
      (files) =>
        ['image/jpeg', 'image/jpg', 'image/png'].includes(files?.[0]?.type),
      'Only .jpg, .jpeg, and .png formats are supported'
    )
})

export type CampaignFormData = z.infer<typeof campaignSchema>
