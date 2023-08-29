import {useQuery} from "@tanstack/react-query";
import {fetchVotingSnapshot, VoteGatingSnapshot} from "../../../dapp/src/shared/IPFSGateway";
import useMetadataQuery from "./use-metadata-query";
export default function useSnapshotQuery(voteId: number | string | undefined) {
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
