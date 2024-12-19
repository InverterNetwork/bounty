import { FormattedBountyDetails, BountyPostArgs } from '@/types/bounty'
import { BountyWorkflow } from '@/lib/workflow'
import type { toast as Toast } from 'sonner'

export const handleBountyPost = async ({
  address,
  data,
  workflow,
  toast,
}: {
  address?: `0x${string}`
  data: BountyPostArgs
  workflow?: BountyWorkflow
  toast: typeof Toast
}) => {
  if (!workflow || !address) throw new Error('No workflow or address found')

  const { details, minimumPayoutAmount, maximumPayoutAmount } = data

  const newDetails = {
    ...details,
    creatorAddress: address,
    date: new Date().toISOString(),
  } satisfies FormattedBountyDetails

  const args = [minimumPayoutAmount, maximumPayoutAmount, newDetails] as const

  const hash =
    await workflow.optionalModule.LM_PC_Bounties_v1.write.addBounty.run(args, {
      confirmations: 1,
      onConfirmation: () => {
        toast.success('Bounty post confirmed')
      },
    })

  return hash
}

export const handleBountyList = async ({
  workflow,
  ids,
}: {
  workflow?: BountyWorkflow
  ids: readonly string[]
}) => {
  if (!workflow) throw new Error('No workflow found')

  const list = (
    await Promise.all(
      ids.map(async (bountyId) => {
        const bounty =
          await workflow.optionalModule.LM_PC_Bounties_v1.read.getBountyInformation.run(
            bountyId
          )

        if (bounty.locked || !bounty.details?.title) return null

        const newBounty = {
          ...bounty,
          id: bountyId,
          details: bounty.details as FormattedBountyDetails,
          symbol: workflow.fundingToken.symbol,
        }

        return newBounty
      })
    )
  ).filter((bounty): bounty is NonNullable<typeof bounty> => bounty !== null)

  return list.sort(
    (a, b) =>
      new Date(b.details.date).getTime() - new Date(a.details.date).getTime()
  )
}
