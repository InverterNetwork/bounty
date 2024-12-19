import { useMutation, useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { RoleKeys, getHasRoles, grantOrRevokeRole, handleRoles } from './utils'
import { isAddress, type Hex } from 'viem'
import { toast } from 'sonner'
import { useWorkflow } from '@inverter-network/react/client'
import { requestedModules, orchestratorAddress } from '@/lib/workflow'

export function useRole() {
  const { address } = useAccount()

  const workflow = useWorkflow({
    orchestratorAddress,
    requestedModules: requestedModules,
  })

  // Roles query: fetches roles and roleHexs for the connected address
  // Enabled only when workflow and address are available
  // Roles query is used to check if the connected address has roles
  // and returns the necessary data to check if any other address has roles
  const roles = useQuery({
    queryKey: ['roles', address],
    queryFn: () =>
      handleRoles({
        workflow: workflow.data!,
        address: address!,
      }),

    enabled: workflow.isSuccess && !!address,
  })

  // Check role mutation: checks if any given address has roles
  const checkRole = useMutation({
    mutationKey: ['checkRole'],
    mutationFn: (address: string) => {
      if (!roles.isSuccess) throw new Error('Roles query not success')
      if (!workflow.isSuccess) throw new Error('Workflow not success')
      if (!isAddress(address)) throw new Error('Invalid address')

      return getHasRoles({
        workflow: workflow.data,
        address,
        roleHexs: roles.data?.roleHexs!,
        generatedRoles: roles.data?.generatedRoles!,
      })
    },
  })

  // Set role mutation: grants or revokes a role to/from a given address
  const setRole = useMutation({
    mutationKey: ['grantRole'],
    mutationFn: async (props: {
      role: RoleKeys
      address: Hex
      type: 'Grant' | 'Revoke'
    }) => {
      // Handle the grant or revoke role / return the transaction hash
      await grantOrRevokeRole(
        {
          ...props,
          workflow: workflow.data!,
          roleHexs: roles.data!.roleHexs,
        },
        {
          confirmations: 1,
          onHash: () => {
            toast.info(`${props.type}ng role ${props.role} to ${props.address}`)
          },
          onConfirmation: (receipt) => {
            // Add a toast to notify the user that the role has been set
            toast.success(
              `Role ${props.type.toLowerCase()}ed with hash ${receipt.transactionHash}`
            )
          },
        }
      )

      // Return the transaction hash and the address and type of the role
      return { address: props.address! }
    },

    onSuccess: ({ address: anyAddress }) => {
      // if the address is the connected address, refetch the roles
      if (address === anyAddress) roles.refetch()
      // run the checkRole mutation to notify the UI of the change
      checkRole.mutate(anyAddress)
    },

    onError: (error) => {
      // Add a toast to notify the user of the error
      toast.error(error.message)
    },
  })

  return { roles, setRole, checkRole }
}
