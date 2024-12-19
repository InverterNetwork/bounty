import {
  ClaimArgs,
  EditContributersArgs,
  FormattedClaimDetails,
  VerifyArgs,
} from '@/types'
import { BountyWorkflow } from '@/lib/workflow'
import type { toast as Toast } from 'sonner'

export async function handleClaim({
  data: { contributors, bountyId, details },
  workflow,
  toast,
}: {
  data: ClaimArgs
  workflow?: BountyWorkflow
  toast: typeof Toast
}) {
  if (!workflow) throw new Error('No workflow found')

  const { optionalModule } = workflow

  const mappedContributers = contributors.map((c) => c)

  const hash = await optionalModule.LM_PC_Bounties_v1.write.addClaim.run(
    [bountyId, mappedContributers, details],
    {
      confirmations: 1,
      onConfirmation: () => {
        toast.success('Claim proposal confirmed')
      },
    }
  )

  return hash
}

export const handleClaimList = async ({
  ids,
  workflow,
}: {
  ids: readonly string[]
  workflow?: BountyWorkflow
}) => {
  if (!workflow) throw new Error('No workflow found')

  const list = (
    await Promise.all(
      ids.map(async (claimId) => {
        const claim =
          await workflow.optionalModule.LM_PC_Bounties_v1.read.getClaimInformation.run(
            claimId
          )

        const formattedClaim = {
          ...claim,
          claimId,
          details: claim.details as FormattedClaimDetails,
          contributors: claim.contributors,
          symbol: workflow.fundingToken.symbol,
        }

        return formattedClaim
      })
    )
  ).filter((c): c is NonNullable<typeof c> => c !== null)

  return list.sort(
    (a, b) =>
      new Date(b.details.date).getTime() - new Date(a.details.date).getTime()
  )
}

export async function handleClaimListForContributorAddress({
  workflow,
  address,
}: {
  workflow?: BountyWorkflow
  address: `0x${string}`
}) {
  if (!workflow) throw new Error('No workflow found')

  const ids =
    await workflow.optionalModule.LM_PC_Bounties_v1.read.listClaimIdsForContributorAddress.run(
      address!
    )
  const list = await handleClaimList({ ids, workflow })
  return list
}

export async function handleEditContributers({
  data: { claimId, contributors },
  workflow,
  toast,
}: {
  data: EditContributersArgs
  workflow?: BountyWorkflow
  toast: typeof Toast
}) {
  if (!workflow) throw new Error('No workflow found')

  const parsedContributors = contributors.map((c) => c)

  if (parsedContributors.length === 0) {
    throw new Error('No Contributors Included')
  }

  const hash =
    await workflow.optionalModule.LM_PC_Bounties_v1.write.updateClaimContributors.run(
      [claimId, parsedContributors],
      {
        confirmations: 1,
        onConfirmation: () => {
          toast.success('Edit contributors confirmed')
        },
      }
    )

  return hash
}

export async function handleVerify({
  data: { claimId, contributors },
  workflow,
  toast,
}: {
  data: VerifyArgs
  workflow?: BountyWorkflow
  toast: typeof Toast
}) {
  if (!workflow) throw new Error('No workflow found')

  const { optionalModule } = workflow

  const parsedContributors = contributors.map(({ addr, claimAmount }) => ({
    addr,
    claimAmount,
  }))

  const config = [claimId, parsedContributors] as const

  const hash = await optionalModule.LM_PC_Bounties_v1.write.verifyClaim.run(
    config,
    {
      confirmations: 1,
      onConfirmation: () => {
        toast.success('Verify proposal confirmed')
      },
    }
  )

  return hash
}
