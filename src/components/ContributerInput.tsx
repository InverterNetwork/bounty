import { useState, useEffect } from 'react'
import axios from 'axios'
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
  const [validAddresses, setValidAddresses] = useState<string[]>([]) // Changed from walletAddresses to validAddresses
  const [hasInteracted, setHasInteracted] = useState(false)
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    async function fetchValidAddresses() {
      // Renamed from fetchWalletAddresses to fetchValidAddresses
      try {
        const response = await axios.get(
          'https://dev-bloomnetwork.netlify.app/.netlify/functions/bountyapi'
        )
        // Filter out null values from the response
        const addresses = response.data.filter((address) => address !== null)
        setValidAddresses(addresses)
      } catch (error) {
        console.error(
          'Error fetching wallet addresses:',
          (error as Error).message
        )
      }
    }

    fetchValidAddresses() // Updated function name
  }, [])

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

  const handleState = ({
    uid,
    addr,
    hours,
  }: {
    uid: string
    addr?: string
    hours?: string
  }) => {
    const numHours = hours ? parseInt(hours) : undefined // Convert hours to number
    const claimAmount = numHours ? numHours * 30 : undefined // Calculate number of tokens from number of hours if hours is defined
    const newContributers = contributors
      .map((c) => {
        if (c.uid === uid) {
          return { ...c, claimAmount }
        }
        return c
      })
      .map((contributor) => ({
        uid: contributor.uid,
        addr: contributor.addr,
        claimAmount: contributor.claimAmount
          ? String(contributor.claimAmount)
          : undefined, // Ensure claimAmount is of type string
      }))
    contributersStateHandler(newContributers)
  }

  const removeContributer = (uid: string) => {
    const newContributers = contributors.filter((c) => c.uid !== uid)
    contributersStateHandler(newContributers)
  }

  const validateAddress = (address: string) => {
    if (!address.trim()) {
      setValidationError('')
      return
    }

    console.log('New Wallet:', address.trim()) // Log the trimmed wallet address

    if (!validAddresses.includes(address.trim())) {
      // Updated to validAddresses
      setValidationError(
        'Wallet address not found. Please contact your local Bloom member to add your wallet to their profile.'
      )
    } else {
      setValidationError('')
    }
  }

  return (
    <div className="flex flex-col w-full max-w-xl">
      {!!onUrlChange && (
        <TextInput
          label="Proposal URL - your impact report"
          type="url"
          onChange={onUrlChange}
          required
        />
      )}

      <div className="mt-6">
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
              setHasInteracted(true)
              // Perform address validation
              validateAddress(e)
            }}
            type="address"
            defaultValue={c.addr}
            required
          />
          {/* Validation messages */}
          {hasInteracted && (
            <>
              {validationError && (
                <p className="text-[#ed0b70]">{validationError}</p>
              )}
              {!validationError && (
                <p className="text-[#00af82]">Valid wallet address</p>
              )}
            </>
          )}
          <div className="ml-1 text-sm my-1">Number of hours contributed</div>
          <div className="flex-grow flex items-center justify-between w-full">
            <NumberInput
              // label={`Number of hours contributed`}
              onChange={(e) => {
                handleState({ uid: c.uid, hours: e })
              }}
              max={
                !!maximumPayoutAmount ? Number(maximumPayoutAmount) : undefined
              }
              defaultValue={
                c.claimAmount ? parseInt(c.claimAmount) / 30 : undefined
              } // Convert claimAmount to number before dividing by 30
              required
              style={{ width: '60px' }} // Adjust width here
            />
            <div className="ml-4">
              {c.claimAmount !== undefined && c.claimAmount !== undefined && (
                <div>
                  {c.claimAmount} {symbol}
                </div>
              )}
            </div>
          </div>
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
