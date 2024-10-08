import { WorkflowQuery } from '@/hooks'
import { FormattedBountyDetails } from './types/bounty'

export const handleBountyList = async (
  workflow: NonNullable<WorkflowQuery['data']>,
  ids: readonly string[]
) => {
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
