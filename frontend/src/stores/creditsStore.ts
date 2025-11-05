import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CreditData {
  id: number
  projectId: string
  region: string
  vintageYear: number
  quantity: number
  verified: boolean
  retired: boolean
  listed: boolean
  price?: string
  seller?: string
  owner?: string
}

interface CreditsState {
  userCredits: CreditData[]
  marketplaceCredits: CreditData[]
  
  // Actions
  listCreditForSale: (creditId: number, price: string, ownerAddress: string) => void
  retireCredit: (creditId: number) => void
  purchaseCredit: (creditId: number, buyerAddress: string) => void
  addUserCredit: (credit: CreditData) => void
}

// Initial user credits
const initialUserCredits: CreditData[] = [
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
    listed: false,
  },
  {
    id: 7,
    projectId: 'PROJ-007',
    region: 'Norway Reforestation',
    vintageYear: 2024,
    quantity: 200,
    verified: true,
    retired: false,
    listed: false,
  },
]

// Initial marketplace credits
const initialMarketplaceCredits: CreditData[] = [
  {
    id: 2,
    projectId: 'PROJ-002',
    region: 'Kenya Solar Farm',
    vintageYear: 2024,
    quantity: 250,
    price: '4.8 XLM',
    verified: true,
    seller: 'GXXXX...YYYY',
    retired: false,
    listed: true,
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
    retired: false,
    listed: true,
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
    retired: false,
    listed: true,
  },
]

export const useCreditsStore = create<CreditsState>()(
  persist(
    (set, get) => ({
      userCredits: initialUserCredits,
      marketplaceCredits: initialMarketplaceCredits,

      listCreditForSale: (creditId: number, price: string, ownerAddress: string) => {
        set((state) => {
          // Find credit in user's credits
          const creditIndex = state.userCredits.findIndex(c => c.id === creditId)
          
          if (creditIndex === -1) {
            console.error('Credit not found in user credits')
            return state
          }

          const credit = state.userCredits[creditIndex]
          
          // Update the credit as listed
          const updatedUserCredits = [...state.userCredits]
          updatedUserCredits[creditIndex] = {
            ...credit,
            listed: true,
            price: `${price} XLM`,
            seller: ownerAddress.slice(0, 5) + '...' + ownerAddress.slice(-4),
            owner: ownerAddress,
          }

          // Add to marketplace
          const marketplaceCredit = {
            ...updatedUserCredits[creditIndex],
          }

          return {
            userCredits: updatedUserCredits,
            marketplaceCredits: [...state.marketplaceCredits, marketplaceCredit],
          }
        })
      },

      retireCredit: (creditId: number) => {
        set((state) => {
          // Update in user credits
          const updatedUserCredits = state.userCredits.map(credit =>
            credit.id === creditId
              ? { ...credit, retired: true, listed: false }
              : credit
          )

          // Remove from marketplace if listed
          const updatedMarketplaceCredits = state.marketplaceCredits.filter(
            credit => credit.id !== creditId
          )

          return {
            userCredits: updatedUserCredits,
            marketplaceCredits: updatedMarketplaceCredits,
          }
        })
      },

      purchaseCredit: (creditId: number, buyerAddress: string) => {
        set((state) => {
          // Find credit in marketplace
          const credit = state.marketplaceCredits.find(c => c.id === creditId)
          
          if (!credit) {
            console.error('Credit not found in marketplace')
            return state
          }

          // Remove from marketplace
          const updatedMarketplaceCredits = state.marketplaceCredits.filter(
            c => c.id !== creditId
          )

          // Add to buyer's credits (unlisted)
          const purchasedCredit = {
            ...credit,
            listed: false,
            price: undefined,
            seller: undefined,
            owner: buyerAddress,
          }

          return {
            marketplaceCredits: updatedMarketplaceCredits,
            userCredits: [...state.userCredits, purchasedCredit],
          }
        })
      },

      addUserCredit: (credit: CreditData) => {
        set((state) => ({
          userCredits: [...state.userCredits, credit],
        }))
      },
    }),
    {
      name: 'carbonx-credits-storage',
    }
  )
)
