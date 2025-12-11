import type { CampaignMetadata } from '@/types/campaign'

type Props = {
  campaign: CampaignMetadata['data'] | undefined
}
export function CampaignInfo({ campaign }: Props) {
  if (!campaign) return null

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-semibold mb-4">Campaign Details</h3>

      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <span className="text-muted-foreground">Creator:</span>
          <span className="font-mono text-sm break-all text-right max-w-[200px]">
            {campaign.creator}
          </span>
        </div>

        {campaign.createdAt && (
          <div className="flex justify-between items-start">
            <span className="text-muted-foreground">Created:</span>
            <span>
              {new Date(campaign.createdAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
