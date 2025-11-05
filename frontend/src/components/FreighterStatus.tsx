'use client'

import { useEffect, useState } from 'react'
import { checkFreighterConnection } from '@/hooks/useWallet'

export function FreighterStatus() {
  const [status, setStatus] = useState<{
    isInstalled: boolean
    isAllowed: boolean
    checked: boolean
  }>({
    isInstalled: false,
    isAllowed: false,
    checked: false,
  })

  // Check Freighter connection when component mounts
  useEffect(() => {
    const checkConnection = async () => {
      const result = await checkFreighterConnection()
      setStatus({
        ...result,
        checked: true,
      })
    }

    checkConnection()
  }, []) // Empty dependency array = runs once on mount

  if (!status.checked) {
    return (
      <div className="text-sm text-gray-500">
        Checking Freighter...
      </div>
    )
  }

  return (
    <div className="text-sm">
      {status.isInstalled ? (
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          <span className="text-green-600 dark:text-green-400">
            Freighter Installed
          </span>
          {status.isAllowed && (
            <span className="text-xs text-gray-500">(Authorized)</span>
          )}
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
          <span className="text-red-600 dark:text-red-400">
            Freighter Not Installed
          </span>
        </div>
      )}
    </div>
  )
}
