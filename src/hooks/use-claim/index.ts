import { useWorkflow } from '@inverter-network/react/client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  handleClaim,
  handleClaimListForContributorAddress,
  handleVerify,
  handleEditContributers,
} from './utils'
import { requestedModules, orchestratorAddress } from '@/lib/workflow'
import { useAccount } from 'wagmi'
import { ClaimArgs, EditContributersArgs, VerifyArgs } from '@/types'

export default function useClaim() {
  const { address } = useAccount()

  const workflow = useWorkflow({
    requestedModules,
    orchestratorAddress,
  })

  const onError = (err: any) => {
    toast.error(err?.message)
  }

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

      toast.success(`Claim proposal has been confirmed`)
    },

    onError,
  })

  const verify = useMutation({
    mutationKey: ['performVerify'],
    mutationFn: (data: VerifyArgs) =>
      handleVerify({ data, workflow: workflow.data, toast }),

    onSuccess: () => {
      toast.success(`Verify has been confirmed`)
    },

    onError,
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
      toast.success(`Contributors edit has been confirmed`)
      contributorsList.refetch()
    },

    onError,
  })

  return {
    editContributors,
    contributorsList,
    post,
    verify,
  }
}
