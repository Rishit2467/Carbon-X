'use client'

import { ArrowRight, Shield, TrendingUp, Recycle } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-28">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block">Decentralized Carbon Credits</span>
                <span className="block text-primary-600">On Stellar Blockchain</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Trade, verify, and retire carbon credits with transparency and trust. 
                Join the future of sustainable climate action on the Stellar network.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 gap-4">
                <Link
                  href="/marketplace"
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/registry"
                  className="btn-secondary inline-flex items-center space-x-2"
                >
                  <span>Register Credits</span>
                </Link>
              </div>
            </div>
          </main>

          {/* Features */}
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="flex justify-center">
                <Shield className="w-12 h-12 text-primary-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                Verified Credits
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                All credits are verified by authorized validators on-chain
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center">
                <TrendingUp className="w-12 h-12 text-primary-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                Transparent Trading
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Decentralized marketplace with fair pricing and instant settlement
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center">
                <Recycle className="w-12 h-12 text-primary-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                Permanent Retirement
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Retire credits permanently with immutable on-chain proof
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
