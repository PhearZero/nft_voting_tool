import {useQuery} from "@tanstack/react-query";
import {fetchTallyCounts, TallyCounts} from "../../../dapp/src/shared/VotingRoundContract";
import useMetadataQuery from "./use-metadata-query";

export default function useTallyCountsQuery(
    voteId: string | number | undefined,
) {
    const metadata = useMetadataQuery(voteId)
    // fetchTallyCounts()
    return useQuery<TallyCounts | undefined>(
        ['tallyCount', voteId],
        () => {
            if (typeof metadata.data === 'undefined') return undefined
            if (typeof voteId === 'number') {
                return fetchTallyCounts(voteId, metadata.data)
            }
            if (typeof voteId === 'string') {
                return fetchTallyCounts(parseInt(voteId), metadata.data)
            }

            return undefined
        },
        {
            enabled: typeof voteId !== 'undefined' && typeof metadata.data !== 'undefined'
        }
    )
}
