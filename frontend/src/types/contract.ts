// Contract types matching the Rust contract

export interface CarbonCredit {
  id: number
  project_id: string
  issuer: string
  verifier: string
  vintage_year: number
  region: string
  quantity: number
  verified: boolean
  retired: boolean
  owner: string
}

export interface MarketListing {
  credit_id: number
  seller: string
  price: string // in stroops
  active: boolean
}

export enum ContractError {
  AlreadyInitialized = 1,
  NotInitialized = 2,
  Unauthorized = 3,
  NotVerifier = 4,
  CreditNotFound = 5,
  AlreadyVerified = 6,
  AlreadyRetired = 7,
  NotOwner = 8,
  ListingNotActive = 9,
  InsufficientPayment = 10,
  InvalidQuantity = 11,
}

// Contract configuration
export const CONTRACT_CONFIG = {
  // Carbon-X deployed contract ID on Stellar testnet
  contractId: process.env.NEXT_PUBLIC_CONTRACT_ID || 'CBF27HVYQFOUSNBCA5I4ZZHKJ536WGMD7OYYTFU7FVIFJ3FC6TKEERRQ',
  networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://soroban-testnet.stellar.org',
}
