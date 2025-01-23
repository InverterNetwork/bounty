import { InitialContributor } from '@/types'
import { toAmountString } from '@inverter-network/sdk'
import { Button } from '@inverter-network/react'
import { FloatingLabelInput } from '@inverter-network/react'
import { CircleX } from 'lucide-react'

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
    <div className="flex flex-col w-full max-w-xl gap-3">
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
        <div
          key={index}
          className="flex flex-col gap-3 mt-2 relative p-3 border rounded-lg border-border"
        >
          <Button
            variant="ghost"
            className={`p-0 absolute -right-4 -top-4 z-10 ${
              index === 0 ? 'hidden' : ''
            }`}
            onClick={() => {
              removeContributer(c.uid)
            }}
            disabled={canEditContributor === false}
            size={'icon'}
          >
            <CircleX size={26} />
          </Button>

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
                claimAmount: toAmountString(e.target.value),
              })
            }}
            max={
              !!maximumPayoutAmount ? Number(maximumPayoutAmount) : undefined
            }
            defaultValue={c.claimAmount}
            required
          />
        </div>
      ))}
    </div>
  )
}
