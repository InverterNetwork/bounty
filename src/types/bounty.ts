export type FormattedBountyDetails = {
  title?: string
  description?: string
  creatorAddress?: `0x${string}`
  url?: string
  date: string
}

export type FormattedBounty = {
  id: string
  details: FormattedBountyDetails
  minimumPayoutAmount: string
  maximumPayoutAmount: string
  symbol: string
  locked: boolean
}

export type BountyPostArgs = {
  details: {
    title: string
    description: string
    url: string
  }
  minimumPayoutAmount: string
  maximumPayoutAmount: string
}

export type FormattedClaimDetails = {
  url: string
  date: string
}

export type Contributor = {
  addr: `0x${string}`
  claimAmount: string
}

export type InitialContributor = {
  addr?: `0x${string}`
  claimAmount?: string
  uid: string
}

export type FormattedClaim = {
  claimId: string
  details: FormattedClaimDetails
  contributors: Contributor[]
  symbol: string
  bountyId: string
  claimed: boolean
}

export type ClaimArgs = {
  bountyId: string
  contributors: Contributor[]
  details: FormattedClaimDetails
}

export type EditContributersArgs = {
  claimId: string
  contributors: Contributor[]
}

export type VerifyArgs = {
  claimId: string
  contributors: Contributor[]
}
