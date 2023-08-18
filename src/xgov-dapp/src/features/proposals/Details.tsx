import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box/Box";
import { AppBar, Button, CircularProgress, IconButton, Toolbar, Typography } from "@mui/material";
import CreateProposalButton from "@/features/proposals/CreateButton";
const modules = import.meta.glob('../../../../xgov-proposals/Proposals/*.md')

const lastIndex = Object.keys(modules).map((key) => {
  const num = key.split("/").pop()?.replace(".md", '').replace('xgov-', '') || "0"
  return parseInt(num);
}).sort((a, b) => a - b).pop() || 0;

export default function ProposalDetails() {
  const params = useParams();
  const [error, setIsError] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!params.slug) return;
    import((`../../../../xgov-proposals/Proposals/${params.slug}.md`))
      .then(setData)
      .catch(setIsError);
  }, [setData, setIsError, params.slug]);
  if (error) return (<div>Error loading proposal</div>);
  if (!data) return (<Box sx={{ display: "flex" }}>
    <CircularProgress />
  </Box>);
  return (
    <>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" component={Link} to="/proposals/create">Create Proposal</Button>
      </Toolbar>
      <div dangerouslySetInnerHTML={{ __html: data.html }}></div>
    </>
  );
}
