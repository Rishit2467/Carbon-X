'use client'

import { useState } from 'react'
import { useWallet } from '@/hooks/useWallet'
import { MapPin, Calendar, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RetirePage() {
  const { isConnected } = useWallet()
  const [selectedCreditId, setSelectedCreditId] = useState<number | null>(null)

  const handleRetire = async () => {
    if (!selectedCreditId) {
      toast.error('Please select a credit to retire')
      return
    }

    try {
      // Call smart contract retire function
      toast.success('Carbon credit retired successfully!')
      setSelectedCreditId(null)
    } catch (error) {
      toast.error('Failed to retire credit')
      console.error(error)
    }
  }

  const retiredCredits = [
    {
      id: 10,
      projectId: 'PROJ-010',
      region: 'Amazon Forest',
      vintageYear: 2022,
      quantity: 50,
      retiredBy: 'GXXXX...XXXX',
      retiredAt: '2024-01-15',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Retire Carbon Credits
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Permanently retire carbon credits to offset your carbon footprint.
          Retired credits cannot be traded or transferred.
        </p>
      </div>

      {isConnected ? (
        <>
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Retire a Credit
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Credit to Retire
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">Choose a credit...</option>
                  <option value="1">PROJ-001 - 100 tons CO₂</option>
                  <option value="5">PROJ-005 - 75 tons CO₂</option>
                </select>
              </div>

              <button
                onClick={handleRetire}
                className="btn-primary w-full"
              >
                Retire Credit
              </button>
            </div>
          </div>

          <div className="card bg-yellow-50 dark:bg-yellow-900/20">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
              ⚠️ Important
            </h3>
            <p className="text-yellow-800 dark:text-yellow-200">
              Retiring a carbon credit is permanent and cannot be undone. The credit will be 
              removed from circulation and recorded on-chain as retired.
            </p>
          </div>
        </>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Connect your wallet to retire credits
          </p>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Recently Retired Credits
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {retiredCredits.map((credit) => (
            <div key={credit.id} className="card bg-gray-50 dark:bg-gray-900">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {credit.projectId}
                    </h3>
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs font-medium rounded-full">
                      Retired
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4 mr-2" />
                      {credit.region}
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4 mr-2" />
                      Vintage: {credit.vintageYear}
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{credit.quantity} tons CO₂</span> retired on {credit.retiredAt}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
