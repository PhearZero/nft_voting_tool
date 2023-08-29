import {useWallet} from "@makerx/use-wallet";
import {useQuery} from "@tanstack/react-query";
import {fetchVoterVotes} from "../../../dapp/src/shared/VotingRoundContract";
import useGlobalStateQuery from "./use-global-state-query";
import useMetadataQuery from "./use-metadata-query";
export function useVoterVotesQuery(
    voteId: string | number | undefined
) {
    const {activeAddress} = useWallet()
    const globalState = useGlobalStateQuery(voteId)
    const metadata = useMetadataQuery(voteId)

    return useQuery<any | null>(
        ['voterVotes', voteId, activeAddress],
        () => {
            if (typeof voteId === 'number') {
                return fetchVoterVotes(
                    voteId,
                    activeAddress,
                    metadata.data,
                    globalState.data,
                ).then((res) => {
                    if (typeof res === 'undefined') return null
                    return res
                })
            }

            if (typeof voteId === 'string') {
                return fetchVoterVotes(
                    parseInt(voteId),
                    activeAddress,
                    metadata.data,
                    globalState.data,
                ).then((res) => {
                    if (typeof res === 'undefined') return null
                    return res
                })
            }

            return null
        },
        {
            enabled:
                typeof voteId !== 'undefined' &&
                typeof activeAddress !== 'undefined' &&
                activeAddress !== null &&
                typeof metadata.data !== 'undefined' &&
                typeof globalState.data !== 'undefined',
        },
    )
}
