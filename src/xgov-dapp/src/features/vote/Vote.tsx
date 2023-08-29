import {HandThumbUpIcon} from '@heroicons/react/24/solid'
import {useWallet} from '@makerx/use-wallet'
import CancelIcon from '@mui/icons-material/Cancel'
import {Alert, Box, Button, InputAdornment, Link, Skeleton, TextField, Typography} from '@mui/material'
import clsx from 'clsx'
import {useEffect, useState} from 'react'
import {Link as RouterLink, useNavigate, useParams} from 'react-router-dom'
import {ProposalCard} from '../../shared/ProposalCard'
import {LoadingDialog} from '../../shared/loading/LoadingDialog'
import {useSetShowConnectWalletModal} from '../wallet/state'
import {CloseVotingRound} from './CloseVotingRound'
import {VoteDetails} from './VoteDetails'
import {VoteResults} from './VoteResults'
import {VotingInstructions} from './VotingInstructions'
import VotingStats from './VotingStats'
import {VotingTime} from './VotingTime'
import {useVoter, useVotingRound} from '../../hooks/use-x-gov'
import {withVotingRoute} from "../../hooks/with-x-gov";


/**
 * Vote Page
 *
 * This page is used to display the voting round details and allow the user to vote.
 *
 */
function Vote(/*props: {round, voter} */) {
    const navigate = useNavigate()
    const {voteId} = useParams()
    const {activeAddress, signer} = useWallet()
    // TODO HoC
    const {
        data: {
            submit: {loading: submittingVote, execute: submitVote, error: errorSubmittingVote},
            close: {loading: closingVotingRound, execute: closeVotingRound, error: closingVotingRoundError},
            hasClosed,
            hasVoteStarted,
            hasVoteEnded,
            globalState,
            metadata,
            snapshot,
            tallyCounts,
        },
        isLoading,
        isError,
        errors,
        refetch: refetchRound
    } = useVotingRound(voteId)
    const {
        hasVoted,
        isVoteCreator,
        refetch: refetchVoter,
        voteWeight,
        allowlistSignature,
        allowedToVote
    } = useVoter(voteId)

    const setShowConnectedWalletModal = useSetShowConnectWalletModal()

    const [voteAllocationsPercentage, setVoteAllocationsPercentage] = useState<VoteAllocation>({})
    const [voteAllocations, setVoteAllocations] = useState<VoteAllocation>({})

    const totalAllocatedPercentage = Object.values(voteAllocationsPercentage).reduce((a, b) => a + b, 0)
    // const totalAllocated = Object.values(voteAllocations).reduce((a, b) => a + b, 0)

    const canVote = hasVoteStarted && !hasVoteEnded && allowedToVote

    const canSubmitVote =
        canVote &&
        totalAllocatedPercentage >= 100 &&
        // totalAllocated === voteWeight &&
        activeAddress &&
        allowlistSignature &&
        metadata &&
        !hasVoted

    type VoteAllocation = {
        [key: string]: number
    }

    if (voteId && import.meta.env.VITE_HIDDEN_VOTING_ROUND_IDS?.split(',')?.includes(voteId)) {
        navigate('/')
    }

    const updateVoteAllocations = (proposalId: string, amount: number) => {
        const newVoteAllocationsPercentage = {...voteAllocationsPercentage}
        if (!isFinite(amount)) {
            amount = 0
        }

        if (amount > 100 - totalAllocatedPercentage + voteAllocationsPercentage[proposalId]) {
            amount = 100 - totalAllocatedPercentage + voteAllocationsPercentage[proposalId]
        }

        newVoteAllocationsPercentage[proposalId] = amount
        setVoteAllocations({...voteAllocations, [proposalId]: Math.round((amount / 100) * voteWeight)})
        setVoteAllocationsPercentage(newVoteAllocationsPercentage)
    }

    useEffect(() => {
        const newVoteAllocationsPercentage = {} as VoteAllocation
        const newVoteAllocations = {} as VoteAllocation
        metadata?.questions.forEach((question) => {
            newVoteAllocationsPercentage[question.id as keyof VoteAllocation] = 0
            newVoteAllocations[question.id as keyof VoteAllocation] = 0
        })
        setVoteAllocationsPercentage(newVoteAllocationsPercentage)
        setVoteAllocations(newVoteAllocations)
    }, [metadata])

    const handleSubmitVote = async () => {
        if (!canSubmitVote) return
        if (isLoading) return
        if (!metadata || typeof metadata === 'undefined') return
        const sumOfVotes = Object.values(voteAllocations).reduce((a, b) => a + b, 0)
        const difference = voteWeight - sumOfVotes

        const newVoteAllocations = {...voteAllocations}

        if (difference !== 0) {
            let isAdjusted = false
            if (difference < 0) {
                Object.entries(newVoteAllocations).forEach(([key, value]) => {
                    if (value > Math.abs(difference) && !isAdjusted) {
                        newVoteAllocations[key] = value - Math.abs(difference)
                        isAdjusted = true
                    }
                })
            } else {
                Object.entries(newVoteAllocations).forEach(([key, value]) => {
                    if (newVoteAllocations[key] > 0 && !isAdjusted) {
                        newVoteAllocations[key] = value + difference
                        isAdjusted = true
                    }
                })
            }
        }

        await submitVote({
            signature: allowlistSignature,
            selectedOptionIndexes: metadata.questions.map(() => 0),
            weighting: voteWeight,
            weightings: metadata.questions.map((question) => (newVoteAllocations[question.id] ? newVoteAllocations[question.id] : 0)),
            signer: {addr: activeAddress, signer},
            appId: voteId,
        })
        refetchRound()
        refetchVoter()
    }

    const handleCloseVotingRound = async () => {
        if (!isVoteCreator || !globalState || !activeAddress) return
        await closeVotingRound({
            appId: voteId,
            signer: {addr: activeAddress, signer},
        })
        refetchRound()
    }

    if (hasClosed && globalState) {
        return (
            <VoteResults
                votingRoundResults={tallyCounts}
                votingRoundMetadata={metadata}
                votingRoundGlobalState={globalState}
                isLoadingVotingRoundResults={isLoading}
                isLoadingVotingRoundData={isLoading}
                snapshot={snapshot}
            />
        )
    }

    return (
        <div>
            <div className="mb-4">
                <RouterLink to="/" className="no-underline text-gray-600 hover:underline">
                    <Typography>&#60; Back to Voting sessions</Typography>
                </RouterLink>
            </div>
            <div>
                {isError && (
                    <Alert className="max-w-xl mt-4 text-white bg-red font-semibold" icon={false}>
                        <Typography>Could not load voting rounds details:</Typography>
                        {errors.map((error) => (<Typography>{error.toString()}</Typography>))}
                    </Alert>
                )}
                {isLoading ? (
                    <Skeleton className="h-12 w-1/2" variant="text"/>
                ) : (
                    <Typography variant="h3">{metadata?.title}</Typography>
                )}
                {metadata?.description && <Typography>{metadata.description}</Typography>}
                {metadata?.informationUrl && (
                    <div className="mt-3">
                        <Link href={metadata.informationUrl} target="_blank">
                            Learn more about the vote.
                        </Link>
                    </div>
                )}
                <VotingTime className="visible sm:hidden mt-4" loading={isLoading} globalState={globalState}/>
                {canVote && (
                    <div className="sm:hidden my-4">
                        <VotingInstructions voteWeight={voteWeight}/>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="col-span-2">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="col-span-2">
                            {isLoading ? (
                                <Skeleton className="h-12 w-1/2" variant="text"/>
                            ) : (
                                <Typography variant="h4">Proposals</Typography>
                            )}
                        </div>
                        <div>
                            {canVote && !hasVoted && (
                                <>
                                    <Typography variant="h4">Your allocations</Typography>
                                    <Typography>
                                        {totalAllocatedPercentage}% total · {100 - totalAllocatedPercentage}% remaining
                                        to allocate
                                    </Typography>
                                </>
                            )}
                        </div>

                        {isLoading && (
                            <div className="col-span-3">
                                <Skeleton className="h-40 mb-4" variant="rectangular"/>
                                <Skeleton className="h-40 mb-4" variant="rectangular"/>
                                <Skeleton className="h-40" variant="rectangular"/>
                            </div>
                        )}
                        {metadata?.questions.map((question, index) => (
                            <div key={index}
                                 className="col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-4 bg-white rounded-lg">
                                <div className="col-span-2">
                                    {question.metadata && (
                                        <ProposalCard
                                            title={question.prompt}
                                            description={question.description}
                                            category={question.metadata.category}
                                            focus_area={question.metadata.focus_area}
                                            link={question.metadata.link}
                                            threshold={question.metadata.threshold}
                                            ask={question.metadata.ask}
                                            votesTally={tallyCounts && tallyCounts[index] ? tallyCounts[index].count : 0}
                                        />
                                    )}
                                </div>
                                <div className="flex items-center col-span-1 bg-gray-100 m-3">
                                    {canVote && !hasVoted && (
                                        <>
                                            <TextField
                                                type="number"
                                                className="w-32 bg-white m-4 rounded-xl"
                                                disabled={totalAllocatedPercentage === 100 && !voteAllocationsPercentage[question.id]}
                                                InputProps={{
                                                    inputProps: {
                                                        max: 100 - totalAllocatedPercentage + voteAllocationsPercentage[question.id],
                                                        min: 0,
                                                    },
                                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                }}
                                                id={question.id}
                                                variant="outlined"
                                                onChange={(e) => {
                                                    updateVoteAllocations(question.id, parseFloat(e.target.value))
                                                }}
                                                value={voteAllocationsPercentage[question.id] ? `${voteAllocationsPercentage[question.id]}` : 0}
                                            />
                                            <small>&nbsp;&nbsp; ~{voteAllocations[question.id] ? voteAllocations[question.id] : 0} votes</small>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-span-1 justify-between flex flex-col">
                    <div className="hidden md:block">
                        {!isLoading && (
                            <div className="mb-2">
                                <VoteDetails
                                    loading={isLoading}
                                    appId={typeof voteId === 'string' ? parseInt(voteId) : 0}
                                    globalState={globalState}
                                    roundMetadata={metadata}
                                />
                            </div>
                        )}

                        {!isLoading && (!hasVoteStarted || !activeAddress || !allowedToVote) && (
                            <div className="mb-4">
                                <Box className="bg-red-light flex rounded-xl px-4 py-6">
                                    <div>
                                        <CancelIcon className="align-bottom mr-4 text-red"/>
                                    </div>
                                    <div className="w-full">
                                        {!hasVoteStarted ? (
                                            <Typography>
                                                This voting session is not yet open. Please wait until the voting
                                                session opens to cast votes.
                                            </Typography>
                                        ) : !activeAddress ? (
                                            <div className="flex w-full justify-between">
                                                <div>
                                                    <Typography>You haven’t connected your wallet.</Typography>
                                                </div>
                                                <div className="float-right">
                                                    <Link
                                                        className="no-underline hover:underline text-red"
                                                        href="#"
                                                        onClick={() => setShowConnectedWalletModal(true)}
                                                    >
                                                        Connect wallet
                                                    </Link>
                                                </div>
                                            </div>
                                        ) : !allowedToVote ? (
                                            <Typography>Your wallet is not on the allow list for this voting
                                                round.</Typography>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </Box>
                            </div>
                        )}
                        <div>
                            {canVote && (
                                <div>
                                    <VotingInstructions voteWeight={voteWeight}/>
                                </div>
                            )}

                            {globalState && snapshot && (
                                <div className="mt-4">
                                    <VotingStats isLoading={isLoading} votingRoundGlobalState={globalState}
                                                 snapshot={snapshot}/>
                                </div>
                            )}

                            {globalState && (
                                <div className="mt-4">
                                    <VotingTime className="sm:visible" loading={isLoading}
                                                globalState={globalState}/>
                                </div>
                            )}

                            {isVoteCreator && !globalState?.close_time && globalState?.nft_image_url && (
                                <div className="mb-4">
                                    <CloseVotingRound
                                        closingVotingRoundError={closingVotingRoundError}
                                        loading={closingVotingRound}
                                        handleCloseVotingRound={handleCloseVotingRound}
                                        voteEnded={hasVoteEnded}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        {canVote && (
                            <Box
                                className={clsx(
                                    'flex items-center justify-between bottom-2 px-4 py-6 rounded-xl',
                                    !canSubmitVote ? 'bg-algorand-vote-closed' : 'bg-green-light',
                                )}
                            >
                                <div className="flex">
                                    <div>
                                        <HandThumbUpIcon
                                            className={clsx('align-bottom h-6 w-6 mr-3', !canSubmitVote ? '' : 'text-green')}/>
                                    </div>
                                    <div>
                                        <Typography>
                                            {!hasVoted ? 'Once your allocations total to 100%, you’ll be able to cast your votes!' : "You've already voted!"}
                                        </Typography>
                                    </div>
                                </div>
                                <Button onClick={handleSubmitVote} color="primary" variant="contained"
                                        className="text-right" disabled={!canSubmitVote}>
                                    Submit
                                </Button>
                            </Box>
                        )}
                        {errorSubmittingVote && (
                            <Alert className="max-w-xl mt-4 text-white bg-red-600 font-semibold" icon={false}>
                                <Typography>Could not cast vote:</Typography>
                                <Typography>{errorSubmittingVote}</Typography>
                            </Alert>
                        )}
                    </div>
                </div>
            </div>
            <LoadingDialog loading={submittingVote} title="Submitting vote"
                           note="Please check your wallet for any pending transactions"/>
        </div>
    )
}

export default Vote
// export default withVotingRoute(Vote)
