# Overview

Outline of recommended features and fixes for the NFT Voting Tool.

## ✨ Suggested New Features

- server side rendering
- pre-rendering markdown proposals
- create proposals from the UI

### Reasoning

Adding proposals directly into the `xgov-ui` and pre-rendering the markdown will improve SEO, UX, and performance.
Using SSR Rendering/Pre-Rendering, content can be easily accessed by search engines and allows
rich links back to the proposal.

Additionally, it would be good to allow users to create new proposals from the `xgov-ui` while
retaining the current workflow of creating a proposal via a PR.

### Workflow Example:

### @algorandfoundation/xgov-ui

1. Convert the project to `ssr` to improve SEO and performance. (Do not rely on Cloudflare SPA router)
    1. Refactor Routes into a `Routes.tsx` component
    2. Create client & server entrypoint files with their respective `RouterProvider`
    3. Mount the `xgov-api` in the `ssr` service as `/api`
2. Prerender the proposal markdown directly in the `xgov-ui`
    1. Add xGov proposals repository as a git `submoudle` in `./packages/xgov-proposals`
    2. Use `vite-markdown-plugin` to render the markdown in the `xgov-ui` under route `/proposals/{SLUG}`
3. Add ability to create Proposal from a `template` and `form` in the UI
    1. Create Form component in `xgov-ui` to create a proposal
    2. On Submit, open a new tab that points to `https://github.com/algorandfoundation/xGov/new/main/Proposals?filename={THE_FILENAME}&value={PREFILLED_TEMPLATE}`



## 🛑 High Priority Fix

- Remove `dapp` from the `monorepo` and consolidate into `xgov-dapp`
- Update Documentation


## ⚠️ Medium Priority Fix

Convert to `workspace` with linked dependencies. Refactor package names

### Reasoning

Workspaces allow for symlinked dependencies from a shared `node_modules` folder.
This allows for faster development and less wear and tear on the hard drive since dependencies are
shared across projects. While moving to workspaces, we can also rename the packages to be more consistent.

### Refactor Example:

### @algorandfoundation/xgov-ui

1. Move `./src/xgov-dapp` to `./packages/xgov-ui` and rename package to `@algorandfoundation/xgov-ui`.
2. Link the Smart Contract as a npm module (`@algorandfoundation/xgov-dapp`) which will eventually export the contract artifacts.

### @algorandfoundation/xgov-api

1. Move `./src/voting-metadata-api` to `./packages/xgov-api` and rename package to `@algorandfoundation/xgov-api`.
2. Fix `package.json` and export the express `app` which can be mounted in other projects

### @algorandfoundation/xgov-contract

1. Move `./src/algorand` to `./packages/xgov-contract` and rename package to `@algorandfoundation/xgov-contract`.
2. Allow for packaging as a npm module which exports the application artifacts.


### Create ./package.json
```json
{
  "name": "xgov.algorand.foundation",
  "description": "Workspace for xGov Algorand Foundation",
  "private": true,
  "workspaces": [
    "infrastructure",
    "src/*"
  ],
  "directories": {
    "doc": "docs"
  },
  "scripts": {
    "clean": "find . -name \"node_modules\" -type d -prune -exec rm -rf '{}' +",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Algorand Foundation",
  "license": "MIT"
}

```
