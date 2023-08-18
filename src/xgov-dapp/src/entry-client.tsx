import {Button, CssBaseline, ThemeProvider} from '@mui/material'
import { StyledEngineProvider } from '@mui/material/styles'
import React from 'react'
import ReactDOM from 'react-dom/client'
import {RouterProvider, createBrowserRouter, BrowserRouter} from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import './main.css'
import { getTheme } from './theme'
import {Router} from "./routes";

const rootElement = document.getElementById('root') as HTMLElement

ReactDOM.createRoot(rootElement).render(

  <React.StrictMode>
    <CssBaseline />
    <StyledEngineProvider>
      <ThemeProvider theme={getTheme(rootElement)}>
        <RecoilRoot>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </RecoilRoot>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>
)
