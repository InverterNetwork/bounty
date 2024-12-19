import { useWorkflow } from '@inverter-network/react/client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  handleClaim,
  handleClaimListForContributorAddress,
  handleVerify,
  handleEditContributers,
  handleClaimList,
} from './utils'
import { requestedModules, orchestratorAddress } from '@/lib/workflow'
import { useAccount } from 'wagmi'
import { ClaimArgs, EditContributersArgs, VerifyArgs } from '@/types'
import { useRouter } from 'next/navigation'

export default function useClaim() {
  const { address } = useAccount()
  const router = useRouter()

  const workflow = useWorkflow({
    requestedModules,
    orchestratorAddress,
  })

  const onError = (err: any) => {
    toast.error(err?.message)
  }

  const claimList = useQuery({
    queryKey: ['getClaimList'],
    queryFn: async () => {
      if (!workflow.data) throw new Error('No workflow found')
      const ids =
        await workflow.data.optionalModule.LM_PC_Bounties_v1.read.listClaimIds.run()

      const list = await handleClaimList({ ids, workflow: workflow.data })

      return list
    },
  })

  const contributorsList = useQuery({
    queryKey: ['contributorsList'],
    queryFn: () =>
      handleClaimListForContributorAddress({
        workflow: workflow.data!,
        address: address!,
      }),
    enabled: !!address && workflow.isSuccess,
  })

  const post = useMutation({
    mutationKey: ['addClaim'],
    mutationFn: (data: ClaimArgs) =>
      handleClaim({ data, workflow: workflow.data, toast }),

    onSuccess: () => {
      contributorsList.refetch()

      router.push('/claims')
    },

    onError,
  })

  const verify = useMutation({
    mutationKey: ['performVerify'],
    mutationFn: (data: VerifyArgs) =>
      handleVerify({ data, workflow: workflow.data, toast }),
    onError,
    onSuccess: () => {
      claimList.refetch()
    },
  })

  const editContributors = useMutation({
    mutationKey: ['editContributors'],
    mutationFn: (data: EditContributersArgs) =>
      handleEditContributers({
        data,
        workflow: workflow.data,
        toast,
      }),

    onSuccess: () => {
      contributorsList.refetch()
    },

    onError,
  })

  const ERC20Symbol = workflow.data?.fundingToken.symbol ?? '...'

  return {
    editContributors,
    contributorsList,
    post,
    verify,
    ERC20Symbol,
    claimList,
  }
}
