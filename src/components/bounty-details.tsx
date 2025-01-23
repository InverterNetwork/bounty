import { compressAddress } from '@inverter-network/sdk'
import { cn, Frame } from '@inverter-network/react'
import { Badge } from '@inverter-network/react'
import { Separator } from '@inverter-network/react/client'

export const BountyDetails = {
  Main: ({
    title = '...',
    minimumPayoutAmount,
    maximumPayoutAmount,
    symbol,
    creatorAddress,
    bigTitle = false,
    className,
  }: {
    title?: string
    minimumPayoutAmount: string
    maximumPayoutAmount: string
    symbol: string
    creatorAddress?: string
    bigTitle?: boolean
    className?: string
  }) => (
    <div className={cn('items-center justify-center p-3', className)}>
      {bigTitle ? <h3>{title}</h3> : <p>{title}</p>}

      <Separator className="my-3" />

      <div className="flex flex-wrap gap-3">
        <Badge>
          Min Payout | {minimumPayoutAmount} {symbol}
        </Badge>
        <Badge>
          Max Payout | {maximumPayoutAmount} {symbol}
        </Badge>
        <Badge>Creator | {compressAddress(creatorAddress)}</Badge>
      </div>
    </div>
  ),
  Description: ({
    description = '...',
    url = '/',
    className,
  }: {
    description?: string
    url?: string
    className?: string
  }) => (
    <Frame className={cn('max-w-xl', className)}>
      <h4>Description</h4>
      <p>{description}</p>
      <h4>URL</h4>
      <a href={url} target="_blank" className="link">
        {url}
      </a>
    </Frame>
  ),
  DetailedDescription: ({
    description = '...',
    url = '/',
    minimumPayoutAmount,
    maximumPayoutAmount,
    symbol,
    creatorAddress,
  }: {
    description?: string
    url?: string
    minimumPayoutAmount: string
    maximumPayoutAmount: string
    symbol: string
    creatorAddress?: string
  }) => (
    <Frame className="max-w-xl flex flex-col gap-5">
      <h4>Description</h4>
      <p className="-mt-4">{description}</p>
      <h4>URL</h4>
      <a href={url} target="_blank" className="link -mt-4">
        {url}
      </a>
      <div className="flex flex-wrap gap-3 justify-center">
        <Badge>
          Min Payout | {minimumPayoutAmount} {symbol}
        </Badge>
        <Badge>
          Max Payout | {maximumPayoutAmount} {symbol}
        </Badge>
        <Badge>Creator | {compressAddress(creatorAddress)}</Badge>
      </div>
    </Frame>
  ),
}
