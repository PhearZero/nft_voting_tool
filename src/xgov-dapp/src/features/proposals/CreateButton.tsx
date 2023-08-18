import { Link } from "react-router-dom";
import { Button, ButtonProps } from "@mui/material";

const GITHUB_URL = 'https://github.com/PhearZero/xGov/new/main/Proposals'

const TEMPLATE = `---
period: 1
title: Example Proposal
author: Firstname Lastname (Social Media Handles)
company_name: Company Name
category: Category
focus_area: Focus Area
open_source: Yes
amount_requested: 100000
status: TODO
---

## Abstract
<!-- add abstract details -->

## Team
<!-- ARC Manager at Algorand Foundation. -->

## Experience with Algorand
<!-- Member of Algorand Foundation. -->

## Roadmap
<!-- Every quarter this will be updated to match the current period. -->

## Benefits for the community
<!-- It allows xGov voters to spend their vote even if they are not interested in other proposals. -->

## Additional information
<!-- None. -->

`

export default function CreateProposalButton({ children, template = TEMPLATE, index, ...rest }: {children?: any, template: string, index: number, rest?: ButtonProps }) {
  return (
    <Button
      component={Link}
      variant="contained"
      to={`${GITHUB_URL}?filename=xgov-${index}.md&value=${encodeURI(template).replace(/#/g,'%23')}`}
      target="_blank"
      {...rest}
    >
      {children || "Create New Proposal"}
    </Button>
  );
}
