'use client'

import { useState } from 'react'
import { FundingStats, BountyDetails, WalletWidget } from '@/components'
import Link from 'next/link'
import { useAccount } from 'wagmi'
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
import { useBounty } from '@/hooks/use-bounty'

export default function Page() {
  const { isConnected } = useAccount()
  const { list } = useBounty()
  const [index, setIndex] = useState<number>(0)
  const bounty = list.data?.[index ?? 0]

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xl m-auto">
      <FundingStats className="w-full" />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Bounties</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {!list.data?.length && <NoData />}

          <div className="flex overflow-auto max-w-full max-h-96">
            {!!list.data?.length && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bounty ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.data?.map((row, index) => {
                    return (
                      <TableRow key={row.id} className="!bg-background">
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.details.title}</TableCell>
                        <TableCell className="flex justify-center">
                          <Button type="button" onClick={() => setIndex(index)}>
                            Select
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </div>

          {!!bounty && (
            <BountyDetails.DetailedDescription
              description={bounty?.details?.description}
              url={bounty?.details?.url}
              minimumPayoutAmount={bounty?.minimumPayoutAmount}
              maximumPayoutAmount={bounty?.maximumPayoutAmount}
              symbol={bounty?.symbol}
              creatorAddress={bounty?.details?.creatorAddress}
            />
          )}
        </CardContent>
      </Card>

      {!isConnected && <WalletWidget className="w-full" />}

      {!!bounty?.id && (
        <Button color="primary" asChild className="w-full">
          <Link href={`/claims/${bounty.id}`}>Claim Bounty</Link>
        </Button>
      )}
    </div>
  )
}
