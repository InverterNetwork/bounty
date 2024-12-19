import { InitialContributor } from '@/types'
import { amountString, cn, Frame } from '@inverter-network/react'
import { Button } from '@inverter-network/react'
import { FloatingLabelInput } from '@inverter-network/react'
import { CrossIcon } from 'lucide-react'

export function ContributerInput({
  contributors,
  onUrlChange,
  contributersStateHandler,
  symbol,
  maximumPayoutAmount,
  canEditContributor,
}: {
  contributors: InitialContributor[]
  contributersStateHandler: (contributors: InitialContributor[]) => void
  onUrlChange?: (url: string) => void
  symbol?: string
  maximumPayoutAmount?: string
  canEditContributor?: boolean
}) {
  const addContributer = () => {
    contributersStateHandler([
      ...contributors,
      {
        uid: crypto.randomUUID(),
        addr: undefined,
        claimAmount: undefined,
      },
    ])
  }

  const handleState = ({ uid, addr, claimAmount }: InitialContributor) => {
    const newContributers = contributors.map((c) => {
      if (c.uid === uid) {
        if (addr !== undefined) return { ...c, addr }
        if (claimAmount !== undefined) return { ...c, claimAmount }
        return c
      }
      return c
    })
    contributersStateHandler(newContributers)
  }

  const removeContributer = (uid: string) => {
    const newContributers = contributors.filter((c) => c.uid !== uid)
    contributersStateHandler(newContributers)
  }

  return (
    <div className="flex flex-col w-full max-w-xl">
      {!!onUrlChange && (
        <FloatingLabelInput
          label="Proposal URL"
          type="url"
          onChange={(e) => onUrlChange(e.target.value)}
          required
        />
      )}
      <Button
        className="mt-6"
        color="primary"
        size="sm"
        type="button"
        onClick={addContributer}
        disabled={canEditContributor === false}
      >
        Add Contributor
      </Button>
      {contributors.map((c, index) => (
        <Frame key={index} className="mt-6 relative">
          <CrossIcon
            className={cn(
              'rounded-box cursor-pointer btn-ghost p-0 absolute right-3 top-3',
              index === 0 && 'hidden'
            )}
            size={30}
            onClick={() => {
              removeContributer(c.uid)
            }}
            // @ts-ignore
            disabled={canEditContributor === false}
          />
          <FloatingLabelInput
            label={`Contributer ${index + 1} Address`}
            onChange={(e) => {
              handleState({ uid: c.uid, addr: e.target.value as `0x${string}` })
            }}
            type="address"
            defaultValue={c.addr}
            required
          />
          <FloatingLabelInput
            label={`Proposal Amount ${symbol}`}
            onChange={(e) => {
              handleState({
                uid: c.uid,
                claimAmount: amountString(e.target.value),
              })
            }}
            max={
              !!maximumPayoutAmount ? Number(maximumPayoutAmount) : undefined
            }
            defaultValue={c.claimAmount}
            required
          />
        </Frame>
      ))}
    </div>
  )
}
