import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccount, useBalance } from 'wagmi'
import { toast } from 'sonner'
import { useWorkflow } from '@inverter-network/react/client'
import { requestedModules, orchestratorAddress } from '@/lib/workflow'

export function useFunding() {
  const [amount, setAmount] = useState('')

  const queryClient = useQueryClient()

  const { address } = useAccount()

  const workflow = useWorkflow({
    orchestratorAddress,
    requestedModules,
  })

  const onError = (err: any) => {
    toast.error(err?.message)
  }

  const refetchTotalSupply = () => {
    queryClient.refetchQueries({
      queryKey: ['totalSupply'],
    })
  }

  // Balance and allowance queries
  const balance = useBalance({
    address,
    token: workflow.data?.fundingToken.address,
  })

  const fundingManagerAddress = workflow.data?.fundingManager.address

  const allowance = useQuery({
    queryKey: ['allowance', address, fundingManagerAddress],
    queryFn: async () => {
      const allowanceValue =
        await workflow.data?.fundingToken.module.read.allowance.run([
          address!,
          fundingManagerAddress!,
        ])

      return allowanceValue!
    },
    enabled: workflow.isSuccess && !!address,
  })

  // Deposit mutation
  const deposit = useMutation({
    mutationKey: ['deposit'],
    mutationFn: async (formatted: string) => {
      const hash = await workflow.data?.fundingManager.write?.deposit.run(
        formatted,
        {
          confirmations: 1,
          onConfirmation: () => {
            toast.info('Deposit confirmed')
          },
          onApprove: () => {
            allowance.refetch()
            toast.info('Approve confirmed')
          },
        }
      )!

      return hash
    },

    onSuccess: () => {
      refetchTotalSupply()
      balance.refetch()
      allowance.refetch()
      setAmount('')
    },
    onError,
  })

  // Handle deposit and withdraw actions
  const handleDeposit = () => {
    if (isDepositable) deposit.mutate(amount)
  }

  // Loading and enabled states
  const loading = deposit.isPending || allowance.isPending
  const isDepositable =
    balance.isSuccess && Number(amount) <= Number(balance.data?.formatted!)

  return {
    balance: balance.data,
    allowance,

    setAmount,
    loading,
    handleDeposit,
    amount,
    isDepositable,
  }
}
