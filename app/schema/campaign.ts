import { z } from 'zod'

export const campaignSchema = z.object({
  campaignName: z
    .string()
    .min(3, 'Campaign name must be at least 3 characters')
    .max(100, 'Campaign name must not exceed 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(3000, 'Description must not exceed 3000 characters'),
  goal: z.float32().positive('Goal must be a positive number'),
  deadline: z
    .number()
    .int('Deadline must be a whole number')
    .min(1, 'Deadline must be at least 1 day')
    .max(60, 'Deadline cannot exceed 60 days'),
  image: z
    .custom<FileList>(
      (files) => typeof FileList !== 'undefined' && files instanceof FileList,
      { message: 'Image is required' }
    )
    .refine((files) => files.length === 1, 'Image is required')
    .refine(
      (files) => files[0].size <= 5_000_000,
      'Image size must be less than 5MB'
    )
    .refine(
      (files) =>
        ['image/jpeg', 'image/jpg', 'image/png'].includes(files[0].type),
      'Only .jpg, .jpeg, and .png formats are supported'
    )
})

export type CampaignFormData = z.infer<typeof campaignSchema>
