import { MapPin, Calendar, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useWallet } from '@/hooks/useWallet'
import { carbonXService } from '@/services/carbonx'
import { useCreditsStore } from '@/stores/creditsStore'
import { useTransactionsStore } from '@/stores/transactionsStore'
import toast from 'react-hot-toast'

interface Credit {
  id: number
  projectId: string
  region: string
  vintageYear: number
  quantity: number
  price?: string
  verified: boolean
  seller?: string
  owner?: string
}

interface CreditCardProps {
  credit: Credit
}

export function CreditCard({ credit }: CreditCardProps) {
  const { address, isConnected } = useWallet()
  const { purchaseCredit } = useCreditsStore()
  const { addTransaction } = useTransactionsStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleBuy = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!address) {
      toast.error('Wallet address not found')
      return
    }

    if (!credit.price) {
      toast.error('Price not available')
      return
    }

    if (!credit.owner) {
      toast.error('Seller address not available')
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading('Building transaction...')
    
    try {
      // Extract XLM amount from price string (e.g., "5.5 XLM" -> 5.5)
      const priceXLM = parseFloat(credit.price.replace(' XLM', ''))
      
      // Get the signTransaction function from wallet
      const { signTransaction } = useWallet.getState()
      
      toast.loading('Please approve the transaction in Freighter...', { id: loadingToast })
      
      // Call the buy function with actual payment - send XLM to seller's wallet
      await carbonXService.buyCredit(address, credit.owner, credit.id, priceXLM, signTransaction)
      
      // Update local store - remove from marketplace and add to user credits
      purchaseCredit(credit.id, address)
      
      // Record the transaction
      addTransaction({
        type: 'purchase',
        creditId: credit.id,
        projectId: credit.projectId,
        amount: credit.price,
        from: address,
        to: credit.owner,
      })
      
      toast.success(`Successfully purchased ${credit.quantity} tons CO₂ for ${credit.price}!`, { id: loadingToast })
      
      // Show XLM payment confirmation
      setTimeout(() => {
        toast.success(`💰 ${credit.price} sent to seller's wallet: ${credit.seller}`, {
          icon: '✅',
          duration: 5000,
        })
      }, 500)
      
    } catch (error: any) {
      console.error('Purchase failed:', error)
      
      if (error.message?.includes('User declined')) {
        toast.error('Transaction cancelled', { id: loadingToast })
      } else if (error.message?.includes('Freighter')) {
        toast.error('Please install and unlock Freighter wallet', { id: loadingToast })
      } else {
        toast.error('Purchase failed. Please try again.', { id: loadingToast })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {credit.projectId}
        </h3>
        {credit.verified && (
          <CheckCircle className="w-6 h-6 text-green-500" />
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{credit.region}</span>
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-sm">Vintage: {credit.vintageYear}</span>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Quantity</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {credit.quantity} tons CO₂
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
              <p className="text-lg font-bold text-primary-600">
                {credit.price}
              </p>
            </div>
          </div>
        </div>

        {credit.seller && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-xs">
            <p className="text-blue-900 dark:text-blue-100">
              Seller: {credit.seller}
            </p>
            <p className="text-blue-700 dark:text-blue-300 mt-1">
              💰 Payment will be sent directly to seller's wallet
            </p>
          </div>
        )}

        <button 
          onClick={handleBuy}
          disabled={isLoading || !isConnected}
          className="btn-primary w-full text-center mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : isConnected ? 'Buy Credit' : 'Connect Wallet to Buy'}
        </button>
      </div>
    </div>
  )
}
