import { TemplateData } from "@/features/proposals/index.dts";

const modules = import.meta.glob("../../../../xgov-proposals/Proposals/*.md");
import { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/mui";
import React from "react";
import { useNavigate } from 'react-router-dom';

const _data = await Promise.all(Object.keys(modules).map((key) => {
  const path = key.split('/').pop()?.replace('.md', '') || 'xgov-1'
  return import(`../../../../xgov-proposals/Proposals/${path}.md`).then((data) => {
    return data.attributes
  });
}));
console.log(_data)
const GITHUB_URL = 'https://github.com/PhearZero/xGov/new/main/Proposals'


function genTemplate(data: TemplateData): string {
  return `---
period: ${data.period}
title: ${data.title}
author: ${data.author}
company_name: ${data.company_name}
category: ${data.category}
focus_area: ${data.focus_area}
open_source: ${data.open_source}
amount_requested: ${data.amount_requested}
status: ${data.status}
---

## Abstract
${data.details.abstract}

## Team
${data.details.team}

## Experience with Algorand
${data.details.experience}

## Roadmap
${data.details.roadmap}

## Benefits for the community
${data.details.benefits}

## Additional information
${data.details.additional}

`;
}

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

`;
const schema: RJSFSchema = {
  title: "Create Proposal",
  type: "object",
  required: ["title", "author", "company_name", "category", "focus_area", "open_source", "amount_requested", "status", "details"],
  properties: {
    title: { type: "string", title: "Title" },
    author: { type: "string", title: "Author" },
    company_name: { type: "string", title: "Company Name" },
    category: { type: "string", title: "Category" },
    focus_area: { type: "string", title: "Focus Area" },
    open_source: { type: "boolean", title: "Open Source", default: false },
    amount_requested: { type: "number", title: "Amount Requested" },
    period: { type: "number", title: "Period" },
    status: { type: "string", title: "Status" },
    details: {
      type: "object",
      title: "Details",
      required: ["abstract", "team", "experience", "roadmap", "benefits", "additional"],
      properties: {
        abstract: { type: "string", title: "Abstract", description: "Add abstract details" },
        team: { type: "string", title: "Team" },
        experience: { type: "string", title: "Experience" },
        roadmap: { type: "string", title: "Roadmap" },
        benefits: { type: "string", title: "Benefits" },
        additional: { type: "string", title: "Additional" },
      }
    }
  }
};

const lastIndex = Object.keys(modules).map((key) => {
  const num = key.split("/").pop()?.replace(".md", "").replace("xgov-", "") || "0";
  return parseInt(num);
}).sort((a, b) => a - b).pop() || 0;
export default function CreateProposalPage() {
  const navigate = useNavigate()
  return (
    <main>
      <Form
        onSubmit={async ({formData}) => {
          const template = genTemplate(formData as TemplateData)
          const encodedTemplate = encodeURI(template).replace(/#/g,'%23')
          const url = `${GITHUB_URL}?filename=xgov-${lastIndex + 1}.md&value=${encodedTemplate}`
          window.open(url, '_blank')
          navigate('/')
        }}

        uiSchema={{
        details: {
          abstract: { "ui:widget": "textarea" },
          team: { "ui:widget": "textarea" },
          experience: { "ui:widget": "textarea" },
          roadmap: { "ui:widget": "textarea" },
          benefits: { "ui:widget": "textarea" },
          additional: { "ui:widget": "textarea" },
      }}} schema={schema} validator={validator}/>
      {/*  <Button onClick={()=>{console.log('clicked')}}>Submit</Button>*/}
      {/*</Form>*/}
    </main>
  );
}
