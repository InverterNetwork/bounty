'use client'

import { useEffect, useState } from 'react'
import { Button, Loading } from 'react-daisyui'
import { WalletWidget } from '@/components'
import { FundingStats } from '@/components/FundingStats'
import useClaim from '@/hooks/useClaim'
import { InitialContributor } from '@/lib/types/claim'
import { useRole } from '@/hooks'
import { NoAccess, InteractiveTable } from '@/components/ui/'
import { ContributerInput } from '@/components/ContributerInput'

export default function ClaimsPage() {
  const { roles } = useRole()
  const { isConnected, ERC20Symbol, contributorsList, editContributors } =
    useClaim()
  const [selected, setSelected] = useState<number>(0)
  const [contributors, setContributors] = useState<InitialContributor[]>([])

  const list = contributorsList.data ?? []
  const claim = list[selected ?? 0]

  useEffect(() => {
    if (claim)
      setContributors(
        claim.contributors.map((i) => ({ ...i, uid: crypto.randomUUID() }))
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claim?.bountyId])

  // const total = contributors.reduce((acc, i) => acc + Number(i.claimAmount), 0)

  // const isTotalValid =
  //   total >= Number(bounty.minimumPayoutAmount) &&
  //   total <= Number(bounty.maximumPayoutAmount)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!claim || !contributors) return

    const mapped = contributors.map(
      ({ uid, ...rest }) => rest as Required<typeof rest>
    )

    editContributors.mutate({
      claimId: String(claim.claimId),
      contributors: mapped,
    })
  }

  if (!isConnected) return <WalletWidget />

  if (roles.isPending) return <Loading />

  if (!roles.data?.isClaimer) return <NoAccess />

  return (
    <>
      <FundingStats />

      <InteractiveTable
        onSelect={setSelected}
        heads={['Bounty ID', 'Claimed', 'URL']}
        rows={list.map((i) => ({
          row: [
            { item: String(i.bountyId) },
            { item: i.claimed ? 'Yes' : 'No' },
            { item: i.details.url, type: 'url' },
          ],
        }))}
        className="py-10 max-w-xl"
      />

      {(() => {
        if (!isConnected) return <WalletWidget />

        return (
          <form
            onSubmit={onSubmit}
            className="form-control gap-6 w-full max-w-xl"
          >
            <ContributerInput
              contributors={contributors}
              contributersStateHandler={setContributors}
              symbol={ERC20Symbol}
              canEditContributor={!claim?.claimed}
            />
            <Button
              loading={editContributors.isPending}
              disabled={editContributors.isPending || claim?.claimed}
              color="primary"
              type="submit"
            >
              Submit
            </Button>
            <div className="mt-6">
              What happens after I submit my bounty claim?
            </div>
            <div className="text-gray200">
              Once you submit your bounty claim, it will go to the verification
              team for review. If approved, you will receive Bloom tokens. Bloom
              tokens are a `reputation token` and not directly tradable for
              money - they signify your value contribution to our collective
              mission. As Bloom Network grows a grants pool, people who received
              Bloom tokens will periodically receive a payout from the grants
              pool, proportional to the amount of Bloom tokens they have. This
              is similar to a grocery cooperative member dividend.
            </div>
          </form>
        )
      })()}
    </>
  )
}
