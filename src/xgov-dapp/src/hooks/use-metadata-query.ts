import {useQuery} from "@tanstack/react-query";
import {fetchVotingRoundMetadata, VotingRoundMetadata} from "../../../dapp/src/shared/IPFSGateway";
import useGlobalStateQuery from "./use-global-state-query";

export default function useMetadataQuery(voteId: string | number | undefined) {
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
