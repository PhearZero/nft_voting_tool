import { useQuery } from '@tanstack/react-query'
import type { VotingRoundGlobalState } from '../shared/VotingRoundContract'
import { fetchVotingRoundGlobalStatesByCreators } from '../shared/VotingRoundContract'

export default function useGlobalStatesByCreatorQuery(addresses: string[]) {
  return useQuery<VotingRoundGlobalState[]>(['globalStatesByCreator', addresses], () => {
    return fetchVotingRoundGlobalStatesByCreators(addresses)
  })
}
