import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
export default function ProposalDetails() {
  const params = useParams();
  const [error, setIsError] = useState(false)
  const [data, setData] = useState(null)

  useEffect(() => {
    import((`../../../../xgov-proposals/Proposals/${params.slug}.md`))
        .then(setData)
        .catch(setIsError)
  },[setData, setIsError, params.slug])
  if(error) return (<div>Error loading proposal</div>);
  if(!data) return (<div>Loading...</div>);
  return <div dangerouslySetInnerHTML={{__html: data.html}}></div>;
}
