import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { LoaderCircle } from 'lucide-react'
import { formatEther } from 'viem'

export function ContributeDialog({
  open,
  onOpenChange,
  campaignTitle,
  contributeAmount,
  setContributeAmount,
  contributionFee,
  isContributing,
  onConfirm
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaignTitle: string
  contributeAmount: string
  setContributeAmount: (amount: string) => void
  contributionFee: bigint | undefined
  isContributing: boolean
  onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contribute to {campaignTitle}</DialogTitle>
          <DialogDescription>
            Enter the amount you want to contribute to this campaign.
            {contributionFee && (
              <span className="block mt-2 text-sm">
                Note: A fee of {formatEther(contributionFee)} ETH will be added
                to your contribution.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Amount (ETH)
            </label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={contributeAmount}
              onChange={(e) => setContributeAmount(e.target.value)}
              disabled={isContributing}
            />
          </div>

          {contributeAmount && contributionFee && (
            <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contribution:</span>
                <span className="font-semibold">{contributeAmount} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fee:</span>
                <span className="font-semibold">
                  {formatEther(contributionFee)} ETH
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">Total:</span>
                <span className="font-bold">
                  {(
                    parseFloat(contributeAmount) +
                    parseFloat(formatEther(contributionFee))
                  ).toFixed(4)}{' '}
                  ETH
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isContributing}
          >
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isContributing}>
            {isContributing ? (
              <>
                <LoaderCircle className="animate-spin mr-2" size={16} />
                Contributing...
              </>
            ) : (
              'Confirm Contribution'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
