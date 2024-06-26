'use client'

import { getWorkflow } from '@/lib/getWorkflow'
import { useQuery } from '@tanstack/react-query'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'

const defaultOrchestratorAddress = process.env
  .NEXT_PUBLIC_ORCHESTRATOR_ADDRESS as `0x${string}` | undefined

export default function useWorkflowHandler(
  orchestratorAddress = defaultOrchestratorAddress
) {
  const publicClient = usePublicClient()
  const walletClient = useWalletClient()
  const { address, chainId, isConnected } = useAccount()

  const workflow = useQuery({
    queryKey: ['workflow', orchestratorAddress, chainId, address],
    queryFn: () => {
      const res = getWorkflow(publicClient!, orchestratorAddress!, walletClient)
      return res
    },
    enabled:
      !!chainId &&
      !!orchestratorAddress &&
      (walletClient.isError || walletClient.isSuccess),
  })
  return {
    ...workflow,
    isConnected,
    address,
    publicClient,
  }
}

export type WorkflowQuery = ReturnType<typeof useWorkflowHandler>
