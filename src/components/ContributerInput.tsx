import { Button } from 'react-daisyui'
import { Frame, NumberInput, TextInput } from './ui'
import { IoClose } from 'react-icons/io5'
import { InitialContributor } from '@/lib/types/claim'
import { cn } from '@/styles/cn'

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
        <TextInput
          label="Proposal URL"
          type="url"
          onChange={onUrlChange}
          required
        />
      )}

      <div className="mt-4">
        Paste impact participants` wallet addresses for payout. Include yourself
        if you participated. *Only members of BloomNetwork.earth are eligible.*{' '}
        <br></br>
        <a
          href="https://bloomnetwork.earth/member/bounty/localmembers"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-300"
        >
          View your Local Bloom members` addresses
        </a>
      </div>
      {contributors.map((c, index) => (
        <Frame key={c.uid} className="mt-6 relative">
          <IoClose
            className={cn(
              'rounded-box cursor-pointer btn-ghost p-0 absolute right-3 top-3',
              index === 0 && 'hidden'
            )}
            // @ts-ignore
            size={30}
            // @ts-ignore
            onClick={() => {
              removeContributer(c.uid)
            }}
            // @ts-ignore
            disabled={canEditContributor === false}
          />
          <TextInput
            label={`Participant ${index + 1} wallet address`}
            onChange={(e) => {
              handleState({ uid: c.uid, addr: e as `0x${string}` })
            }}
            type="address"
            defaultValue={c.addr}
            required
          />
          <NumberInput
            label={`Multiply the number of hours they contributed to the activity, by 30 ${symbol}`}
            onChange={(e) => {
              handleState({ uid: c.uid, claimAmount: e })
            }}
            max={
              !!maximumPayoutAmount ? Number(maximumPayoutAmount) : undefined
            }
            defaultValue={c.claimAmount}
            required
          />
        </Frame>
      ))}
      <Button
        className="mt-6"
        style={{ backgroundColor: '#59127B', color: '#FFFFFF' }}
        size="sm"
        type="button"
        onClick={addContributer}
        disabled={canEditContributor === false}
      >
        Add Participant
      </Button>
    </div>
  )
}
