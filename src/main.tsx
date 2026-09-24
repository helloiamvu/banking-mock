import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

function fitScreen() {
  const root = document.documentElement
  if (window.matchMedia('(min-width: 700px)').matches) {
    root.style.removeProperty('--app-h')
    return
  }
  const viewport = window.visualViewport
  const covered = (viewport?.offsetTop ?? 0) + (viewport?.height ?? 0)
  const height = Math.max(window.innerHeight, covered)
  root.style.setProperty('--app-h', `${Math.round(height)}px`)
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
