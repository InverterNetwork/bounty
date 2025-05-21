'use client'

// Third-party dependencies
import { HttpTransport } from 'viem'
import { optimism } from 'viem/chains'
import { WagmiProvider, createConfig } from 'wagmi'

// Dynamic Labs SDK imports
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import {
  DynamicContextProvider,
  DynamicUserProfile,
} from '@dynamic-labs/sdk-react-core'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'

// Local imports
import { dynamicTheme } from '@/styles/dynamic-theme'
import { getERPCTransport, viemChainsToDynamic } from '@/utils'

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
const config = createConfig({
  chains: chains,
  multiInjectedProviderDiscovery: false,
  transports: chains.reduce(
    (acc, chain) => {
      acc[chain.id] = getERPCTransport(chain.id)
      return acc
    },
    {} as Record<number, HttpTransport>
  ),
  ssr: true,
  cacheTime: 5000, // 5 seconds
})

// ============================================================================
// Main Component
// ============================================================================

export function ConnectorProvider({ children }: { children: React.ReactNode }) {
  // State management
  const { shadowDomOverWrites, cssOverrides } = dynamicTheme

  // Render provider hierarchy
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: shadowDomOverWrites }} />
      <DynamicContextProvider
        settings={{
          environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ID || '',
          cssOverrides,
          walletConnectors: [EthereumWalletConnectors],
          initialAuthenticationMode: 'connect-only',
          overrides: {
            // Network override handler to merge dashboard and initial networks
            evmNetworks: viemChainsToDynamic(chains),
          },
        }}
      >
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
