import type { CampaignMetadata } from '@/types/campaign'

export function CampaignImage({
  campaign
}: {
  campaign: CampaignMetadata | null
}) {
  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 aspect-video">
        {campaign?.imageUrl ? (
          <img
            src={campaign.imageUrl}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📸</div>
              <p>No image available</p>
            </div>
          </div>
        )}
      </div>

      {campaign?.ipfsUri && (
        <div className="p-4 border rounded-lg bg-muted/50">
          <h3 className="font-semibold mb-2">IPFS Storage</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">CID:</span>
              <p className="font-mono break-all">{campaign.cid}</p>
            </div>
            <a
              href={campaign.ipfsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              View on IPFS →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
