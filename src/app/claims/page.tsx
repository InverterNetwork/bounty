'use client'

import { useEffect, useState } from 'react'
import { ContributerInput, FundingStats, WalletWidget } from '@/components'
import useClaim from '@/hooks/use-claim'
import { useRole } from '@/hooks/use-role'
import { useChainSpecs } from '@inverter-network/react/client'
import { InitialContributor } from '@/types'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  NoData,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@inverter-network/react'
import { NoAccess } from '@/components/ui/no-access'

export default function Page() {
  const { showWalletWidget } = useChainSpecs()

  const { roles } = useRole()
  const { ERC20Symbol, contributorsList, editContributors } = useClaim()
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

  if (!roles.isPending && !roles.data?.isClaimer) return <NoAccess />

  const rows = list.map((i) => [
    { item: i.bountyId },
    { item: i.claimed ? 'Yes' : 'No' },
    { item: i.details.url, type: 'url' },
  ])

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col items-center gap-6 w-full max-w-xl m-auto"
    >
      <FundingStats className="w-full" />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Claims</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {!list?.length && <NoData />}

          {!!list?.length && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bounty ID</TableHead>
                  <TableHead>Claimed</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    {row.map((cell) => (
                      <TableCell key={cell.item}>{cell.item}</TableCell>
                    ))}
                    <TableCell className="flex justify-center">
                      <Button type="button" onClick={() => setSelected(index)}>
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {claim && (
            <ContributerInput
              contributors={contributors}
              contributersStateHandler={setContributors}
              symbol={ERC20Symbol}
              canEditContributor={!claim?.claimed}
            />
          )}
        </CardContent>
      </Card>

      {!!claim && !showWalletWidget && (
        <Button
          className="w-full"
          loading={editContributors.isPending}
          disabled={editContributors.isPending || claim?.claimed}
          color="primary"
          type="submit"
        >
          Edit Contributors
        </Button>
      )}

      {showWalletWidget && <WalletWidget className="w-full" />}
    </form>
  )
}
