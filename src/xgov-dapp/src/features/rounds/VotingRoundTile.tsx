import { useWallet } from '@makerx/use-wallet'
import { Box, Button, Skeleton, Typography } from '@mui/material'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Link } from 'react-router-dom'
import { VotingRoundGlobalState } from '../../shared/VotingRoundContract'
import { ClosedChip, OpenChip, OpeningSoonChip, YouHaveNotVotedChip, YouVotedChip } from '../../shared/Chips'
import { calculateTotalAskedAndAwarded } from '../../shared/stats'
import AlgoStats from '../vote/AlgoStats'
import VotingStats from '../vote/VotingStats'
import { VotingTime } from '../vote/VotingTime'
import { useVoter, useVotingRound } from '../../hooks/use-x-gov'
dayjs.extend(relativeTime)

export type VotingRoundTileProps = {
  globalState: VotingRoundGlobalState
  votingRoundStatus: VotingRoundStatus
}

export enum VotingRoundStatus {
  OPEN = 1,
  OPENING_SOON = 2,
  CLOSED = 3,
}

export const VotingRoundTile = ({ globalState, votingRoundStatus }: VotingRoundTileProps) => {
  const { activeAddress } = useWallet()
  const round = useVotingRound(globalState.appId, { globalState: { initialData: globalState } })
  const voter = useVoter(globalState.appId, { globalState: { initialData: globalState } })
  const votingRoundMetadata = round.data?.metadata
  const votingRoundResults = round.data?.tallyCounts
  const snapshot = round.data?.snapshot
  const voterVotes = voter.voterVotes

  const hasVoted = voterVotes !== undefined && voterVotes !== null

  if (votingRoundStatus === VotingRoundStatus.OPEN || votingRoundStatus === VotingRoundStatus.OPENING_SOON) {
    return (
      <Box className="bg-white rounded-lg p-5">
        <div className="mb-2 justify-between flex">
          <div>
            {votingRoundStatus === VotingRoundStatus.OPEN ? (
              <>
                <OpenChip />
                {activeAddress && !voter.isLoading && (hasVoted ? <YouVotedChip /> : <YouHaveNotVotedChip />)}
              </>
            ) : (
              <OpeningSoonChip />
            )}
          </div>
          <div>
            {votingRoundStatus === VotingRoundStatus.OPEN && (
              <Button component={Link} to={`/vote/${globalState.appId}`} variant="contained" color="primary">
                View Proposals
              </Button>
            )}
          </div>
        </div>
        {round.isLoading ? (
          <Skeleton className="h-10 w-full" variant="text" />
        ) : (
          <Typography variant="h4">{votingRoundMetadata?.title}</Typography>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div>
            <AlgoStats
              isLoading={round.isLoading}
              votingRoundMetadata={votingRoundMetadata}
              votingRoundResults={votingRoundResults}
              hasVoteClosed={false}
            />
          </div>
          <div>
            <VotingStats isLoading={round.isLoading} votingRoundGlobalState={globalState} snapshot={snapshot} />
          </div>
          <div>
            <VotingTime globalState={globalState} loading={false} className="lg:visible" />
          </div>
        </div>
      </Box>
    )
  }

  const { totalAsked, totalAwarded } = calculateTotalAskedAndAwarded(votingRoundResults, votingRoundMetadata)

  return (
    <Box className="bg-white rounded-lg p-5">
      <div className="mb-3 justify-between flex">
        <div>
          <ClosedChip />
          {activeAddress && !voter.isLoading && (hasVoted ? <YouVotedChip isSmall={true} /> : <YouHaveNotVotedChip isSmall={true} />)}
        </div>
        <div>
          <Link to={`/vote/${globalState.appId}`}>View Results</Link>
        </div>
      </div>
      <div className="">
        {round.isLoading ? (
          <Skeleton className="h-12 w-full" variant="text" />
        ) : (
          <Typography variant="h5" className="mb-5">
            {votingRoundMetadata?.title}
          </Typography>
        )}
      </div>
      <Typography className="mb-4">
        {round.isLoading && <Skeleton className="h-6 w-full" variant="text" />}
        {!round.isLoading && `${totalAwarded} of ${totalAsked} ALGO allocated`}
      </Typography>
      <Typography className="mb-4">
        {round.isLoading && <Skeleton className="h-6 w-full" variant="text" />}
        {!round.isLoading && snapshot && `${globalState.voter_count} out of ${snapshot.snapshot.length} wallets voted`}
      </Typography>
      <Typography>
        Closed {globalState.close_time ? dayjs(globalState?.close_time).fromNow() : dayjs(globalState?.end_time).fromNow()}
      </Typography>
    </Box>
  )
}
