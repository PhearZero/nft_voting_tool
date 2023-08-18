import * as React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box/Box";
import { Button, Card, CardActions, CardContent, CardHeader, Grid, IconButton, Toolbar, Typography } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import LaunchIcon from '@mui/icons-material/Launch';
const modules = import.meta.glob("../../../../xgov-proposals/Proposals/*.md");

const res = await Promise.all(Object.keys(modules).map((key, i) => {
  const path = key.split("/").pop()?.replace(".md", "") || "xgov-1";
  return import(`../../../../xgov-proposals/Proposals/${path}.md`).then((data) => {
    return {data, path}
  });
}));

function ProposalInfo({ data: {attributes}, path }: { data: {attributes: any, html: string}, path: string }) {
  // const match = html.match(/(?<=<h2>Abstract<\/h2>)[\s\S]*?(?=<h2>)/g);
  console.log(attributes)
  return (
      <Card sx={{ width: 450 }}>
        <CardHeader
          action={
            <IconButton component={Link} to={`/proposals/${path}`}>
              <LaunchIcon />
            </IconButton>
          }
          title={attributes.title}
          subheader={attributes.author}
        />
        <CardContent>
          <Typography>Period: {attributes.period}</Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>
  );

}

export function ProposalsList() {
  return (<>
    <Toolbar>
      <Box sx={{ flexGrow: 1 }} />
      <Button variant="contained" component={Link} to="/proposals/create">Create Proposal</Button>
    </Toolbar>
    <Grid container spacing={2}>
      {res.map((props, index) => {
        return <Grid item><ProposalInfo key={index} {...props} /></Grid>;
      })}
    </Grid>
  </>);
}
