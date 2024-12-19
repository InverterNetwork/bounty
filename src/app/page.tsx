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

export default function PageClient() {
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
        <CardContent>
          {!list.data?.length && <NoData />}

          {!!list.data?.length && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Bounty ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.data?.map((row) => {
                  return (
                    <TableRow key={row.id} className="!bg-background">
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.details.title}</TableCell>
                      <TableCell>
                        <Button color="primary">Select</Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}

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
