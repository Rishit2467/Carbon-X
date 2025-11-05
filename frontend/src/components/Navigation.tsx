'use client'

import { useWallet } from '@/hooks/useWallet'
import { Leaf, Wallet } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { FreighterStatus } from './FreighterStatus'

export function Navigation() {
  const { address, connect, connectFreighter, disconnect, isConnected } = useWallet()
  const [showInput, setShowInput] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = () => {
    if (walletAddress.trim()) {
      connect(walletAddress.trim())
      setShowInput(false)
      setWalletAddress('')
    }
  }

  const handleFreighterConnect = async () => {
    setIsConnecting(true)
    try {
      await connectFreighter()
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              Carbon-X
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 dark:text-gray-200 hover:text-primary-600">
              Home
            </Link>
            <Link href="/marketplace" className="text-gray-700 dark:text-gray-200 hover:text-primary-600">
              Marketplace
            </Link>
            <Link href="/registry" className="text-gray-700 dark:text-gray-200 hover:text-primary-600">
              Registry
            </Link>
            <Link href="/my-credits" className="text-gray-700 dark:text-gray-200 hover:text-primary-600">
              My Credits
            </Link>
            <Link href="/retire" className="text-gray-700 dark:text-gray-200 hover:text-primary-600">
              Retire Credits
            </Link>
          </div>

          {/* Wallet Connection */}
          <div className="flex flex-col items-end space-y-1">
            <FreighterStatus />
            <div>
            {isConnected ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <button
                  onClick={disconnect}
                  className="btn-secondary"
                >
                  Disconnect
                </button>
              </div>
            ) : showInput ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Paste wallet address (G...)"
                  className="text-sm py-2 px-3 w-64 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleConnect()}
                  autoFocus
                />
                <button
                  onClick={handleConnect}
                  className="btn-primary py-2"
                >
                  Connect
                </button>
                <button
                  onClick={() => setShowInput(false)}
                  className="btn-secondary py-2"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleFreighterConnect}
                  disabled={isConnecting}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Wallet className="w-4 h-4" />
                  <span>{isConnecting ? 'Connecting...' : 'Freighter'}</span>
                </button>
                <button
                  onClick={() => setShowInput(true)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <span>Manual</span>
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
