import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

function fitScreen() {
  const viewport = window.visualViewport
  const height = viewport?.height ?? window.innerHeight
  const top = viewport?.offsetTop ?? 0
  const root = document.documentElement
  root.style.setProperty('--app-h', `${Math.round(height)}px`)
  root.style.setProperty('--app-top', `${Math.round(top)}px`)
}

fitScreen()
window.visualViewport?.addEventListener('resize', fitScreen)
window.visualViewport?.addEventListener('scroll', fitScreen)
window.addEventListener('resize', fitScreen)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
