import { WorkflowQuery } from '@/hooks'
import { VerifyArgs } from './types/claim'
import { toast } from 'sonner'

export async function handleVerify({
  data: { claimId, contributors },
  workflow,
}: {
  data: VerifyArgs
  workflow: WorkflowQuery
}) {
  const { optionalModule } = workflow.data!

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
