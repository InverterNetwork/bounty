'use client'

import { Global } from '@emotion/react'
import { getDynamicTheme } from '@/styles/dynamicTheme'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { MagicEvmWalletConnectors } from '@dynamic-labs/magic'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'
import { useTheme } from '@/hooks'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { sepolia } from 'viem/chains'
import { useMemo } from 'react'

const config = createConfig({
  chains: [sepolia],
  multiInjectedProviderDiscovery: false,
  ssr: true,
  transports: {
    [sepolia.id]: http(),
  },
})

export default function ConnectorProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { theme } = useTheme()
  const { cssOverrides, shadowDomOverWrites } = useMemo(
    () => getDynamicTheme(theme === 'light'),
    [theme]
  )

  // RENDER
  return (
    <>
      <Global styles={shadowDomOverWrites} />
      <DynamicContextProvider
        settings={{
          environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ID || '',
          cssOverrides,
          walletConnectors: [
            EthereumWalletConnectors,
            MagicEvmWalletConnectors,
          ],
        }}
      >
        <WagmiProvider config={config}>
          <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
        </WagmiProvider>
      </DynamicContextProvider>
    </>
  )
}
