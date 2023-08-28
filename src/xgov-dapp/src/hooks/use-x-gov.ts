import { useQuery } from '@tanstack/react-query'

import type { VotingRoundGlobalState } from '../../../dapp/src/shared/VotingRoundContract'
import type {
  VotingRoundMetadata,
  VoteGatingSnapshot,
} from '../../../dapp/src/shared/IPFSGateway'

import {
  fetchVoterVotes,
  fetchVotingRoundGlobalState,
} from '../../../dapp/src/shared/VotingRoundContract'
import {
  fetchVotingRoundMetadata,
  fetchVotingSnapshot,
} from '../../../dapp/src/shared/IPFSGateway'

export function useGlobalStateQuery(voteId: string | number | undefined) {
  return useQuery<VotingRoundGlobalState | undefined>(
    ['globalState', voteId],
    () => {
      if (typeof voteId === 'number') {
        return fetchVotingRoundGlobalState(voteId)
      }
      if (typeof voteId === 'string') {
        return fetchVotingRoundGlobalState(parseInt(voteId))
      }
      return undefined
    },
    {
      enabled: typeof voteId !== 'undefined',
    },
  )
}
export function useMetadataQuery(voteId: string | number | undefined) {
  const globalState = useGlobalStateQuery(voteId)

  return useQuery<VotingRoundMetadata | undefined>(
    ['metadata', voteId],
    () => {
      if (typeof globalState.data?.metadata_ipfs_cid === 'string') {
        return fetchVotingRoundMetadata(globalState.data.metadata_ipfs_cid)
      } else {
        return undefined
      }
    },
    {
      staleTime: Infinity,
      enabled: typeof globalState.data?.metadata_ipfs_cid !== 'undefined',
    },
  )
}
export function useSnapshotQuery(voteId: number | string | undefined) {
  const metadata = useMetadataQuery(voteId)
  return useQuery<VoteGatingSnapshot | undefined>(
    ['snapshot', voteId],
    () => {
      if (typeof metadata.data?.voteGatingSnapshotCid !== 'undefined') {
        return fetchVotingSnapshot(metadata.data.voteGatingSnapshotCid)
      } else {
        return undefined
      }
    },
    {
      enabled: typeof metadata.data?.voteGatingSnapshotCid !== 'undefined',
      staleTime: Infinity,
    },
  )
}

export function useVotingRoundQuery(
  voteId: number | string | undefined,
  voterAddress?: string | undefined,
) {
  const globalState = useGlobalStateQuery(voteId)
  const metadata = useMetadataQuery(voteId)
  const snapshot = useSnapshotQuery(voteId)
  const voter = useVoter(voteId, voterAddress)

  const isLoading =
    globalState.isLoading || metadata.isLoading || snapshot.isLoading

  const isError = globalState.isError || metadata.isError || snapshot.isError

  return {
    data: {
      voter: voter.data,
      globalState: globalState.data,
      snapshot: snapshot.data,
      metadata: metadata.data,
    },
    isLoading,
    isError,
  }
}

export function useVoter(
  voteId: string | number | undefined,
  voterAddress: string | undefined,
) {
  const globalState = useGlobalStateQuery(voteId)
  const metadata = useMetadataQuery(voteId)

  return useQuery(
    ['voter', voteId, voterAddress],
    () => {
      if (typeof voteId === 'number') {
        return fetchVoterVotes(
          voteId,
          voterAddress,
          metadata.data,
          globalState.data,
        )
      }

      if (typeof voteId === 'string') {
        return fetchVoterVotes(
          parseInt(voteId),
          voterAddress,
          metadata.data,
          globalState.data,
        )
      }

      return undefined
    },
    {
      enabled:
        typeof voteId !== 'undefined' &&
        typeof voterAddress !== 'undefined' &&
        voterAddress !== null &&
        typeof metadata.data !== 'undefined' &&
        typeof globalState.data !== 'undefined',
    },
  )
}
