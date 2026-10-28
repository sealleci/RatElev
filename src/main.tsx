import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './app/App.tsx'

import './styles/tokens.css'
import './styles/global.css'

const rootElement = document.getElementById('root')

if (rootElement !== null) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} else { }
