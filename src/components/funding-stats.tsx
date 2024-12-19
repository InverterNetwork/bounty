'use client'

import useFundingStats from '@/hooks/use-funding-stats'
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  MarketStat,
  toCompactNumber,
} from '@inverter-network/react'
import { DollarSignIcon } from 'lucide-react'

export function FundingStats({ className }: { className?: string }) {
  const { symbol, totalSupply } = useFundingStats()
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Funding Stats</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <MarketStat
          size="sm"
          className="pt-6"
          title="Price Usd"
          value={'1.00 $'}
          icon={<DollarSignIcon />}
        />
        <MarketStat
          size="sm"
          className="pt-6"
          title={`${symbol} TVL`}
          value={toCompactNumber(Number(totalSupply) * 1)}
          icon={<DollarSignIcon />}
        />
      </CardContent>
    </Card>
  )
}
