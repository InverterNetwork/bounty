import { Button } from 'react-daisyui'
import { Frame, NumberInput, TextInput } from './ui' // Corrected import statement
import { IoClose } from 'react-icons/io5'
import { InitialContributor } from '@/lib/types/claim'
import { cn } from '@/styles/cn'
import { useState } from 'react' // Added import for useState
import { useEffect } from 'react'
import axios from 'axios' // Import axios for API requests

// Define a new type extending InitialContributor with validationError
type ContributorWithValidation = InitialContributor & {
  validationError?: string
}

export function ContributerInput({
  contributors,
  contributersStateHandler,
  onUrlChange,
  symbol,
  maximumPayoutAmount,
  canEditContributor,
}: {
  contributors: ContributorWithValidation[]
  contributersStateHandler: (contributors: ContributorWithValidation[]) => void
  onUrlChange?: (url: string) => void
  symbol?: string
  maximumPayoutAmount?: string
  canEditContributor?: boolean
}) {
  const [validAddresses, setValidAddresses] = useState<string[]>([]) // State to store valid addresses
  const [formValid, setFormValid] = useState<boolean>(true) // State to track form validity

  useEffect(() => {
    async function fetchValidAddresses() {
      try {
        const response = await axios.get(
          'https://dev-bloomnetwork.netlify.app/.netlify/functions/bountyapi'
        )
        // Filter out null values from the response
        const addresses = response.data.filter(
          (address: string | null) => address !== null
        )
        setValidAddresses(addresses)
      } catch (error) {
        console.error(
          'Error fetching wallet addresses:',
          (error as Error).message
        )
      }
    }

    fetchValidAddresses()
  }, [])

  const addContributor = () => {
    const newContributor: ContributorWithValidation = {
      uid: crypto.randomUUID(),
      addr: undefined,
      claimAmount: undefined,
      validationError: '', // Add validationError property for each contributor
    }
    contributersStateHandler([...contributors, newContributor])
  }

  const handleState = (uid: string, field: string, value: string) => {
    const newContributors = contributors.map((contributor) => {
      if (contributor.uid === uid) {
        // Validate address and set validation error
        let validationError = ''
        let numHours
        let claimAmount

        if (field === 'hours') {
          numHours = value ? parseInt(value) : undefined
          claimAmount = numHours ? numHours * 30 : undefined
        }

        if (field === 'addr') {
          if (!value.trim()) {
            validationError = 'Please enter a wallet address'
          } else if (!validAddresses.includes(value.trim())) {
            validationError =
              'Invalid wallet address - if you know this the address of one of your Local Bloom members, you need to ask them to add it to their BloomNetwork.earth profile, before you are able to include it in a bounty claim.'
          }
        }

        const contributorWithValidation: ContributorWithValidation = {
          ...contributor,
          [field]: value,
          claimAmount:
            claimAmount !== undefined ? String(claimAmount) : undefined,
          validationError,
        }

        // Check if any contributor has validation errors
        const isFormValid = contributors.every(
          (c) => !c.validationError || c.validationError === ''
        )

        setFormValid(isFormValid) // Update form validity state

        return contributorWithValidation
      }
      return contributor
    })

    contributersStateHandler(newContributors)
  }

  const removeContributor = (uid: string) => {
    const newContributors = contributors.filter(
      (contributor) => contributor.uid !== uid
    )
    contributersStateHandler(newContributors)
  }

  return (
    <div className="flex flex-col w-full max-w-xl">
      {/* Include Proposal URL input if onUrlChange prop is provided */}
      {/* Assuming TextInputContributor is the correct component */}
      {!!onUrlChange && (
        <TextInput
          label="Proposal URL - your impact report"
          type="url"
          onChange={onUrlChange}
          required
        />
      )}

      {/* Instructions for adding participant addresses */}
      <div className="mt-6">
        Paste impact participants wallet addresses for payout. Include yourself
        if you participated. *Only members of BloomNetwork.earth are eligible.*{' '}
        <br />
        <a
          href="https://bloomnetwork.earth/member/bounty/localmembers"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-300"
        >
          View your Local Bloom members addresses
        </a>
      </div>

      {/* Map through contributors */}
      {contributors.map((contributor, index) => (
        <Frame key={contributor.uid} className="mt-6 relative">
          {/* Close button */}
          <IoClose
            className="rounded-box cursor-pointer btn-ghost p-0 absolute right-3 top-3"
            // className={cn(
            //   'rounded-box cursor-pointer btn-ghost p-0 absolute right-3 top-3',
            //   index === 0 && 'hidden'
            // )}
            size={30}
            onClick={() => removeContributor(contributor.uid)}
            {...(canEditContributor === false && { disabled: true })}
          />

          {/* Wallet address input */}
          {contributor.validationError && (
            <p className="text-red-500">{contributor.validationError}</p>
          )}
          <TextInput
            label={`Participant ${index + 1} wallet address`}
            onChange={(value: string) =>
              handleState(contributor.uid, 'addr', value)
            }
            type="text"
            defaultValue={contributor.addr}
            required
          />
          {/* Validation messages */}
          {/* {contributor.validationError && (
            <p className="text-red-500">{contributor.validationError}</p>
          )} */}

          {/* Number of hours contributed */}
          {!contributor.validationError && ( // Render only if there's no validation error
            <>
              <div className="ml-1 text-sm my-1">
                Number of hours contributed
              </div>
              <div className="flex-grow flex items-center justify-between w-full">
                <NumberInput
                  onChange={(value: string) =>
                    handleState(contributor.uid, 'hours', value)
                  }
                  max={
                    !!maximumPayoutAmount
                      ? Number(maximumPayoutAmount)
                      : undefined
                  }
                  defaultValue={
                    typeof contributor.claimAmount === 'number'
                      ? String(contributor.claimAmount / 30)
                      : String(Number(contributor.claimAmount) / 30) // Convert to number first
                  }
                  required
                  style={{ width: '60px' }}
                  disabled={!!contributor.validationError} //
                />
                {/* Display claim amount */}
                <div className="ml-4">
                  {contributor.claimAmount !== undefined && (
                    <div>
                      {contributor.claimAmount} {symbol}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </Frame>
      ))}

      {/* Button to add more contributors */}
      <Button
        className="mt-6"
        style={{ backgroundColor: '#59127B', color: '#FFFFFF' }}
        size="sm"
        type="button"
        onClick={addContributor}
        disabled={canEditContributor === false}
      >
        Add Participant
      </Button>
    </div>
  )
}
