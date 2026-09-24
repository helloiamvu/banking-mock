import { animate, motion, useMotionValue } from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'
import { NavProvider, useNav, type Screen } from './nav'
import {
  Accounts, Bonus, Cards, Charts, Done, Envelope, Home, Insurance, Interest, Invest, Limits,
  LinkBank, Loan, MenuTab, Messages, NewAccount, Pay, Pick, QrScan, RequestPay, Rewards,
  Roundup, Savings, Settings, Sheets, Statements, StatusBar, TabBar, Templates,
} from './views'

function ScreenBody({ screen }: { screen: Screen }) {
  if (screen.name === 'pay') return <Pay />
  if (screen.name === 'request') return <RequestPay />
  if (screen.name === 'cards') return <Cards />
  if (screen.name === 'qr') return <QrScan />
  if (screen.name === 'accounts') return <Accounts index={screen.index} />
  if (screen.name === 'savings') return <Savings />
  if (screen.name === 'settings') return <Settings kind={screen.kind} />
  if (screen.name === 'bonus') return <Bonus />
  if (screen.name === 'interest') return <Interest />
  if (screen.name === 'roundup') return <Roundup />
  if (screen.name === 'invest') return <Invest />
  if (screen.name === 'loan') return <Loan />
  if (screen.name === 'insurance') return <Insurance />
  if (screen.name === 'messages') return <Messages />
  if (screen.name === 'envelope') return <Envelope />
  if (screen.name === 'done') return <Done title={screen.title} body={screen.body} home={screen.home} />
  if (screen.name === 'pick') return <Pick mode={screen.mode} />
  if (screen.name === 'limits') return <Limits />
  if (screen.name === 'statements') return <Statements />
  if (screen.name === 'templates') return <Templates />
  if (screen.name === 'link') return <LinkBank />
  if (screen.name === 'newAccount') return <NewAccount />
  return null
}

function SwipeBack({ screenKey, children }: { screenKey: string; children: ReactNode }) {
  const { pop } = useNav()
  const x = useMotionValue(0)
  const ref = useRef<HTMLDivElement>(null)
  const edge = useRef<HTMLDivElement>(null)
  const playback = useRef<{ stop: () => void } | null>(null)
  const depth = useRef(0)

  useEffect(() => {
    const next = Number(screenKey)
    const pushed = next > depth.current
    depth.current = next
    if (!pushed) {
      playback.current?.stop()
      x.set(0)
      return
    }
    const w = ref.current?.offsetWidth ?? window.innerWidth
    x.set(w)
    const controls = animate(x, 0, { type: 'spring', stiffness: 380, damping: 42 })
    playback.current = controls
    return () => controls.stop()
  }, [screenKey, x])

  useEffect(() => {
    const el = edge.current
    if (!el) return
    let tracking = false
    let origin = 0
    let startX = 0
    let startY = 0
    let lastX = 0
    let lastT = 0
    let velocity = 0

    const start = (event: TouchEvent) => {
      if (event.touches.length !== 1) return
      playback.current?.stop()
      const touch = event.touches[0]
      tracking = false
      origin = x.get()
      startX = touch.clientX
      startY = touch.clientY
      lastX = touch.clientX
      lastT = performance.now()
      velocity = 0
    }
    const move = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch) return
      const dx = touch.clientX - startX
      const dy = touch.clientY - startY
      if (!tracking) {
        if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) return
        if (dx <= 0) return
        tracking = true
      }
      event.preventDefault()
      const now = performance.now()
      const dt = now - lastT
      if (dt > 0) velocity = (touch.clientX - lastX) / dt
      lastX = touch.clientX
      lastT = now
      x.set(Math.max(0, origin + dx))
    }
    const end = () => {
      if (!tracking) return
      tracking = false
      const w = ref.current?.offsetWidth ?? window.innerWidth
      if (x.get() > w * 0.28 || velocity > 0.4) {
        const controls = animate(x, w, { duration: 0.16, ease: [0.2, 0.8, 0.2, 1] })
        playback.current = controls
        controls.then(pop)
      } else {
        playback.current = animate(x, 0, { type: 'spring', stiffness: 520, damping: 46 })
      }
    }
    el.addEventListener('touchstart', start, { passive: true })
    el.addEventListener('touchmove', move, { passive: false })
    el.addEventListener('touchend', end)
    el.addEventListener('touchcancel', end)
    return () => {
      el.removeEventListener('touchstart', start)
      el.removeEventListener('touchmove', move)
      el.removeEventListener('touchend', end)
      el.removeEventListener('touchcancel', end)
    }
  }, [pop, x])

  return (
    <motion.div key={screenKey} ref={ref} className="stage front swipe" style={{ x }}>
      {children}
      <div className="edge" ref={edge} />
    </motion.div>
  )
}

function Stage() {
  const { tab, stack, toast } = useNav()
  const top = stack[stack.length - 1]
  const under = stack.length > 1 ? stack[stack.length - 2] : null
  return (
    <div className="device">
      <StatusBar />
      <div className="stage">
        {under ? <ScreenBody screen={under} /> : (
          <>
            {tab === 'prehled' && <Home />}
            {tab === 'odmeny' && <Rewards />}
            {tab === 'grafy' && <Charts />}
            {tab === 'menu' && <MenuTab />}
          </>
        )}
      </div>
      {top && (
        <SwipeBack screenKey={String(stack.length)}>
          <ScreenBody screen={top} />
        </SwipeBack>
      )}
      {!top && <TabBar />}
      <Sheets />
      {toast && <div className="toast glass">{toast}</div>}
    </div>
  )
}

export default function App() {
  return (
    <NavProvider>
      <Stage />
    </NavProvider>
  )
}
