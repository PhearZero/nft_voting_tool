import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box/Box";
import { CircularProgress } from "@mui/material";
export default function GovernorsList() {
  const params = useParams();
  const [error, setIsError] = useState(false)
  const [data, setData] = useState(null)

  useEffect(() => {
    if(!params.id) return;
   fetch(`/api/ipfs/${params.d}`)
      .then(r=>r.json())
      .then(setData)
      .catch(setIsError)
  },[setData, setIsError, params.slug])
  if(error) return (<div>Error loading proposal</div>);
  if(!data) return (<Box sx={{ display: 'flex' }}>
    <CircularProgress />
  </Box>);
  return <div dangerouslySetInnerHTML={{__html: data.html}}></div>;
}
