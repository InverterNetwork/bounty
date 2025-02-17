'use client'

// React imports
import { useRef, useState, useEffect, useMemo } from 'react'

// Third-party dependencies
import { isEqual } from 'lodash'
import { Chain, HttpTransport } from 'viem'
import { WagmiProvider, createConfig } from 'wagmi'

// Dynamic Labs SDK imports
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import {
  DynamicContextProps,
  DynamicContextProvider,
  DynamicUserProfile,
  mergeNetworks,
} from '@dynamic-labs/sdk-react-core'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'

// Local imports
import { dynamicTheme } from '@/styles/dynamic-theme'
import {
  dynamicChainsToViem,
  viemChainsToDynamic,
  getDrpcTransport,
} from '@/utils'
import { optimism } from 'viem/chains'

// ============================================================================
// Constants & Configuration
// ============================================================================

// Supported blockchain networks
const chains = [optimism] as const

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Creates Wagmi configuration with specified chains and transport settings
 */
const getConfig = (chains: readonly [Chain, ...Chain[]]) =>
  createConfig({
    chains: chains,
    multiInjectedProviderDiscovery: false,
    transports: chains.reduce(
      (acc, chain) => {
        acc[chain.id] = getDrpcTransport(chain.id)
        return acc
      },
      {} as Record<number, HttpTransport>
    ),
    ssr: true,
    cacheTime: 5000, // 5 seconds
  })

// Shared events and initial state
const networkChangeEvent = new Event('evmNetworksChanged')
const initialEvmNetworks = viemChainsToDynamic(chains)

// ============================================================================
// Main Component
// ============================================================================

export function ConnectorProvider({ children }: { children: React.ReactNode }) {
  // State management
  const evmNetworks = useRef(initialEvmNetworks)
  const [networkVersion, setNetworkVersion] = useState(0)
  const { shadowDomOverWrites, cssOverrides } = dynamicTheme

  // Network change event listener
  useEffect(() => {
    const handleNetworkChange = () => setNetworkVersion((v) => v + 1)
    window.addEventListener('evmNetworksChanged', handleNetworkChange)
    return () =>
      window.removeEventListener('evmNetworksChanged', handleNetworkChange)
  }, [])

  // Memoized configurations
  const config = useMemo(
    () => getConfig(dynamicChainsToViem(evmNetworks.current)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [networkVersion]
  )

  const settings = useMemo(
    () =>
      ({
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ID || '',
        cssOverrides,
        walletConnectors: [EthereumWalletConnectors],
        initialAuthenticationMode: 'connect-only',
        overrides: {
          // Network override handler to merge dashboard and initial networks
          evmNetworks: (dashboardNetworks) => {
            const newNetworks = mergeNetworks(
              dashboardNetworks,
              initialEvmNetworks
            )
            if (!isEqual(evmNetworks.current, newNetworks)) {
              evmNetworks.current = newNetworks
              requestAnimationFrame(() =>
                window.dispatchEvent(networkChangeEvent)
              )
            }
            return evmNetworks.current
          },
        },
      }) as const satisfies DynamicContextProps['settings'],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [networkVersion]
  )

  // Render provider hierarchy
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: shadowDomOverWrites }} />
      <DynamicContextProvider settings={settings}>
        <WagmiProvider config={config} reconnectOnMount>
          <DynamicWagmiConnector>
            {children}
            <DynamicUserProfile variant="modal" />
          </DynamicWagmiConnector>
        </WagmiProvider>
      </DynamicContextProvider>
    </>
  )
}
