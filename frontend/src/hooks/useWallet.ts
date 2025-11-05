import { create } from 'zustand'
import * as freighterApi from '@stellar/freighter-api'

interface WalletState {
  address: string | null
  isConnected: boolean
  publicKey: string | null
  connect: (address: string) => void
  connectFreighter: () => Promise<void>
  disconnect: () => void
  signTransaction: (xdr: string, networkPassphrase: string) => Promise<string>
}

// Robust Freighter connection checker
export const checkFreighterConnection = async (): Promise<{
  isInstalled: boolean
  isAllowed: boolean
}> => {
  console.log('🔍 Checking Freighter connection...')
  
  try {
    // Check if Freighter extension is installed
    const isInstalled = await freighterApi.isConnected()
    console.log(`✅ Freighter wallet ${isInstalled ? 'IS' : 'IS NOT'} installed`)
    
    if (isInstalled) {
      try {
        // Check if user has previously authorized this dapp
        const isAllowed = await freighterApi.isAllowed()
        console.log(`✅ User ${isAllowed ? 'HAS' : 'HAS NOT'} previously authorized this dapp`)
        return { isInstalled: true, isAllowed }
      } catch (error) {
        console.log('⚠️ Could not check authorization status:', error)
        return { isInstalled: true, isAllowed: false }
      }
    }
    
    return { isInstalled: false, isAllowed: false }
  } catch (error) {
    console.error('❌ Error checking Freighter connection:', error)
    return { isInstalled: false, isAllowed: false }
  }
}

export const useWallet = create<WalletState>((set, get) => ({
  address: null,
  isConnected: false,
  publicKey: null,
  
  connect: (address: string) => {
    // Validate Stellar address format (should start with G and be 56 characters)
    const isValidAddress = address.startsWith('G') && address.length === 56
    
    if (isValidAddress) {
      set({ address, isConnected: true })
      console.log('✅ Wallet connected:', address)
    } else {
      alert('Invalid Stellar address. Address should start with "G" and be 56 characters long.')
    }
  },

  connectFreighter: async () => {
    try {
      if (typeof window === 'undefined') {
        console.error('Running on server side')
        return
      }

      console.log('🔥 STARTING FREIGHTER CONNECTION PROCESS')
      
      // Show loading message
      alert('🔍 Detecting Freighter wallet...\n\nThis may take a few seconds.\nPlease wait...')
      
      // Check Freighter status
      const status = await checkFreighterConnection()
      
      if (!status.isInstalled) {
        console.error('💥 FREIGHTER NOT INSTALLED')
        
        alert(
          '❌ FREIGHTER NOT DETECTED\n\n' +
          '1️⃣ Install Freighter:\n' +
          '   → Visit https://freighter.app\n\n' +
          '2️⃣ Enable the extension\n\n' +
          '3️⃣ Refresh this page\n\n' +
          '4️⃣ If using Brave:\n' +
          '   → Click 🦁 icon in address bar\n' +
          '   → Turn OFF "Block scripts"\n' +
          '   → Refresh (Ctrl+Shift+R)'
        )
        
        if (confirm('Open Freighter download page?')) {
          window.open('https://www.freighter.app/', '_blank')
        }
        return
      }

      console.log('✅ FREIGHTER INSTALLED!')
      
      // Request wallet address (will show Freighter popup if not previously allowed)
      console.log('📞 Requesting address from Freighter...')
      const walletAddress = await freighterApi.requestAccess()
      console.log('✅ Received address:', walletAddress)
      
      // Get public key
      console.log('📞 Requesting public key...')
      const walletPublicKey = await freighterApi.getPublicKey()
      console.log('✅ Received public key:', walletPublicKey)
      
      // Update store
      set({ 
        address: walletAddress, 
        publicKey: walletPublicKey, 
        isConnected: true 
      })
      
      console.log('✅ WALLET CONNECTED SUCCESSFULLY!')
      
      alert(
        '✅ WALLET CONNECTED!\n\n' +
        `Address: ${walletAddress.slice(0, 10)}...${walletAddress.slice(-10)}\n\n` +
        'You can now:\n' +
        '• Browse carbon credits\n' +
        '• Purchase credits with XLM\n' +
        '• Retire credits'
      )
      
    } catch (error: any) {
      console.error('💥 ERROR IN FREIGHTER CONNECTION:', error)
      
      let errorMessage = '❌ CONNECTION ERROR\n\n'
      
      if (error.message?.includes('User declined') || 
          error.message?.includes('rejected') || 
          error.message?.includes('denied')) {
        errorMessage += 
          'You declined the connection request.\n\n' +
          'To connect:\n' +
          '1. Click "Freighter" button\n' +
          '2. When popup appears, click "APPROVE"\n' +
          '3. Do NOT click "Reject"'
      } else if (error.message?.includes('unlock')) {
        errorMessage += 
          'Freighter is locked.\n\n' +
          'Please unlock it and try again.'
      } else {
        errorMessage += 
          `Error: ${error.message}\n\n` +
          'Try:\n' +
          '1. Refresh page (Ctrl+R)\n' +
          '2. Disable browser shields/blockers\n' +
          '3. Check browser console (F12) for details\n' +
          '4. Restart browser'
      }
      
      alert(errorMessage)
    }
  },

  signTransaction: async (xdr: string, networkPassphrase: string) => {
    const address = get().address
    if (!address) {
      throw new Error('No wallet connected')
    }

    try {
      console.log('📝 Signing transaction with Freighter...')
      const signedXdr = await freighterApi.signTransaction(xdr, {
        networkPassphrase,
        accountToSign: address,
      })
      console.log('✅ Transaction signed successfully')
      return signedXdr
    } catch (error) {
      console.error('❌ Error signing transaction:', error)
      throw error
    }
  },
  
  disconnect: () => {
    set({ address: null, publicKey: null, isConnected: false })
    console.log('👋 Wallet disconnected')
  },
}))
