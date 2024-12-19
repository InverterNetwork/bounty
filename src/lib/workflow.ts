import type {
  RequestedModules,
  Workflow,
  PopWalletClient,
} from '@inverter-network/sdk'

export const requestedModules = {
  fundingManager: 'FM_DepositVault_v1',
  authorizer: 'AUT_Roles_v1',
  paymentProcessor: 'PP_Simple_v1',
  optionalModules: ['LM_PC_Bounties_v1'],
} as const satisfies RequestedModules

export const orchestratorAddress = process.env
  .NEXT_PUBLIC_ORCHESTRATOR_ADDRESS as `0x${string}` | undefined

export type BountyRequestedModules = typeof requestedModules

export type BountyWorkflow = Workflow<PopWalletClient, BountyRequestedModules>
