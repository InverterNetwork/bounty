import { type Hex } from 'viem'
import { MethodOptions, Workflow, PopWalletClient } from '@inverter-network/sdk'
import { BountyRequestedModules } from '@/lib/workflow'

const BountyRoles = {
  Claimer: 'CLAIMANT_ROLE',
  Verifier: 'VERIFIER_ROLE',
  Issuer: 'BOUNTY_ISSUER_ROLE',
} as const

export type BountyRoleKeys = keyof typeof BountyRoles

const Roles = {
  Owner: 'DEFAULT_ADMIN_ROLE',
  ...BountyRoles,
} as const

export type RoleKeys = keyof typeof Roles

export type HandleRoleProps = {
  workflow: Workflow<PopWalletClient, BountyRequestedModules>
  address: Hex
}

type RoleHexs = Record<RoleKeys, Hex>
type GeneratedRoles = Record<BountyRoleKeys, Hex>

export const getRoleHexes = async ({
  workflow: { authorizer, optionalModule },
}: Omit<HandleRoleProps, 'address'>) => {
  const logicAddress = optionalModule.LM_PC_Bounties_v1.address
  // Initialize roleIds and generatedRoles as empty objects
  const roleHexs = {} as RoleHexs
  const generatedRoles = {} as GeneratedRoles

  // Set role HEXs for each role in BountyRoles
  for (const [key, value] of Object.entries(BountyRoles)) {
    roleHexs[key as BountyRoleKeys] =
      await optionalModule.LM_PC_Bounties_v1.read[value].run()
  }

  // Generate role IDs for each role in roleHexs
  for (const [role, id] of Object.entries(roleHexs) as [
    BountyRoleKeys,
    Hex,
  ][]) {
    generatedRoles[role] = await authorizer.read.generateRoleId.run([
      logicAddress,
      id!,
    ])
  }

  // Add the owner role HEX to roleHexs
  roleHexs.Owner = await authorizer.read.getAdminRole.run()

  return { roleHexs, generatedRoles }
}

export const getHasRoles = async ({
  workflow: { authorizer },
  address,
  roleHexs,
  generatedRoles,
}: {
  roleHexs: RoleHexs
  generatedRoles: GeneratedRoles
} & HandleRoleProps) => {
  // Initialize hasRoles as an empty object
  const hasRoles = {} as Record<`is${RoleKeys}`, boolean>

  // Check if the address has each role in Roles
  for (const key of Object.keys(Roles) as RoleKeys[]) {
    hasRoles[`is${key}`] = await authorizer.read.hasRole.run([
      { Owner: roleHexs.Owner, ...generatedRoles }[key],
      address,
    ])
  }

  // Return the results
  return hasRoles
}

export const handleRoles = async ({ workflow, address }: HandleRoleProps) => {
  // Initialize roleIds and generatedRoles as empty objects
  const { roleHexs, generatedRoles } = await getRoleHexes({
    workflow,
  })

  const hasRoles = await getHasRoles({
    roleHexs,
    generatedRoles,
    workflow,
    address,
  })

  // Return the results
  return { ...hasRoles, roleHexs, generatedRoles }
}

export const grantOrRevokeRole = async (
  {
    role,
    address,
    type,
    workflow,
    roleHexs,
  }: {
    role: RoleKeys
    address: Hex
    type: 'Grant' | 'Revoke'
    roleHexs: RoleHexs
  } & HandleRoleProps,
  options?: MethodOptions
) => {
  // Determine the action based on the role and type
  const action = `${type === 'Grant' ? 'grant' : 'revoke'}${
    role === 'Owner' ? 'Role' : 'ModuleRole'
  }` as const

  const args = [roleHexs[role], address] as const

  let hash: Hex

  if (action === 'grantRole' || action === 'revokeRole')
    hash = await workflow.authorizer.write[action].run(args, options)
  else
    hash = await workflow.optionalModule.LM_PC_Bounties_v1.write[action].run(
      args,
      options
    )

  return hash
}
