'use client'

import { BountyDetails, ContributerInput, WalletWidget } from '@/components'
import { useState } from 'react'
import { toast } from 'sonner'
import { useChainSpecs, useWorkflow } from '@inverter-network/react/client'
import { useRole } from '@/hooks/use-role'
import { useQuery } from '@tanstack/react-query'
import { orchestratorAddress, requestedModules } from '@/lib/workflow'
import { handleBountyList } from '@/hooks/use-bounty/utils'
import useClaim from '@/hooks/use-claim'
import { InitialContributor } from '@/types'
import { NoAccess } from '@/components/ui/no-access'
import { FourOFour } from '@/components/ui/four-o-four'
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '@inverter-network/react'

export function ClientPage({ bountyId }: { bountyId: string }) {
  const { showWalletWidget } = useChainSpecs()

  const { roles } = useRole()

  const workflow = useWorkflow({
    orchestratorAddress,
    requestedModules,
  })

  const bountyQuery = useQuery({
    queryKey: ['bounty'],
    queryFn: async () => {
      if (!workflow.data) throw new Error('Workflow data not found')
      if (!bountyId) throw new Error('Claim bountyId not found')

      const bounty = (
        await handleBountyList({
          ids: [bountyId],
          workflow: workflow.data,
        })
      )[0]

      return bounty
    },
  })

  const bounty = bountyQuery.data

  const [contributors, setContributers] = useState<InitialContributor[]>([
      { uid: crypto.randomUUID(), addr: '' as `0x${string}`, claimAmount: '' },
    ]),
    [url, setUrl] = useState('')

  const { post } = useClaim()

  const total = contributors.reduce((acc, i) => acc + Number(i.claimAmount), 0)

  const isTotalValid =
    total >= Number(bounty?.minimumPayoutAmount) &&
    total <= Number(bounty?.maximumPayoutAmount)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isTotalValid) {
      toast.warning(
        `Total amount should be between ${bounty?.minimumPayoutAmount} and ${bounty?.maximumPayoutAmount},\n it was ${total}`
      )

      return
    }

    post.mutate({
      contributors: contributors.map((i) => ({
        addr: i.addr!,
        claimAmount: i.claimAmount!,
      })),
      details: {
        url,
        date: new Date().toISOString(),
      },
      bountyId,
    })
  }

  if (!roles.isPending && !roles.data?.isClaimer) return <NoAccess />

  const minimumPayoutAmount = bounty?.minimumPayoutAmount,
    maximumPayoutAmount = bounty?.maximumPayoutAmount

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col items-center gap-6 w-full max-w-xl m-auto"
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Claim Form</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <BountyDetails.Main
            bigTitle
            className="w-full px-0"
            title={bounty?.details?.title ?? '...'}
            minimumPayoutAmount={minimumPayoutAmount ?? '...'}
            maximumPayoutAmount={maximumPayoutAmount ?? '...'}
            symbol={bounty?.symbol ?? '...'}
            creatorAddress={bounty?.details?.creatorAddress ?? '...'}
          />

          <BountyDetails.Description
            className="mr-auto"
            description={bounty?.details?.description ?? '...'}
            url={bounty?.details?.url ?? '...'}
          />

          <ContributerInput
            maximumPayoutAmount={maximumPayoutAmount}
            contributors={contributors}
            contributersStateHandler={setContributers}
            onUrlChange={setUrl}
            symbol={workflow.data?.fundingToken.symbol ?? '...'}
          />
        </CardContent>
      </Card>

      {!showWalletWidget && (
        <Button
          className="w-full"
          loading={post.isPending}
          disabled={post.isPending}
          color="primary"
          type="submit"
        >
          Submit Claim
        </Button>
      )}

      {showWalletWidget && <WalletWidget className="w-full" />}
    </form>
  )
}
