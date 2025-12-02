import { telegramRequests } from '@/apis/requests/telegram'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useState } from 'react'
const TelegramDialog = ({ address }: { address: `0x${string}` }) => {
  const [showTelegramDialog, setShowTelegramDialog] = useState(true)
  const handleConnectTelegram = async () => {
    const res = await telegramRequests.connectBot(address)
    window.open(res, '_blank')
    localStorage.setItem('telegram_connected', 'true')
    setShowTelegramDialog(false)
  }

  const handleSkipTelegram = () => {
    setShowTelegramDialog(false)
  }
  return (
    <Dialog open={showTelegramDialog} onOpenChange={setShowTelegramDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Telegram for Notifications</DialogTitle>
          <DialogDescription>
            Connect your Telegram account to receive real-time updates about
            your campaign, including new donations, milestones, and important
            notifications.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Click the button below to start a conversation with our bot and
            enable notifications.
          </p>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleSkipTelegram}
            className="w-full sm:w-auto"
          >
            Skip for now
          </Button>
          <Button onClick={handleConnectTelegram} className="w-full sm:w-auto">
            Connect Telegram
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TelegramDialog
