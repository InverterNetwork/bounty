import { useMutation, useQuery } from '@tanstack/react-query'
import { useWorkflow } from '@inverter-network/react/client'
import { toast } from 'sonner'
import { requestedModules, orchestratorAddress } from '@/lib/workflow'
import { handleBountyList, handleBountyPost } from './utils'
import { BountyPostArgs } from '@/types'
import { useAccount } from 'wagmi'

export function useBounty() {
  const { address } = useAccount()

  const workflow = useWorkflow({
    orchestratorAddress,
    requestedModules,
  })

  const post = useMutation({
    mutationKey: ['postBounty'],
    mutationFn: (data: BountyPostArgs) =>
      handleBountyPost({ data, address, workflow: workflow.data, toast }),

    onError: (err: any) => {
      toast.error(err?.message)
    },
  })

  const list = useQuery({
    queryKey: ['bountyList'],
    queryFn: async () => {
      if (!workflow.data) throw new Error('No workflow found')
      const ids =
        await workflow.data.optionalModule.LM_PC_Bounties_v1.read.listBountyIds.run()

      return handleBountyList({ workflow: workflow.data, ids })
    },
  })

  const ERC20Symbol = workflow.data?.fundingToken?.symbol ?? '...'

  return {
    post,
    list,
    ERC20Symbol,
  }
}
