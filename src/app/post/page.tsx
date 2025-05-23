'use client'

import { WalletWidget } from '@/components'
import { useBounty } from '@/hooks/use-bounty'
import { Fragment, useState } from 'react'
import { useRole } from '@/hooks/use-role'
import { compressAddress, firstLetterToUpperCase } from '@inverter-network/sdk'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FloatingLabelInput,
} from '@inverter-network/react'
import { NoAccess } from '@/components/ui/no-access'
import { Separator, useChainSpecs } from '@inverter-network/react/client'

const fields = ['title', 'description', 'url'] as const

export default function PostPage() {
  const { showWalletWidget, address } = useChainSpecs()

  const { roles } = useRole()

  const [details, setDetails] = useState({
    title: '',
    description: '',
    url: '',
  })

  const [minimumPayoutAmount, setMinimumPayoutAmount] = useState('')
  const [maximumPayoutAmount, setMaximumPayoutAmount] = useState('')

  const { post, ERC20Symbol } = useBounty()
  const { mutate, isPending } = post

  const onMutate = (e: React.FormEvent) => {
    e.preventDefault()
    mutate({
      details,
      minimumPayoutAmount,
      maximumPayoutAmount,
    })
  }

  if (!roles.isPending && !roles.data?.isIssuer) return <NoAccess />

  return (
    <form
      className="flex flex-col items-center gap-6 w-full max-w-xl m-auto"
      onSubmit={onMutate}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Post Bounty</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 max-w-full">
          {fields.map((i, index) => (
            <Fragment key={index}>
              <FloatingLabelInput
                label={firstLetterToUpperCase(i)}
                onChange={(e) =>
                  setDetails((prev) => ({ ...prev, [i]: e.target.value }))
                }
                required
                type={i === 'url' ? 'url' : 'text'}
              />
              <Separator />
            </Fragment>
          ))}

          <div className="flex justify-center flex-wrap gap-3 max-w-full">
            <Badge>
              Min Payout | {minimumPayoutAmount} {ERC20Symbol}
            </Badge>
            <Badge>
              Max Payout | {maximumPayoutAmount} {ERC20Symbol}
            </Badge>
            <Badge>
              Creator |{' '}
              {compressAddress(
                address ?? '0x0000000000000000000000000000000000000000'
              )}
            </Badge>
          </div>

          <FloatingLabelInput
            label="Minimum Payment Amount"
            onChange={(e) => setMinimumPayoutAmount(e.target.value)}
            required
            min={0}
          />

          <FloatingLabelInput
            label="Maximum Payment Amount"
            onChange={(e) => setMaximumPayoutAmount(e.target.value)}
            required
            min={0}
          />
        </CardContent>
      </Card>

      {showWalletWidget && <WalletWidget className="w-full" />}

      {!showWalletWidget && (
        <Button
          className="w-full"
          color={'primary'}
          type="submit"
          loading={isPending}
          disabled={isPending}
        >
          Post Bounty
        </Button>
      )}
    </form>
  )
}
