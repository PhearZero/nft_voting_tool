// @/src/entry-server.tsx
import ReactDOMServer from "react-dom/server";
import {StaticRouter, createStaticRouter, createStaticHandler} from "react-router-dom/server";
import React from "react";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {StyledEngineProvider} from "@mui/material/styles";
import {theme} from "./theme";
import {RecoilRoot} from "recoil";
import {Router} from "./routes";
import './main.css'


interface IRenderProps {
  path: string;
}

export const render = ({ path }: IRenderProps) => {
  console.log(path);
  return ReactDOMServer.renderToString(
      <React.StrictMode>
        <CssBaseline />
        <StyledEngineProvider>
          <ThemeProvider theme={theme}>
            <RecoilRoot>
              <StaticRouter location={path}>
              <Router />
              </StaticRouter>
            </RecoilRoot>
          </ThemeProvider>
        </StyledEngineProvider>
      </React.StrictMode>
  );
};
