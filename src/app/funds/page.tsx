'use client'

import { Input, Tabs, WalletWidget } from '@/components'
import { FundingStats } from '@/components/FundingStats'
import { useFunding } from '@/hooks/useFunding'
import utils from '@/lib/utils'
import { useState } from 'react'
import { Button, Stats } from 'react-daisyui'

const tabs = ['Deposit', 'Withdraw'] as const

export default function FundsPage() {
  const [tab, setTab] = useState(0)
  const {
    ERC20Symbol,
    handleDeposit,
    // handleWithdraw,
    loading,
    balance,
    allowance,
    isConnected,
    setAmount,
    isDepositable,
    // isWithdrawable,
    // withdrawable,
  } = useFunding()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (tab === 0) handleDeposit()
    // else handleWithdraw()
  }

  const disabled =
    /* tab === 0 ?  */ !isDepositable /*  : !isWithdrawable */ || loading

  return (
    <>
      <Tabs
        variant="boxed"
        setTab={setTab}
        tab={tab}
        tabs={[tabs[0]] as unknown as string[]}
      />

      <FundingStats />

      <Stats className="bg-base-200 scale-75">
        <Stats.Stat>
          <Stats.Stat.Item variant="title">
            {tab === 0 ? 'Balance' : 'Deposited'}
          </Stats.Stat.Item>
          <Stats.Stat.Item variant="value">
            {ERC20Symbol}{' '}
            {utils.format.toCompactNumber(
              /* tab === 0 ?  */ balance /* : withdrawable */
            )}
          </Stats.Stat.Item>
        </Stats.Stat>

        {tab !== 1 && (
          <Stats.Stat>
            <Stats.Stat.Item variant="title">Allowance</Stats.Stat.Item>
            <Stats.Stat.Item variant="value">
              {utils.format.toCompactNumber(allowance.data)}
            </Stats.Stat.Item>
          </Stats.Stat>
        )}
      </Stats>

      <form onSubmit={onSubmit} className="form-control items-center gap-6">
        <Input.Number
          label={`${tabs[tab]} Amount`}
          onChange={setAmount}
          max={/* tab === 0 ?  */ balance /*  : withdrawable */}
          required
        />

        {!isConnected ? (
          <WalletWidget />
        ) : (
          <Button
            color="primary"
            type="submit"
            disabled={disabled}
            loading={loading}
          >
            {tab === 0 ? 'Deposit' : 'Withdraw'}
          </Button>
        )}
      </form>
    </>
  )
}
