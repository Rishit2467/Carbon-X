'use client'

import { useState } from 'react'
import { useWallet } from '@/hooks/useWallet'
import toast from 'react-hot-toast'

export default function RegistryPage() {
  const { address, isConnected } = useWallet()
  const [formData, setFormData] = useState({
    projectId: '',
    issuer: '',
    vintageYear: new Date().getFullYear(),
    region: '',
    quantity: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    try {
      // Call smart contract to register credit
      toast.success('Carbon credit registered successfully!')
      // Reset form
      setFormData({
        projectId: '',
        issuer: '',
        vintageYear: new Date().getFullYear(),
        region: '',
        quantity: '',
      })
    } catch (error) {
      toast.error('Failed to register credit')
      console.error(error)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Register Carbon Credit
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Register a new carbon credit batch for verification and trading.
          Only authorized verifiers can register credits.
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project ID
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., PROJ-001"
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Issuer Address
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Stellar address (G...)"
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Vintage Year
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={formData.vintageYear}
              onChange={(e) => setFormData({ ...formData, vintageYear: parseInt(e.target.value) })}
              min="2000"
              max={new Date().getFullYear()}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Region
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., Brazil Rainforest"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quantity (tons of CO₂)
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., 100"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              min="1"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={!isConnected}
          >
            {isConnected ? 'Register Carbon Credit' : 'Connect Wallet to Register'}
          </button>
        </form>
      </div>

      <div className="card bg-blue-50 dark:bg-blue-900/20">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          ℹ️ Verifier Requirements
        </h3>
        <p className="text-blue-800 dark:text-blue-200">
          Only whitelisted verifiers can register carbon credits. If you need to become 
          a verifier, please contact the platform administrator.
        </p>
      </div>
    </div>
  )
}
