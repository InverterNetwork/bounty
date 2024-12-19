'use client'

import { FundingStats, WalletWidget } from '@/components'
import { useFunding } from '@/hooks/use-funding'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FloatingLabelInput,
  MarketStat,
} from '@inverter-network/react'
import { useChainSpecs } from '@inverter-network/react/client'

export default function FundsPage() {
  const { showWalletWidget } = useChainSpecs()

  const {
    handleDeposit,
    loading,
    balance,
    allowance,
    setAmount,
    isDepositable,
    amount,
  } = useFunding()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleDeposit()
  }

  const disabled = !isDepositable || loading

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col items-center gap-6 w-full max-w-xl m-auto"
    >
      <FundingStats className="w-full" />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Deposit</CardTitle>
        </CardHeader>

        <CardContent>
          <Card>
            <CardHeader>
              <CardTitle>User Balance</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <MarketStat
                className="pt-6"
                size="sm"
                title="Balance"
                prefix={balance?.symbol ?? '...'}
                value={balance?.formatted}
              />

              <MarketStat
                className="pt-6"
                size="sm"
                title="Allowance"
                prefix={balance?.symbol ?? '...'}
                value={allowance.data}
              />
            </CardContent>
          </Card>

          <FloatingLabelInput
            className="mt-6"
            label={`Deposit Amount`}
            onChange={(e) => setAmount(e.target.value)}
            max={balance?.formatted ?? 0}
            value={amount}
            required
          />
        </CardContent>
      </Card>

      {showWalletWidget && <WalletWidget className="w-full" />}

      {!showWalletWidget && (
        <Button
          className="w-full"
          color="primary"
          type="submit"
          disabled={disabled}
          loading={loading}
        >
          Deposit
        </Button>
      )}
    </form>
  )
}
