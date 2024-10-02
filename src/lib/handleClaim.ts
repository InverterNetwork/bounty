import { WorkflowQuery } from '@/hooks'
import { ClaimArgs } from './types/claim'
import { toast } from 'sonner'

export async function handleClaim({
  data: { contributors, bountyId, details },
  workflow,
}: {
  data: ClaimArgs
  workflow: WorkflowQuery
}) {
  const { optionalModule } = workflow.data!

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
