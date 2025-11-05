'use client'

import { MapPin, Calendar, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const mockCredits = [
  {
    id: 1,
    projectId: 'PROJ-001',
    region: 'Brazil Rainforest',
    vintageYear: 2024,
    quantity: 100,
    price: '5.5 XLM',
    verified: true,
  },
  {
    id: 2,
    projectId: 'PROJ-002',
    region: 'Kenya Solar Farm',
    vintageYear: 2024,
    quantity: 250,
    price: '4.8 XLM',
    verified: true,
  },
  {
    id: 3,
    projectId: 'PROJ-003',
    region: 'India Wind Energy',
    vintageYear: 2023,
    quantity: 500,
    price: '3.2 XLM',
    verified: true,
  },
]

export function FeaturedCredits() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Featured Carbon Credits
        </h2>
        <Link href="/marketplace" className="text-primary-600 hover:text-primary-700 font-medium">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCredits.map((credit) => (
          <div key={credit.id} className="card hover:shadow-xl transition-shadow">
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

              <Link
                href={`/marketplace/${credit.id}`}
                className="btn-primary w-full text-center mt-4"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
