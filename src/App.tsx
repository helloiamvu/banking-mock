import { animate, motion, useMotionValue } from 'framer-motion'
import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react'
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
  const drag = useRef({ on: false, armed: false, x: 0, y: 0, lastX: 0, lastT: 0, v: 0, id: -1 })
  const depth = useRef(0)

  useEffect(() => {
    const next = Number(screenKey)
    const pushed = next > depth.current
    depth.current = next
    if (!pushed) {
      x.set(0)
      return
    }
    const w = ref.current?.offsetWidth ?? window.innerWidth
    x.set(w)
    const controls = animate(x, 0, { type: 'spring', stiffness: 380, damping: 42 })
    return () => controls.stop()
  }, [screenKey, x])

  function width() {
    return ref.current?.offsetWidth ?? window.innerWidth
  }

  function finish(popIt: boolean) {
    const w = width()
    if (popIt) {
      animate(x, w, { type: 'tween', duration: 0.2, ease: [0.32, 0.72, 0, 1] }).then(pop)
    } else {
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 42, mass: 0.7 })
    }
  }

  function down(event: PointerEvent<HTMLDivElement>) {
    if (event.clientX > 28) return
    const state = drag.current
    state.on = true
    state.armed = false
    state.x = event.clientX
    state.y = event.clientY
    state.lastX = event.clientX
    state.lastT = performance.now()
    state.v = 0
    state.id = event.pointerId
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current
    if (!state.on || event.pointerId !== state.id) return
    const dx = event.clientX - state.x
    const dy = event.clientY - state.y
    if (!state.armed) {
      if (Math.abs(dy) > 14 && Math.abs(dy) > Math.abs(dx)) {
        state.on = false
        return
      }
      if (dx < 8) return
      state.armed = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    const now = performance.now()
    const dt = now - state.lastT
    if (dt > 0) state.v = (event.clientX - state.lastX) / dt
    state.lastX = event.clientX
    state.lastT = now
    x.set(Math.max(0, dx))
  }

  function up(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current
    if (!state.on || event.pointerId !== state.id) return
    state.on = false
    if (!state.armed) return
    const gone = x.get() > width() * 0.33 || state.v > 0.55
    finish(gone)
  }

  return (
    <motion.div
      key={screenKey}
      ref={ref}
      className="stage front swipe"
      style={{ x }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    >
      {children}
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
