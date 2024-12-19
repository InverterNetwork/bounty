'use client'

import { NoAccess } from '@/components/ui/no-access'
import { useRole } from '@/hooks/use-role'
import { useEffect, useMemo, useState } from 'react'
import { isAddress, type Hex } from 'viem'
import { WalletWidget } from '@/components'
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  FloatingLabelInput,
} from '@inverter-network/react'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  Switch,
  Label,
  useChainSpecs,
} from '@inverter-network/react/client'

const tabs = ['Owner', 'Claimer', 'Issuer', 'Verifier'] as const
type Tabs = (typeof tabs)[number]

export default function Page() {
  const { showWalletWidget } = useChainSpecs()
  const { roles, setRole, checkRole } = useRole()
  const [tab, setTab] = useState(0)
  const [walletAddress, setWalletAddress] = useState('')
  const [type, setType] = useState<'Grant' | 'Revoke'>('Grant')

  const toggleType = () => {
    setType((prev) => (prev === 'Grant' ? 'Revoke' : 'Grant'))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setRole.mutate({
      type,
      role: tabs[tab],
      address: walletAddress as Hex,
    })
  }

  const canSubmit = useMemo(() => {
    const role = tabs[tab]
    let can = checkRole?.data?.[`is${role}`] ?? false
    const message = `User ${can ? 'has' : 'does not have'} role ${role}`
    if (type === 'Grant') can = !can
    return { can, message }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkRole.data, tab, type])

  useEffect(() => {
    checkRole.mutate(walletAddress)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress])

  if (!roles.isPending && !roles.data?.isOwner) return <NoAccess />

  return (
    <form
      className="flex flex-col items-center gap-6 w-full max-w-xl m-auto"
      onSubmit={onSubmit}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Manage Role</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="grant-revoke"
              onCheckedChange={toggleType}
              checked={type === 'Grant'}
            ></Switch>
            <Label htmlFor="grant-revoke">
              Grant/Revoke {`( ${type}ing ${type === 'Grant' ? '✅' : '❌'} )`}
            </Label>
          </div>

          <Tabs
            defaultValue="Owner"
            onValueChange={(value) => setTab(tabs.indexOf(value as Tabs))}
            value={tabs[tab]}
          >
            <TabsList className="flex">
              {tabs.map((tab) => (
                <TabsTrigger className="flex-1" key={tab} value={tab}>
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <FloatingLabelInput
            label="Wallet Address"
            onChange={(e) => setWalletAddress(e.target.value)}
            type="address"
            required
          />

          <Alert
            className={cn(
              (checkRole.isPending ||
                checkRole.isError ||
                !isAddress(walletAddress)) &&
                'hidden'
            )}
          >
            {canSubmit.message}
          </Alert>
        </CardContent>
      </Card>

      {showWalletWidget && <WalletWidget className="w-full" />}

      {!showWalletWidget && (
        <Button
          size={'sm'}
          color="primary"
          type="submit"
          disabled={setRole.isPending || checkRole.isPending || !canSubmit?.can}
          loading={setRole.isPending || checkRole.isPending}
          className="w-full"
        >
          Set Role
        </Button>
      )}
    </form>
  )
}
