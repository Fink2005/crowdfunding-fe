import { telegramRequests } from '@/apis/requests/telegram'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle
} from '@/components/ui/dialog'
import { useState } from 'react'

type TelegramDialogProps = {
  address: `0x${string}`
  onClose?: () => void
  title?: string
  description?: string
}

const TelegramDialog = ({
  address,
  onClose,
  title = 'Connect Telegram for Notifications',
  description = 'Connect your Telegram account to receive real-time updates about your campaign, including new donations, milestones, and important notifications.'
}: TelegramDialogProps) => {
  const [showTelegramDialog, setShowTelegramDialog] = useState(true)
  const handleConnectTelegram = async () => {
    const res = await telegramRequests.connectBot(address)
    window.open(res, '_blank')
    setShowTelegramDialog(false)
    onClose?.()
  }

  const handleSkipTelegram = () => {
    setShowTelegramDialog(false)
    onClose?.()
  }
  return (
    <Dialog
      open={showTelegramDialog}
      onOpenChange={(open) => {
        setShowTelegramDialog(open)
        if (!open) onClose?.()
      }}
    >
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="bg-blue-500 p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-4xl">📱</div>
            <DialogTitle className="text-2xl font-bold text-white">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-blue-50 text-base">
            {description}
          </DialogDescription>
        </div>

        {/* Content section */}
        <div className="p-6 space-y-4">
          <div className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="text-2xl">✨</div>
              <div>
                <h4 className="font-semibold text-sm mb-1">What you'll get:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Instant
                    notifications for new contributions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Goal achivement alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Real-time campaign
                    updates
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
            <span className="text-lg">🔒</span>
            <p>
              Your privacy is protected. We only send campaign-related
              notifications.
            </p>
          </div>
        </div>

        {/* Footer with buttons */}
        <DialogFooter className="p-6 pt-0 flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handleSkipTelegram}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleConnectTelegram}
            className="w-full sm:w-auto bg-blue-500 text-white order-1 sm:order-2"
          >
            <span className="mr-2">🚀</span>
            Connect Telegram
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TelegramDialog
