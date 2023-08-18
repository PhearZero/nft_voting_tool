import * as React from "react";
import VotingRounds from "@/features/rounds";
import RequireCreator from "@/shared/router/RequireCreator";
import RoundInfo from "@/features/vote-creation/RoundInfo";
import Review from "@/features/vote-creation/review";
import Vote from "@/features/vote";
import ConnectWallet from "@/features/wallet/ConnectWallet";
import Status from "@/features/status";
import {Route, Routes} from "react-router-dom";
import Layout from "@/_layout";
import ProposalDetails from '@/features/proposals/Details'
import {ProposalsList} from '@/features/proposals/List'
import {NotFound} from "@/404";
import {ErrorPage} from "@/500";
import CreateProposalPage from "@/features/proposals/CreateProposal";
export const Router = () => {
  return (
    <Routes>
      <Route path="/"  errorElement={<ErrorPage/>}  element={<Layout />} >
        <Route path="" element={<VotingRounds/>}/>
        <Route path="create" element={<RequireCreator/>}>
          <Route path="" element={<RoundInfo/>}/>
          <Route path="review" element={<Review/>}/>
        </Route>
        <Route path="vote/:voteId" element={<Vote />} />
        <Route path="connect-wallet" element={<ConnectWallet />} />
        <Route path="status" element={<Status />} />
        <Route path="proposals/:slug" element={<ProposalDetails/>} />
        <Route path="proposals" element={<ProposalsList/>} />
        <Route path="proposals/create" element={<CreateProposalPage/>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
