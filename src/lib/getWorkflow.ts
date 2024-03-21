import { abis } from '@inverter-network/abis'
import { getContract } from 'viem'
import type {
  UsePublicClientReturnType,
  UseWalletClientReturnType,
} from 'wagmi'

export const getWorkflow = async (
  publicClient: NonNullable<UsePublicClientReturnType>,
  orchestratorAddress: `0x${string}`,
  walletClientQuery?: UseWalletClientReturnType
) => {
  const walletClient = walletClientQuery?.isSuccess
    ? walletClientQuery.data
    : undefined

  const client = { public: publicClient, wallet: walletClient! }

  const orchestrator = getContract({
    abi: abis.Orchestrator.v1,
    client,
    address: orchestratorAddress,
  })

  const addresses = {
    orchestrator: orchestratorAddress,
    authorizer: await orchestrator.read.authorizer(),
    funding: await orchestrator.read.fundingManager(),
    payment: await orchestrator.read.paymentProcessor(),
    logic: await orchestrator.read.findModuleAddressInOrchestrator([
      'BountyManager',
    ]),
  }

  const funding = getContract({
    client,
    address: addresses.funding,
    abi: abis.RebasingFundingManager.v1,
  })

  const authorizer = getContract({
    client,
    address: addresses.authorizer,
    abi: abis.RoleAuthorizer.v1,
  })

  const ERC20Address = await funding.read.token(),
    ERC20 = getContract({
      client,
      address: ERC20Address,
      abi: abis.ERC20.v1,
    }),
    ERC20Symbol = await ERC20.read.symbol(),
    ERC20Decimals = await ERC20.read.decimals()

  const logic = getContract({
    client,
    address: addresses.logic,
    abi: abis.BountyManager.v1,
  })

  return {
    addresses: { ...addresses, ERC20: ERC20Address },
    contracts: {
      ERC20,
      orchestrator,
      funding,
      logic,
      authorizer,
    },
    ERC20Decimals,
    ERC20Symbol,
  }
}

export type Workflow = Awaited<ReturnType<typeof getWorkflow>>
