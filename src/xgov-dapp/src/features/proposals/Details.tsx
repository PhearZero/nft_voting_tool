import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box/Box";
import { CircularProgress } from "@mui/material";
export default function ProposalDetails() {
  const params = useParams();
  const [error, setIsError] = useState(false)
  const [data, setData] = useState(null)

  useEffect(() => {
    if(!params.slug) return;
    import((`../../../../xgov-proposals/Proposals/${params.slug}.md`))
        .then(setData)
        .catch(setIsError)
  },[setData, setIsError, params.slug])
  if(error) return (<div>Error loading proposal</div>);
  if(!data) return (<Box sx={{ display: 'flex' }}>
    <CircularProgress />
  </Box>);
  return <div dangerouslySetInnerHTML={{__html: data.html}}></div>;
}
