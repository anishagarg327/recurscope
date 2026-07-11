import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ExecutionProvider } from './context/ExecutionContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ExecutionProvider>
      <App />
    </ExecutionProvider>
  </StrictMode>,
)
