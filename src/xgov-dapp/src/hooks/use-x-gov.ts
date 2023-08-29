import {UseQueryResult} from '@tanstack/react-query'

import type {TallyCounts, VotingRoundGlobalState} from '../../../dapp/src/shared/VotingRoundContract'
import type {VoteGatingSnapshot, VotingRoundMetadata,} from '../../../dapp/src/shared/IPFSGateway'
import api from "../shared/api";
import {useWallet} from "@makerx/use-wallet";
import {getHasVoteEnded, getHasVoteStarted} from "../shared/vote";
import useGlobalStateQuery from "./use-global-state-query";
import useMetadataQuery from "./use-metadata-query";
import useSnapshotQuery from "./use-snapshot-query";
import useTallyCountsQuery from "./use-tally-counts-query";
import {useVoterVotesQuery} from "./use-voter-votes-query";

type UseVotingRoundQueryResponse = {
    errors: Error[]
    data: {
        hasVoteStarted: boolean
        hasVoteEnded: boolean
        hasClosed: boolean
        submit: any
        close: any
        globalState: VotingRoundGlobalState | undefined
        snapshot: VoteGatingSnapshot | undefined
        metadata: VotingRoundMetadata | undefined
        tallyCounts: TallyCounts | undefined
    }
    refetch: any
    isLoading: boolean
    isError: boolean
}

function getLoading(...queries: UseQueryResult[]) {
    return queries.some((query) => query.isLoading)
}

function getError(...queries: UseQueryResult[]) {
    return queries.some((query) => query.isError)
}

function getErrors(...queries: UseQueryResult[]): Error[] {
    return queries
        .filter((query) => query.isError)
        .map((query) => query.error as Error)
}

/**
 * Fetches all the data for a voting round
 *
 * @param {number | string | undefined} voteId
 */
export function useVotingRound(
    voteId: number | string | undefined
): UseVotingRoundQueryResponse {
    // Effects
    const globalState = useGlobalStateQuery(voteId)
    const metadata = useMetadataQuery(voteId)
    const snapshot = useSnapshotQuery(voteId)
    const tallyCounts = useTallyCountsQuery(voteId)

    // API Actions
    const submit = api.useSubmitVote()
    const close = api.useCloseVotingRound()

    // Combined State
    const isLoading = getLoading(globalState, metadata, snapshot, tallyCounts)
    const isError = getError(globalState, metadata, snapshot, tallyCounts)
    const errors = getErrors(globalState, metadata, snapshot, tallyCounts)

    // Derived State
    const hasVoteStarted = !globalState.data ? false : getHasVoteStarted(globalState.data);
    const hasVoteEnded = !globalState.data ? false : getHasVoteEnded(globalState.data)

    // Effects return
    return {
        errors,
        data: {
            globalState: globalState.data,
            snapshot: snapshot.data,
            metadata: metadata.data,
            tallyCounts: tallyCounts.data,
            hasVoteStarted,
            hasVoteEnded,
            hasClosed: globalState.data !== undefined && globalState.data.close_time !== undefined,
            submit,
            close,
        },
        refetch: tallyCounts.refetch,
        isLoading,
        isError,
    }
}

export function useVoter(voteId: string | number | undefined) {
    const {activeAddress} = useWallet()
    const metadata = useMetadataQuery(voteId)
    const snapshot = useSnapshotQuery(voteId)
    const voterVotes = useVoterVotesQuery(voteId)

    const addressSnapshot = snapshot.data?.snapshot.find((addressSnapshot) => {
        return addressSnapshot.address === activeAddress && typeof activeAddress !== 'undefined'
    })

    const voteWeight = addressSnapshot?.weight && isFinite(addressSnapshot.weight) ?
        addressSnapshot.weight :
        !addressSnapshot?.weight ?
            0 :
            1
    return {
        allowedToVote: typeof addressSnapshot !== 'undefined',
        refetch: voterVotes.refetch,
        allowlistSignature: addressSnapshot?.signature,
        voteWeight,
        isVoteCreator: metadata.data?.created.by === activeAddress && typeof activeAddress !== 'undefined',
        voterVotes: voterVotes.data,
        hasVoted: voterVotes.data !== undefined && voterVotes.data !== null,
    }
}
