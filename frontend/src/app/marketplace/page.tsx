'use client'

import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { CreditCard } from '@/components/CreditCard'
import { useCreditsStore } from '@/stores/creditsStore'

const mockMarketplaceCredits = [
  {
    id: 1,
    projectId: 'PROJ-001',
    region: 'Brazil Rainforest',
    vintageYear: 2024,
    quantity: 100,
    price: '5.5 XLM',
    verified: true,
    seller: 'GXXXX...XXXX',
  },
  {
    id: 2,
    projectId: 'PROJ-002',
    region: 'Kenya Solar Farm',
    vintageYear: 2024,
    quantity: 250,
    price: '4.8 XLM',
    verified: true,
    seller: 'GXXXX...YYYY',
  },
  {
    id: 3,
    projectId: 'PROJ-003',
    region: 'India Wind Energy',
    vintageYear: 2023,
    quantity: 500,
    price: '3.2 XLM',
    verified: true,
    seller: 'GXXXX...ZZZZ',
  },
  {
    id: 4,
    projectId: 'PROJ-004',
    region: 'Costa Rica Forest',
    vintageYear: 2024,
    quantity: 150,
    price: '6.0 XLM',
    verified: true,
    seller: 'GXXXX...AAAA',
  },
]

export default function MarketplacePage() {
  const { marketplaceCredits } = useCreditsStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')

  // Filter credits based on search and region
  const filteredCredits = marketplaceCredits.filter(credit => {
    const matchesSearch = credit.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credit.region.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRegion = selectedRegion === 'all' || 
                         credit.region.toLowerCase().includes(selectedRegion.replace('-', ' '))
    
    return matchesSearch && matchesRegion
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Carbon Credit Marketplace
        </h1>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by project ID..."
              className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="all">All Regions</option>
            <option value="brazil">Brazil</option>
            <option value="kenya">Kenya</option>
            <option value="india">India</option>
            <option value="costa-rica">Costa Rica</option>
          </select>

          <button className="btn-primary flex items-center justify-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>

      {/* Credit Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCredits.length > 0 ? (
          filteredCredits.map((credit) => (
            <CreditCard key={credit.id} credit={credit} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 card">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              No credits found matching your criteria
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
