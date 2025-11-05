'use client'

import { useState } from 'react'
import { useWallet } from '@/hooks/useWallet'
import { MapPin, Calendar, CheckCircle, ShoppingBag } from 'lucide-react'
import { carbonXService } from '@/services/carbonx'
import { useCreditsStore } from '@/stores/creditsStore'
import { useTransactionsStore } from '@/stores/transactionsStore'

const mockUserCredits = [
  {
    id: 1,
    projectId: 'PROJ-001',
    region: 'Brazil Rainforest',
    vintageYear: 2024,
    quantity: 100,
    verified: true,
    retired: false,
    listed: false,
  },
  {
    id: 5,
    projectId: 'PROJ-005',
    region: 'Thailand Mangrove',
    vintageYear: 2023,
    quantity: 75,
    verified: true,
    retired: false,
    listed: true,
    price: '4.2 XLM',
  },
]

export default function MyCreditsPage() {
  const { isConnected, address } = useWallet()
  const { userCredits, listCreditForSale, retireCredit } = useCreditsStore()
  const { addTransaction } = useTransactionsStore()
  const [listingPrice, setListingPrice] = useState<{ [key: number]: string }>({})
  const [showPriceInput, setShowPriceInput] = useState<{ [key: number]: boolean }>({})

  const handleListForSale = async (creditId: number) => {
    if (!address) {
      alert('Please connect your wallet first')
      return
    }

    const price = listingPrice[creditId]
    if (!price || parseFloat(price) <= 0) {
      alert('Please enter a valid price')
      return
    }

    try {
      await carbonXService.listForSale(address, creditId, price)
      
      // Update local state - add to marketplace
      listCreditForSale(creditId, price, address)
      
      // Record the listing transaction
      const credit = userCredits.find(c => c.id === creditId)
      if (credit) {
        addTransaction({
          type: 'listing',
          creditId,
          projectId: credit.projectId,
          amount: `${price} XLM`,
        })
      }
      
      alert(
        `✅ Credit ${creditId} listed for sale at ${price} XLM!\n\n` +
        `Your wallet: ${address.slice(0, 10)}...${address.slice(-10)}\n\n` +
        `💰 When someone buys this credit, ${price} XLM will be sent directly to your wallet!\n\n` +
        `The credit is now visible in the marketplace.`
      )
      setShowPriceInput({ ...showPriceInput, [creditId]: false })
      setListingPrice({ ...listingPrice, [creditId]: '' })
    } catch (error: any) {
      console.error('Error listing credit:', error)
      alert(`Failed to list credit: ${error.message}`)
    }
  }

  const handleRetireCredit = async (creditId: number) => {
    if (!address) {
      alert('Please connect your wallet first')
      return
    }

    if (!confirm('Are you sure you want to retire this credit? This action cannot be undone.')) {
      return
    }

    try {
      // Update local state
      retireCredit(creditId)
      
      // Record the retirement transaction
      const credit = userCredits.find(c => c.id === creditId)
      if (credit) {
        addTransaction({
          type: 'retirement',
          creditId,
          projectId: credit.projectId,
        })
      }
      
      alert(`✅ Credit ${creditId} retired successfully!\n\nThis credit has been permanently removed from circulation.`)
    } catch (error: any) {
      console.error('Error retiring credit:', error)
      alert(`Failed to retire credit: ${error.message}`)
    }
  }

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Connect Your Wallet
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Please connect your wallet to view your carbon credits
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          My Carbon Credits
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your owned carbon credits
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userCredits.map((credit) => (
          <div key={credit.id} className="card">
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Quantity</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {credit.quantity} tons CO₂
                </p>
              </div>

              {credit.listed && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                      Listed for {credit.price}
                    </span>
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    💰 When sold, XLM will be sent directly to your wallet
                  </p>
                  {credit.seller && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Your address: {credit.seller}
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mt-4">
                {!credit.listed && !credit.retired && (
                  <>
                    {showPriceInput[credit.id] ? (
                      <div className="col-span-2 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="Price in XLM"
                            value={listingPrice[credit.id] || ''}
                            onChange={(e) => setListingPrice({ ...listingPrice, [credit.id]: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-green-500"
                          />
                          <button
                            onClick={() => handleListForSale(credit.id)}
                            className="btn-primary text-sm py-2 px-4 whitespace-nowrap"
                          >
                            Confirm
                          </button>
                        </div>
                        <button
                          onClick={() => setShowPriceInput({ ...showPriceInput, [credit.id]: false })}
                          className="btn-secondary text-sm py-2 w-full"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setShowPriceInput({ ...showPriceInput, [credit.id]: true })}
                        className="btn-primary text-sm py-2"
                      >
                        List for Sale
                      </button>
                    )}
                  </>
                )}
                {!credit.retired && (
                  <button 
                    onClick={() => handleRetireCredit(credit.id)}
                    className="btn-secondary text-sm py-2"
                  >
                    Retire
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {userCredits.length === 0 && (
        <div className="text-center py-20 card">
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            You don't own any carbon credits yet
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Visit the marketplace to purchase credits
          </p>
        </div>
      )}
    </div>
  )
}
