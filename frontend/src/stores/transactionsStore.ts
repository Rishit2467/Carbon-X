import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Transaction {
  id: string
  type: 'sale' | 'purchase' | 'listing' | 'retirement'
  creditId: number
  projectId: string
  amount?: string
  from?: string
  to?: string
  timestamp: number
  txHash?: string
}

interface TransactionsState {
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void
  getTransactionsByType: (type: Transaction['type']) => Transaction[]
}

export const useTransactionsStore = create<TransactionsState>()(
  persist(
    (set, get) => ({
      transactions: [],

      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
        }

        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }))

        return newTransaction
      },

      getTransactionsByType: (type) => {
        return get().transactions.filter(tx => tx.type === type)
      },
    }),
    {
      name: 'carbonx-transactions-storage',
    }
  )
)
