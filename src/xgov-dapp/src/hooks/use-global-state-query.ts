import {useQuery} from "@tanstack/react-query";
import {fetchVotingRoundGlobalState, VotingRoundGlobalState} from "../../../dapp/src/shared/VotingRoundContract";

export default function useGlobalStateQuery(voteId: string | number | undefined) {
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
