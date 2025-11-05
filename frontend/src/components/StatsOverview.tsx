'use client'

import { useQuery } from '@tanstack/react-query'
import { TrendingUp, ShoppingCart, CheckCircle, Users } from 'lucide-react'

export function StatsOverview() {
  // This would fetch real data from your contract
  const stats = {
    totalCredits: 1250,
    activeListings: 89,
    retiredCredits: 456,
    verifiedProjects: 34,
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Credits</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {stats.totalCredits.toLocaleString()}
            </p>
          </div>
          <TrendingUp className="w-10 h-10 text-primary-600" />
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Listings</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {stats.activeListings}
            </p>
          </div>
          <ShoppingCart className="w-10 h-10 text-blue-600" />
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Retired Credits</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {stats.retiredCredits.toLocaleString()}
            </p>
          </div>
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Verified Projects</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {stats.verifiedProjects}
            </p>
          </div>
          <Users className="w-10 h-10 text-purple-600" />
        </div>
      </div>
    </div>
  )
}
