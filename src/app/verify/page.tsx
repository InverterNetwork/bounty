'use client'

import { useState } from 'react'
import { FundingStats, WalletWidget } from '@/components'
import { useRole } from '@/hooks/use-role'
import useClaim from '@/hooks/use-claim'
import { Separator, useChainSpecs } from '@inverter-network/react/client'
import { Contributor } from '@/types'
import { NoAccess } from '@/components/ui/no-access'
import {
  Copy,
  NoData,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@inverter-network/react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@inverter-network/react'
import { toast } from 'sonner'

export default function Page() {
  const { showWalletWidget } = useChainSpecs()

  const { roles } = useRole()
  const { claimList, ERC20Symbol, verify } = useClaim()
  const [selected, setSelected] = useState<number>(0)

  const claim = claimList.data?.[selected ?? 0]
  const contributors = (claim?.contributors ?? []) as Contributor[]

  const onSubmit = () => {
    if (!contributors) return
    if (!claim) return

    verify.mutate({ claimId: claim.claimId, contributors })
  }

  if (!roles.isPending && !roles.data?.isVerifier) return <NoAccess />

  return (
    <form
      className="flex flex-col items-center gap-6 w-full max-w-xl m-auto"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <FundingStats className="w-full" />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Verify Panel</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {!claimList.data?.length && <NoData />}

          <div className="flex overflow-auto max-w-full max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bounty ID</TableHead>
                  <TableHead>Claimed</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claimList.data?.map((row, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{row.bountyId}</TableCell>
                      <TableCell>{row.claimed ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{row.details.url}</TableCell>
                      <TableCell className="flex justify-center">
                        <Button
                          type="button"
                          onClick={() => setSelected(index)}
                        >
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {contributors.map(({ addr, claimAmount }, index) => {
            return (
              <Card key={index} className="w-full">
                <CardHeader>
                  <CardTitle>Contributer Adress</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <p className="break-all">{addr}</p>{' '}
                    <Copy
                      data={addr}
                      onClick={() => {
                        toast.success('Copied to clipboard')
                      }}
                    />
                  </div>
                  <Separator />
                  <h4>{ERC20Symbol + ' ' + claimAmount}</h4>
                </CardContent>
              </Card>
            )
          })}
        </CardContent>
      </Card>

      {showWalletWidget && <WalletWidget className="w-full" />}

      {!showWalletWidget && (
        <Button
          className="w-full"
          type="submit"
          disabled={!!claim?.claimed || verify.isPending}
          loading={verify.isPending}
          color="primary"
        >
          Verify Claim
        </Button>
      )}
    </form>
  )
}
