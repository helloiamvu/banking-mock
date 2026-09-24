import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { animate, AnimatePresence, motion, useMotionValue } from 'framer-motion'
import { accounts, currentAccounts, groupTxs, money, txs, type Currency, type Tx } from './data'
import {
  IconArrow, IconBack, IconBag, IconBank, IconCalendar, IconCard, IconChart, IconChat, IconChev, IconRequest, IconUpDown,
  IconClose, IconCopy, IconDoc, IconDots, IconGift, IconHome, IconInfo, IconKeyboard, IconLoop,
  IconMail, IconMenu, IconMic, IconPig, IconPlus, IconQr, IconSearch, IconShare, IconSwap, IconTrash, IconUmbrella,
} from './icons'
import { useNav, type Tab } from './nav'

const art = (file: string) => `${import.meta.env.BASE_URL}art/${file}`

export function StatusBar() {
  const now = new Date()
  const label = now.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
  return (
    <div className="statusbar">
      <span>{label}</span>
      <span className="sig">●●● LTE 100</span>
    </div>
  )
}

export function TabBar() {
  const { tab, setTab } = useNav()
  const items: { id: Tab; label: string; icon: typeof IconHome; dot?: 'orange' | 'red' }[] = [
    { id: 'prehled', label: 'Přehled', icon: IconHome },
    { id: 'odmeny', label: 'Odměny', icon: IconGift, dot: 'orange' },
    { id: 'zaplatit', label: 'Zaplatit', icon: IconArrow },
    { id: 'grafy', label: 'Grafy', icon: IconChart },
    { id: 'menu', label: 'Menu', icon: IconMenu, dot: 'red' },
  ]
  return (
    <nav className="tabbar glass">
      {items.map((item) => {
        const Ico = item.icon
        return (
          <button key={item.id} className={tab === item.id ? 'on' : ''} onClick={() => setTab(item.id)}>
            <Ico size={22} />
            {item.label}
            {item.dot && <i className={item.dot === 'red' ? 'dot red' : 'dot'} />}
          </button>
        )
      })}
    </nav>
  )
}

function Page({ title, children, right }: { title: string; children: ReactNode; right?: ReactNode }) {
  const { pop } = useNav()
  return (
    <div className="pushed">
      <header className="pagehead">
        <button className="circle" onClick={pop} aria-label="Zpět"><IconBack size={22} /></button>
        <h1>{title}</h1>
        <div className="side">{right}</div>
      </header>
      <div className="scroll plain">{children}</div>
    </div>
  )
}

function Amt({ amount, currency }: { amount: number; currency: Currency }) {
  const text = money(Math.abs(amount), currency)
  return <span className={amount > 0 ? 'amt pos' : 'amt'}>{amount < 0 ? '−' : ''}{text}</span>
}

export function Home() {
  const { push, setSheet, setTab } = useNav()
  const [stuck, setStuck] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [offer, setOffer] = useState(0)
  const [insight, setInsight] = useState(0)
  const insights = [
    <>Do 8. 10. zbývá <b>206,12 CZK</b></>,
    <>Na spoření máte <b>300 000,00 CZK</b></>,
    <>Bonusová sazba <b>3,20 % p.a.</b></>,
  ]
  return (
    <div className="home">
      <header className={stuck ? 'toprow stuck' : 'toprow'}>
        <h1>Chytrý přehled</h1>
        <div className="icon-pill glass">
          <button aria-label="Profil" onClick={() => setTab('menu')}><span className="profile-dot" /></button>
          <button aria-label="Aneta" onClick={() => setSheet('aneta')}><IconChat size={22} /><i className="ping" /></button>
          <button aria-label="Zprávy" onClick={() => push({ name: 'messages' })}><IconMail size={22} /><i className="ping" /></button>
        </div>
      </header>
      <div
        className="scroll hero"
        onScroll={(event) => setStuck(event.currentTarget.scrollTop > 8)}
      >
      <div className="balance-block">
        <div className="who">Osobní</div>
        <div className="sum">{hidden ? '••••' : '206,12'} <small>CZK</small></div>
      </div>
      <button className="insight" onClick={() => setInsight((n) => (n + 1) % insights.length)}>
        <span className="i"><IconInfo size={18} /></span>
        <span className="bubble">{insights[insight]}</span>
      </button>
      <div className="dots">{insights.map((_, i) => <i key={i} className={i === insight ? 'on' : ''} />)}</div>

      <div className="actions">
        <button onClick={() => push({ name: 'request' })}><span className="orb"><IconRequest size={22} /></span>Zaplať mi</button>
        <button onClick={() => push({ name: 'cards' })}><span className="orb"><IconCard size={22} /></span>Karty</button>
        <button onClick={() => push({ name: 'pay' })}><span className="orb pay"><IconArrow size={26} /></span>Zaplatit</button>
        <button onClick={() => push({ name: 'qr' })}><span className="orb"><IconQr size={22} /></span>Načíst QR</button>
        <button onClick={() => setSheet('more')}><span className="orb"><IconDots size={22} /></span>Další</button>
      </div>

      <div className="section-h">
        <h2>Běžné účty</h2>
        <button className="round green" aria-label="Přidat účet" onClick={() => push({ name: 'newAccount' })}><IconPlus size={18} /></button>
      </div>
      <div className="card">
        {currentAccounts.map((account) => (
          <button key={account.id} className="row" onClick={() => push({ name: 'accounts', index: currentAccounts.indexOf(account) })}>
            <span className="green"><IconDoc size={26} /></span>
            <span className="name">{account.name}</span>
            <span className="amt">{hidden ? '••••' : money(account.balance, account.currency)}</span>
          </button>
        ))}
      </div>
      <div className="note">
        Na běžných účtech máte k dispozici 206,12 CZK
        <button className="pill" aria-label="Skrýt" onClick={() => setHidden((v) => !v)}>{hidden ? '⌄' : '⌃'}</button>
      </div>

      <div className="section-h">
        <h2>Spoření</h2>
        <div className="tools">
          <button className="round" onClick={() => push({ name: 'bonus' })} aria-label="Sazba"><IconCalendar size={18} /></button>
          <button className="round" onClick={() => push({ name: 'pay' })} aria-label="Převod"><IconUpDown size={18} /></button>
          <button className="round" onClick={() => push({ name: 'settings', kind: 'savings' })} aria-label="Více"><IconDots size={18} /></button>
        </div>
      </div>
      <div className="card">
        <button className="row" onClick={() => push({ name: 'savings' })}>
          <span className="green"><IconLoop size={26} /></span>
          <span className="name">Spořicí účet</span>
          <span className="amt">{hidden ? '••••' : '300 000,00 CZK'}</span>
        </button>
      </div>

      <div className="section-h">
        <h2>Účty jinde</h2>
        <button className="round green" onClick={() => push({ name: 'link' })}><IconPlus size={18} /></button>
      </div>
      <div className="card">
        <div className="row">
          <span className="green"><IconBank size={22} /></span>
          <span className="name">Vu Hoang Anh</span>
          <button className="reconnect green" onClick={() => push({ name: 'link' })}>↻ Znovu propojit</button>
        </div>
      </div>

      <div className="section-h"><h2>Vybrali jsme pro vás</h2></div>
      <article className="card offer marked">
        <h3>{['Naše sazba je opravdu výhodná', 'Spořte s bonusem', 'Investujte od 1 000 Kč', 'Pojištění na cesty', 'Odměny za platby'][offer]}</h3>
        <img className="pct" src={art('percent.png')} alt="" />
        <p>{[
          'Dlouhodobě nabízíme jednu z nejnižších sazeb pro půjčky na trhu. A vám můžeme půjčit až 400 000 Kč.',
          'Na spořicím účtu máte 3,20 % p.a. do 300 000 CZK, když pravidelně spoříte.',
          'Akcie a ETF můžete zadat kdykoliv. Minimální investice je 1 000 CZK.',
          'Pojistěte se na cesty, příjmy, osobní věci i auto.',
          'Za platby kartou se odměny sčítají na jednom místě.',
        ][offer]}</p>
        <button className="btn" onClick={() => {
          if (offer === 0) push({ name: 'loan' })
          else if (offer === 1) push({ name: 'bonus' })
          else if (offer === 2) push({ name: 'invest' })
          else if (offer === 3) push({ name: 'insurance' })
          else setTab('odmeny')
        }}>
          {['Spočítat půjčku', 'Zobrazit sazbu', 'Chci vědět více', 'Prohlédnout', 'Otevřít odměny'][offer]}
        </button>
        <div className="dots" style={{ marginTop: 14 }}>
          {[0, 1, 2, 3, 4].map((n) => (
            <button key={n} className={n === offer ? 'on' : ''} onClick={() => setOffer(n)} aria-label={`Nabídka ${n + 1}`} />
          ))}
        </div>
      </article>

      <button className="product" onClick={() => push({ name: 'loan' })}>
        <span className="green"><IconBag size={22} /></span>
        <span className="grow"><strong>Půjčky a hypotéky</strong><span>Půjčte si na cokoliv, třeba i na vlastní bydlení</span></span>
        <IconChev />
      </button>
      <button className="product" onClick={() => push({ name: 'invest' })}>
        <span className="green"><IconChart size={22} /></span>
        <span className="grow"><strong>Investice a spoření</strong><span>Objevte všechny možnosti investování</span></span>
        <IconChev />
      </button>
      <button className="product" onClick={() => push({ name: 'insurance' })}>
        <span className="green"><IconUmbrella size={22} /></span>
        <span className="grow"><strong>Pojištění</strong><span>Pojistěte se na cesty, ale myslete i na své příjmy, osobní věci a auta</span></span>
        <IconChev />
      </button>
      <div className="section-h"><h2>Služby k účtu</h2></div>
      <button className="product" onClick={() => push({ name: 'settings', kind: 'current' })}>
        <span className="green"><IconDoc size={22} /></span>
        <span className="grow"><strong>Výpisy a limity</strong><span>Potvrzení, limity plateb a poplatky</span></span>
        <IconChev />
      </button>
      </div>
    </div>
  )
}

export function Pay() {
  const { push, draft, setDraft } = useNav()
  const from = currentAccounts.find((a) => a.id === draft.fromId) ?? currentAccounts[0]
  const [amount, setAmount] = useState('')
  const [vs, setVs] = useState('')
  const [msg, setMsg] = useState('')
  const [instant, setInstant] = useState(false)
  const ready = draft.toNumber.length >= 4 && draft.toBank.length === 4 && Number(amount.replace(',', '.')) > 0
  return (
    <Page title="Zaplatit" right={<><button className="circle" aria-label="Vyfotit" onClick={() => push({ name: 'qr' })}><IconCard size={18} /></button><button className="circle" aria-label="QR" onClick={() => push({ name: 'qr' })}><IconQr size={18} /></button></>}>
      <button className="account-card" onClick={() => push({ name: 'pick', mode: 'from' })}>
        <div className="top"><span>{from.name}</span><span>{money(from.balance, from.currency)} ›</span></div>
        <div className="num">{from.number || 'Účet v USD'}</div>
      </button>
      <div className="section-h"><h2 style={{ fontSize: 17 }}>Komu</h2><button className="green" onClick={() => push({ name: 'pick', mode: 'recipient' })}>Vybrat ›</button></div>
      <div className="acc-split">
        <label>Předčíslí<input aria-label="Předčíslí" /></label>
        <span>-</span>
        <label>Číslo účtu<input aria-label="Číslo účtu" value={draft.toNumber} onChange={(e) => setDraft({ toNumber: e.target.value.replace(/\D/g, '').slice(0, 10), toName: '' })} /></label>
        <span>/</span>
        <label>Banka<input aria-label="Banka" value={draft.toBank} onChange={(e) => setDraft({ toBank: e.target.value.replace(/\D/g, '').slice(0, 4) })} /></label>
      </div>
      <div className="field">
        <label><span>Částka</span><span>CZK</span></label>
        <input className="big" inputMode="decimal" value={amount} placeholder="0,00" onChange={(e) => setAmount(e.target.value)} />
      </div>
      <div className="field"><label>Variabilní symbol</label><input value={vs} onChange={(e) => setVs(e.target.value)} /></div>
      <div className="field"><label>Zpráva pro příjemce</label><input value={msg} onChange={(e) => setMsg(e.target.value)} /></div>
      <button className="row card" style={{ marginTop: 10 }} onClick={() => setInstant((v) => !v)}>
        <span>Připsat okamžitě</span>
        <span className={instant ? 'toggle on right' : 'toggle right'}><i /></span>
      </button>
      <div style={{ height: 74 }} />
      <div className="fab">
        <button
          className="btn block"
          disabled={!ready}
          onClick={() => push({ name: 'done', title: 'Platba odeslána', body: `${amount} CZK pro ${draft.toName || 'účet'} ${draft.toNumber}/${draft.toBank}${msg ? `. ${msg}` : ''}${vs ? ` VS ${vs}` : ''}.`, home: true })}
        >
          Pokračovat
        </button>
      </div>
    </Page>
  )
}

export function RequestPay() {
  const { push, draft } = useNav()
  const dest = accounts.find((a) => a.id === draft.requestId) ?? accounts[0]
  const [what, setWhat] = useState('')
  const [amount, setAmount] = useState('0')
  const [split, setSplit] = useState(false)
  return (
    <Page title="Zaplať mi">
      <div className="field"><label>Za co chcete zaplatit?</label><input value={what} onChange={(e) => setWhat(e.target.value)} /></div>
      <button className="row card" style={{ marginTop: 10 }} onClick={() => push({ name: 'pick', mode: 'request' })}>
        <span className="grow">Kam chcete peníze poslat<div className="sub">{dest.number || dest.name}</div></span>
        <span>{dest.name} <IconChev size={16} /></span>
      </button>
      <button className="row card" style={{ marginTop: 10 }} onClick={() => setSplit((v) => !v)}>
        <span>Chci částku rozdělit na části</span>
        <span className={split ? 'toggle on' : 'toggle'}><i /></span>
      </button>
      <div className="field">
        <label>Částka, kterou chci vyžádat <span className="right">CZK</span></label>
        <input className="big" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <p className="muted" style={{ textAlign: 'center', marginTop: 16, fontSize: 14 }}>
        Ukažte nebo sdílejte tento QR kód tomu, kdo vám má poslat peníze.
      </p>
      <div className="qr" />
      <div className="qr-label">QR Platba</div>
      <div className="fab">
        <button className="btn block" onClick={() => push({ name: 'done', title: 'Platební údaje', body: `${what || 'Platba'} · ${amount || '0'} CZK na ${dest.name} ${dest.number}. QR můžete ukázat z předchozí obrazovky.`, home: true })}>
          <IconShare size={18} /> Sdílet platební údaje
        </button>
      </div>
    </Page>
  )
}

function AccountPager({ index, onIndex }: { index: number; onIndex: (next: number) => void }) {
  const x = useMotionValue(0)
  const ref = useRef<HTMLDivElement>(null)
  const indexRef = useRef(index)
  indexRef.current = index
  const account = currentAccounts[index] ?? currentAccounts[0]

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let tracking = false
    let startX = 0
    let startY = 0
    const start = (event: TouchEvent) => {
      if (event.touches.length !== 1) return
      startX = event.touches[0].clientX
      startY = event.touches[0].clientY
      tracking = false
      x.set(0)
    }
    const move = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch) return
      const dx = touch.clientX - startX
      const dy = touch.clientY - startY
      if (!tracking) {
        if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) return
        if (Math.abs(dx) < 4) return
        tracking = true
      }
      event.preventDefault()
      const i = indexRef.current
      const resist = (i === 0 && dx > 0) || (i === currentAccounts.length - 1 && dx < 0)
      x.set(resist ? dx * 0.3 : dx)
    }
    const end = () => {
      if (!tracking) return
      tracking = false
      const dx = x.get()
      const i = indexRef.current
      if (dx < -40 && i < currentAccounts.length - 1) onIndex(i + 1)
      else if (dx > 40 && i > 0) onIndex(i - 1)
      x.set(0)
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
  }, [onIndex, x])

  return (
    <motion.div ref={ref} className="account-card" style={{ x }}>
      <div className="top">
        <span>{account.name} ☺</span>
        <span>{money(account.balance, account.currency)}</span>
      </div>
      <div className="num">{account.number || 'Účet v USD'}</div>
    </motion.div>
  )
}

function SheetPane({ tall, onClose, children }: { tall: boolean; onClose: () => void; children: ReactNode }) {
  const y = useMotionValue(0)
  const grab = useRef<HTMLDivElement>(null)
  const playback = useRef<{ stop: () => void } | null>(null)

  useEffect(() => {
    y.set(window.innerHeight)
    const controls = animate(y, 0, { type: 'spring', stiffness: 420, damping: 38 })
    playback.current = controls
    return () => controls.stop()
  }, [y])

  useEffect(() => {
    const el = grab.current
    if (!el) return
    let startY = 0
    let origin = 0
    const start = (event: TouchEvent) => {
      if (event.touches.length !== 1) return
      playback.current?.stop()
      startY = event.touches[0].clientY
      origin = y.get()
    }
    const move = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch) return
      event.preventDefault()
      y.set(Math.max(0, origin + touch.clientY - startY))
    }
    const end = () => {
      if (y.get() > 90) {
        const controls = animate(y, window.innerHeight, { duration: 0.16 })
        playback.current = controls
        controls.then(onClose)
      } else {
        playback.current = animate(y, 0, { type: 'spring', stiffness: 520, damping: 42 })
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
  }, [onClose, y])

  return (
    <motion.div className={tall ? 'sheet aneta' : 'sheet'} style={{ y }}>
      <div className="grab hit" ref={grab} />
      {children}
    </motion.div>
  )
}

export function Accounts({ index }: { index: number }) {
  const { push } = useNav()
  const [i, setI] = useState(index)
  const [q, setQ] = useState('')
  const account = currentAccounts[i] ?? currentAccounts[0]
  const list = useMemo(() => txs.filter((tx) => tx.accountId === account.id && `${tx.title} ${tx.subtitle}`.toLowerCase().includes(q.toLowerCase())), [account.id, q])
  const groups = groupTxs(list)
  return (
    <Page title="Běžné účty" right={<button className="circle" onClick={() => push({ name: 'settings', kind: 'current' })}><IconDots size={18} /></button>}>
      <AccountPager index={i} onIndex={setI} />
      <div className="dots">
        {currentAccounts.map((item, n) => <button key={item.id} className={n === i ? 'on' : ''} aria-label={item.name} onClick={() => setI(n)} />)}
      </div>
      <button className="banner" onClick={() => push({ name: 'templates' })}>Do 8. 10. nemáte žádné naplánované platby <span className="right">⚙</span></button>
      <div className="section-h payhead">
        <h2>Přehled plateb</h2>
        <label className="search">Hledat <IconSearch size={16} /><input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Hledat" /></label>
      </div>
      {groups.map((group) => (
        <section key={group.label} className="tx-group">
          <div className="tx-head">
            <h3>{group.label}</h3>
            {group.plus > 0 && group.minus < 0 && (
              <div className="tx-sums">
                <div className="pos">{money(group.plus, account.currency)}</div>
                <div>{money(group.minus, account.currency)}</div>
              </div>
            )}
          </div>
          {group.items.map((tx, index) => (
            <TxRow key={tx.id} tx={tx} showDate={tx.when !== tx.group && (index === 0 || group.items[index - 1].when !== tx.when)} />
          ))}
        </section>
      ))}
      {list.length === 0 && <p className="muted" style={{ padding: 12 }}>Nic jsme nenašli.</p>}
      <div style={{ height: 70 }} />
      <div className="fab"><button className="btn block" onClick={() => push({ name: 'pay' })}>→ Nová platba</button></div>
    </Page>
  )
}

function TxRow({ tx, showDate }: { tx: Tx; showDate: boolean }) {
  const { push } = useNav()
  return (
    <>
      {showDate && <div className="date-line">{tx.when}</div>}
      <button className="tx" onClick={() => push({ name: 'done', title: tx.title, body: `${tx.subtitle} · ${tx.when}` })}>
        <span className="avatar">{tx.letter}<i>{tx.badge === 'card' ? '▭' : tx.badge === 'in' ? '↓' : '↑'}</i></span>
        <span className="copy">
          <span className="name">{tx.title}</span>
          <span className="sub">{tx.subtitle}</span>
        </span>
        <Amt amount={tx.amount} currency={tx.currency} />
        <IconChev size={16} />
      </button>
    </>
  )
}

export function Savings() {
  const { push, setSheet } = useNav()
  return (
    <Page
      title="Spořicí účty"
      right={
        <>
          <button className="circle" onClick={() => push({ name: 'bonus' })}><IconCalendar size={18} /></button>
          <button className="circle" onClick={() => push({ name: 'settings', kind: 'savings' })}><IconDots size={18} /></button>
        </>
      }
    >
      <div className="account-card">
        <div className="top"><span>Spořicí účet ☺</span><span>300 000,00 CZK</span></div>
        <div className="num">1124433048/3030</div>
      </div>
      <button className="row card" style={{ marginTop: 12 }} onClick={() => push({ name: 'accounts', index: 0 })}>
        <IconMenu size={18} /> Přehled plateb <IconChev className="right" />
      </button>
      <button className="row card" style={{ marginTop: 10 }} onClick={() => setSheet('funds')}>
        <span>Volné prostředky</span>
        <span className="amt">300 000,00 CZK</span>
      </button>
      <div className="promo">
        <p>Začněte investovat s Portu a sledujte, jak peníze pracují za vás. Snadno a už od 500 Kč. <button className="link" onClick={() => push({ name: 'invest' })}>Zjistit více</button></p>
        <img src={art('bills.png')} alt="" />
      </div>
      <div className="section-h"><h2>Mé obálky</h2></div>
      <article className="card artcard">
        <div>
          <strong>Spořte si na svá přání</strong>
          <p className="muted">Díky spořicím obálkám můžete šetřit na nejrůznější věci a zážitky.</p>
          <button className="green" onClick={() => push({ name: 'envelope' })}><b>Vytvořit novou obálku</b></button>
        </div>
        <img src={art('pig.png')} alt="" />
      </article>
      <article className="card artcard">
        <div>
          <strong>Spořte placením</strong>
          <p className="muted">Odkládejte si s každou platbou kartou trochu peněz na spoření.</p>
          <button className="green" onClick={() => push({ name: 'roundup' })}><b>Prozkoumat drobné spoření</b></button>
        </div>
        <img src={art('pig-card.png')} alt="" />
      </article>
      <div style={{ height: 76 }} />
      <div className="fab"><button className="btn block" onClick={() => push({ name: 'pay' })}>→ Nová platba</button></div>
    </Page>
  )
}

export function Settings({ kind }: { kind: 'current' | 'savings' }) {
  const { push } = useNav()
  const account = kind === 'savings' ? accounts[3] : accounts[0]
  const rows = [
    ['Informace o zůstatku', () => push({ name: 'done', title: 'Zůstatek', body: `${account.name}: ${money(account.balance, account.currency)}` })],
    ['Informace o účtu', () => push({ name: 'done', title: account.name, body: account.number ? `Číslo účtu ${account.number}` : 'Účet v USD zatím nemá číslo v tomhle náhledu.' })],
    ['Založit pravidelné spoření', () => push({ name: 'roundup' })],
    ['Převést účet z jiné banky', () => push({ name: 'link' })],
    ['Poslat potvrzení', () => push({ name: 'done', title: 'Potvrzení', body: `Potvrzení o účtu ${account.name} je připravené k odeslání.` })],
    ['Sdílet přístup k účtu', () => push({ name: 'done', title: 'Přístup', body: `Disponent uvidí ${account.name}. Nového disponenta přidáte z této obrazovky znovu.` })],
    ['Přejmenovat účet', () => push({ name: 'done', title: 'Název účtu', body: `Účet se jmenuje ${account.name}.` })],
    ['Nastavit jako hlavní účet', () => push({ name: 'done', title: 'Hlavní účet', body: 'Osobní je hlavní účet na Chytrém přehledu. Platby, splátky a odměny jdou z něj.' })],
  ] as const
  return (
    <Page title={kind === 'savings' ? 'Spořicí účet' : 'Běžný účet'} right={<button className="circle" aria-label="Sdílet" onClick={() => push({ name: 'done', title: 'Sdílení', body: `${account.name} ${account.number}` })}><IconShare size={18} /></button>}>
      <p style={{ textAlign: 'center', fontWeight: 750, margin: '8px 0 16px' }}>{account.number} <IconCopy size={16} /></p>
      <div className="actions" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <button onClick={() => push({ name: 'limits' })}><span className="orb"><IconSwap size={20} /></span>Limity plateb</button>
        <button onClick={() => push({ name: 'statements' })}><span className="orb"><IconDoc size={20} /></span>Výpisy z účtu</button>
        <button onClick={() => push({ name: 'accounts', index: 0 })}><span className="orb"><IconChart size={20} /></span>Příjmy a výdaje</button>
      </div>
      <div className="card">
        {rows.map(([label, action]) => (
          <button key={label} className="row" onClick={action}><span className="grow">{label}</span><IconChev /></button>
        ))}
      </div>
      <p className="muted" style={{ fontSize: 13, margin: '10px 4px 16px' }}>Hlavní účet uvidíte nahoře na Chytrém přehledu. Bude výchozí pro placení, splátky, poplatky i odměny.</p>
      <button className="row card" style={{ color: 'var(--danger)' }} onClick={() => push({ name: 'done', title: 'Zrušit účet', body: 'Účet v tomhle náhledu zůstává. Zpět vás vrátí na nastavení.' })}>
        <IconTrash size={18} /> Zrušit účet <IconChev className="right" />
      </button>
    </Page>
  )
}

export function Bonus() {
  const { push } = useNav()
  return (
    <Page title="Bonusová sazba">
      <h2 style={{ margin: '8px 0' }}>Tento měsíc</h2>
      <button className="row card" onClick={() => push({ name: 'interest' })}>
        <span className="grow">Aktuální sazba<div className="sub">do 300 tis. CZK</div></span>
        <span className="green"><b>✓ 3,20 % p.a.</b></span>
      </button>
      <div className="promo">
        <p>Začněte investovat s Portu a sledujte, jak peníze pracují za vás. Snadno a už od 500 Kč. <button className="link" onClick={() => push({ name: 'invest' })}>Zjistit více</button></p>
      </div>
      <h2 style={{ margin: '18px 0 8px' }}>Jak příští měsíc získat nejvyšší sazbu</h2>
      <p>V září stačí splnit následující podmínky a nejvyšší námi nabízená sazba je vaše.</p>
      <div className="row card" style={{ marginTop: 12 }}><span className="grow">Pravidelně spoříte</span><span className="green">✓</span></div>
      <button className="row card" style={{ marginTop: 10 }} onClick={() => push({ name: 'interest' })}>
        <span className="green">?</span> Jak úročení funguje <IconChev className="right" />
      </button>
    </Page>
  )
}

export function Interest() {
  return (
    <Page title="Jak úročení funguje">
      <p style={{ lineHeight: 1.45 }}>
        Úročení funguje tak, že jeden měsíc splníte podmínky, druhý měsíc vám budeme úročit nejvyšší námi nabízenou sazbou a první den v následujícím měsíci vám úrok připíšeme.
      </p>
      <h2 style={{ margin: '18px 0 8px' }}>Pravidelně spoříte</h2>
      <p style={{ lineHeight: 1.45 }}>
        Stačí, když vám každý měsíc přijde na spořicí účet libovolná částka z pravidelného nebo drobného spoření, případně z trvalého příkazu u nás. Další možností je posílat si běžnou platbou minimálně 1 000 CZK měsíčně z účtu u nás nebo v jiné bance. Pokud jedno z toho plníte, úročíme částku do 300 000 CZK úrokovou sazbou 3,2 % a vše nad ní pak 2 % ročně. Když platba z pravidelného spoření nedorazí, platí sazba 2 % na všechny peníze na spořicím účtu.
      </p>
    </Page>
  )
}

export function Roundup() {
  const { push, pop } = useNav()
  return (
    <Page title="Drobné spoření" right={<button className="circle" aria-label="Zavřít" onClick={pop}><IconClose size={18} /></button>}>
      <img className="hero-art" src={art('pig-card.png')} alt="" />
      <h2 style={{ textAlign: 'center', letterSpacing: '-0.03em' }}>Naspořte si i tisíce korun ročně, aniž byste na to mysleli</h2>
      <p className="muted" style={{ textAlign: 'center', margin: '12px 0 20px', lineHeight: 1.4 }}>
        Z každé platby kartou vám pár korun odložíme na spořicí účet. Jak rychle budete spořit, si zvolíte podle sebe.
      </p>
      <button className="btn block" onClick={() => push({ name: 'done', title: 'Drobné spoření', body: 'Z každé platby kartou se zaokrouhlení odloží na spořicí účet.', home: true })}>Začít spořit</button>
    </Page>
  )
}

export function Invest() {
  const { push } = useNav()
  return (
    <Page title="Investice a spoření">
      <h2 style={{ marginBottom: 12 }}>Vstupte do světa investování</h2>
      <article className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Investice do akcií</strong><IconChart /></div>
        <p className="muted" style={{ margin: '6px 0 10px' }}>Nakupujte i prodávejte akcie známých firem i oblíbené ETF.</p>
        {['Výnos se odvíjí od vybraného titulu', 'Ideální investice na 3 a více let', 'Nákup i prodej zadáte kdykoliv', 'Investujte už od 1 000 CZK'].map((line) => <p key={line}>✓ {line}</p>)}
        <button className="btn" style={{ marginTop: 12 }} onClick={() => push({ name: 'done', title: 'Portu', body: 'Průměrný výnos portfolií za 5 let je 7,2 % ročně. Investice začíná na 1 000 CZK.' })}>Chci vědět více</button>
      </article>
      <article className="card" style={{ padding: 16, marginTop: 12 }}>
        <strong>Portu investice na míru</strong>
        <p className="muted" style={{ marginTop: 6 }}>Bezstarostně sledujte, jak peníze pracují za vás.</p>
        <p style={{ marginTop: 8 }}>Průměrný výnos portfolií našich klientů za posledních 5 let 7,2 % ročně.</p>
      </article>
    </Page>
  )
}

export function Loan() {
  const { push } = useNav()
  const [amount, setAmount] = useState(150000)
  const monthly = Math.round(amount * 0.018)
  return (
    <Page title="Půjčka">
      <h2>Naše sazba je opravdu výhodná</h2>
      <p style={{ margin: '8px 0 14px' }}>Půjčíme vám až 400 000 Kč. V tomhle náhledu se nic nepodepisuje.</p>
      <div className="field">
        <label>Kolik si chcete půjčit</label>
        <div className="big">{money(amount, 'CZK', 0)}</div>
        <input type="range" min={20000} max={400000} step={10000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      </div>
      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <div className="muted">Orientační splátka</div>
        <strong style={{ fontSize: 22 }}>{money(monthly, 'CZK', 0)}</strong>
      </div>
      <button className="btn block" style={{ marginTop: 16 }} onClick={() => push({ name: 'done', title: 'Půjčka', body: `Částka ${money(amount, 'CZK', 0)}, orientační splátka ${money(monthly, 'CZK', 0)}. Nic se nepodepisuje.`, home: true })}>Pokračovat</button>
    </Page>
  )
}

export function Insurance() {
  const { push } = useNav()
  return (
    <Page title="Pojištění">
      <p>Pojistěte se na cesty, ale myslete i na své příjmy, osobní věci a auta.</p>
      {['Cestovní pojištění', 'Pojištění příjmu', 'Pojištění věcí', 'Pojištění auta'].map((item) => (
        <button key={item} className="row card" style={{ marginTop: 10 }} onClick={() => push({ name: 'done', title: item, body: `${item} si v náhledu jen prohlížíte. Sjednání vás vrátí sem tlačítkem zpět.` })}><span className="green"><IconUmbrella /></span>{item}<IconChev className="right" /></button>
      ))}
    </Page>
  )
}

export function Cards() {
  const [ready, setReady] = useState(false)
  const { push } = useNav()
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 700)
    return () => window.clearTimeout(id)
  }, [])
  if (!ready) {
    return (
      <Page title="Karty">
        <div className="spinner" />
      </Page>
    )
  }
  return (
    <Page title="Karty">
      <div className="debit">
        <strong>Osobní</strong>
        <div className="pan">•••• •••• •••• 3013</div>
        <div>VU HOANG ANH</div>
      </div>
      <button className="row card" style={{ marginTop: 10 }} onClick={() => push({ name: 'done', title: 'PIN', body: 'PIN ke kartě osobního účtu je v tomhle náhledu 2580.' })}>Zobrazit PIN<IconChev className="right" /></button>
      <button className="row card" style={{ marginTop: 10 }} onClick={() => push({ name: 'limits' })}>Limity karty<IconChev className="right" /></button>
      <button className="row card" style={{ marginTop: 10 }} onClick={() => push({ name: 'done', title: 'Karta je aktivní', body: 'Blokaci tady nespouštíme. Karta osobního účtu zůstává aktivní.' })}>Zablokovat kartu<IconChev className="right" /></button>
    </Page>
  )
}

export function QrScan() {
  const { pop, push } = useNav()
  return (
    <div className="finder">
      <header className="pagehead" style={{ color: '#fff', padding: 16 }}>
        <button className="circle" onClick={pop}><IconClose /></button>
        <h1>Načíst QR</h1>
        <span />
      </header>
      <div className="frame" />
      <button className="btn block" style={{ margin: '0 24px' }} onClick={() => push({ name: 'pay' })}>Vyfotit kód</button>
    </div>
  )
}

export function Messages() {
  const { push } = useNav()
  const [text, setText] = useState('')
  return (
    <Page title="Zprávy">
      <div className="card" style={{ padding: 18 }}>
        <strong>Žádné nové zprávy</strong>
        <p className="muted" style={{ marginTop: 6 }}>Až se tu něco objeví, u ikony obálky zůstane oranžová tečka.</p>
      </div>
      <div className="field"><label>Napsat zprávu</label><input value={text} onChange={(e) => setText(e.target.value)} placeholder="Text zprávy" /></div>
      <button className="btn block" style={{ marginTop: 12 }} disabled={!text} onClick={() => push({ name: 'done', title: 'Zpráva', body: `Odesláno: ${text}`, home: true })}>Odeslat</button>
    </Page>
  )
}

export function Pick({ mode }: { mode: 'from' | 'recipient' | 'request' }) {
  const { pop, setDraft } = useNav()
  const rows = mode === 'recipient'
    ? [
        { id: 'sporeni', name: 'Spořicí účet', number: '1124433048/3030', balance: 300000, currency: 'CZK' as const },
        { id: 'osobni', name: 'Vu Hoang Anh', number: '1124433013/3030', balance: 206.12, currency: 'CZK' as const },
      ]
    : mode === 'request'
      ? accounts
      : currentAccounts
  return (
    <Page title={mode === 'recipient' ? 'Komu' : 'Vyberte účet'}>
      {rows.map((account) => (
        <button
          key={account.id}
          className="row card"
          style={{ marginTop: 10 }}
          onClick={() => {
            if (mode === 'from') setDraft({ fromId: account.id })
            else if (mode === 'request') setDraft({ requestId: account.id })
            else {
              const [num, bank] = account.number.split('/')
              setDraft({ toName: account.name, toNumber: num ?? '', toBank: bank ?? '' })
            }
            pop()
          }}
        >
          <span className="grow"><span className="name">{account.name}</span><div className="sub">{account.number || 'USD'}</div></span>
          <span className="amt">{money(account.balance, account.currency)}</span>
        </button>
      ))}
    </Page>
  )
}

export function Limits() {
  return (
    <Page title="Limity">
      <div className="card">
        {[['Platba kartou za den', '50 000 CZK'], ['Okamžitá platba', '100 000 CZK'], ['Výběr z bankomatu', '20 000 CZK']].map(([label, value]) => (
          <div key={label} className="row"><span className="grow">{label}</span><span className="amt">{value}</span></div>
        ))}
      </div>
    </Page>
  )
}

export function Statements() {
  const { push } = useNav()
  return (
    <Page title="Výpisy">
      {['Červenec', 'Červen', 'Květen'].map((month) => (
        <button key={month} className="row card" style={{ marginTop: 10 }} onClick={() => push({ name: 'done', title: `Výpis ${month}`, body: `Výpis za ${month} je připravený. Zpět vás vrátí na seznam.` })}>
          <span className="grow">{month}</span><IconChev />
        </button>
      ))}
    </Page>
  )
}

export function Templates() {
  const { push } = useNav()
  return (
    <Page title="Šablony a trvalé příkazy">
      <button className="row card" onClick={() => push({ name: 'pay' })}>
        <span className="grow"><span className="name">Spořicí účet</span><div className="sub">Trvalý příkaz není nastavený</div></span>
        <IconChev />
      </button>
      <button className="btn block" style={{ marginTop: 16 }} onClick={() => push({ name: 'pay' })}>Nová platba</button>
    </Page>
  )
}

export function LinkBank() {
  const { push } = useNav()
  const [bank, setBank] = useState('Air Bank')
  return (
    <Page title="Propojit účet">
      <div className="field"><label>Banka</label><input value={bank} onChange={(e) => setBank(e.target.value)} /></div>
      <button className="btn block" style={{ marginTop: 16 }} disabled={!bank} onClick={() => push({ name: 'done', title: 'Propojeno', body: `${bank} je na přehledu u účtů jinde.`, home: true })}>Propojit</button>
    </Page>
  )
}

export function NewAccount() {
  const { push } = useNav()
  return (
    <Page title="Nový účet">
      <p className="muted">Vyberte měnu. Účet se v náhledu neotevře doopravdy.</p>
      {(['CZK', 'EUR', 'USD'] as const).map((currency) => (
        <button key={currency} className="row card" style={{ marginTop: 10 }} onClick={() => push({ name: 'done', title: 'Účet', body: `Běžný účet v ${currency} je nachystaný na přehledu.`, home: true })}>
          <span className="grow">Běžný účet {currency}</span><IconChev />
        </button>
      ))}
    </Page>
  )
}

export function Envelope() {
  const [name, setName] = useState('')
  const { push } = useNav()
  return (
    <Page title="Nová obálka">
      <div className="field"><label>Na co šetříte</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Třeba dovolená" /></div>
      <button className="btn block" style={{ marginTop: 16 }} disabled={!name} onClick={() => push({ name: 'done', title: 'Obálka', body: `Obálka „${name}“ je na spořicím účtu. Peníze do ní přesunete převodem.`, home: true })}>Vytvořit</button>
    </Page>
  )
}

export function Done({ title, body, home }: { title: string; body: string; home?: boolean }) {
  const { setTab } = useNav()
  return (
    <Page title={title}>
      <div className="card" style={{ padding: 18 }}>
        <p>{body}</p>
      </div>
      {home && <button className="btn block" style={{ marginTop: 16 }} onClick={() => setTab('prehled')}>Zpět na přehled</button>}
    </Page>
  )
}

export function Rewards() {
  const { push } = useNav()
  return (
    <div className="shell">
      <header className="toprow"><h1>Odměny</h1></header>
      <div className="scroll plain">
      <article className="card offer">
        <h3>Odměny za placení</h3>
        <p>Za platby kartou se tu sčítají odměny. V tomhle náhledu je účet čerstvě bez nových bodů.</p>
        <button className="btn" onClick={() => push({ name: 'done', title: 'Odměny', body: 'Za platby kartou tu zatím není nová odměna. Až nějaká přibyde, uvidíte ji v tomhle seznamu.' })}>Zatím 0 Kč</button>
      </article>
      </div>
    </div>
  )
}

export function Charts() {
  const { push } = useNav()
  const bars = [40, 70, 55, 90, 30, 64]
  return (
    <div className="shell">
      <header className="toprow"><h1>Grafy</h1></header>
      <div className="scroll plain">
      <div className="card">
        <div className="chart">{bars.map((n) => <span key={n} style={{ height: n }} />)}</div>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <button className="row" onClick={() => push({ name: 'accounts', index: 0 })}><span>Příjmy</span><span className="amt pos">320 000,00 CZK</span></button>
        <button className="row" onClick={() => push({ name: 'accounts', index: 0 })}><span>Výdaje</span><span className="amt">−393 099,00 CZK</span></button>
      </div>
      </div>
    </div>
  )
}

export function MenuTab() {
  const { push, setSheet } = useNav()
  const items: [string, () => void][] = [
    ['Profil Vu Hoang Anh', () => push({ name: 'settings', kind: 'current' })],
    ['Karty', () => push({ name: 'cards' })],
    ['Nastavení účtu', () => push({ name: 'settings', kind: 'current' })],
    ['Zprávy', () => push({ name: 'messages' })],
    ['Aneta', () => setSheet('aneta')],
  ]
  return (
    <div className="shell">
      <header className="toprow"><h1>Menu</h1></header>
      <div className="scroll plain">
      <div className="card glass" style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <span className="profile-dot" style={{ width: 44, height: 44 }} />
        <div><strong>Vu Hoang Anh</strong><div className="sub">Osobní účet</div></div>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        {items.map(([label, action]) => (
          <button key={label} className="row" onClick={action}><span className="grow">{label}</span><IconChev /></button>
        ))}
      </div>
      </div>
    </div>
  )
}

export function Sheets() {
  const { sheet, setSheet, push } = useNav()
  return (
    <AnimatePresence>
      {sheet && (
        <>
          <motion.button className="sheet-back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(null)} />
          <SheetPane tall={sheet === 'aneta'} onClose={() => setSheet(null)}>
            {sheet === 'funds' && (
              <>
                <div className="section-h"><h2>Volné prostředky</h2><button onClick={() => setSheet(null)}><IconClose /></button></div>
                <div className="row"><span>Máte naspořeno</span><span className="amt">300 000,00 CZK</span></div>
                <button className="menu-item" onClick={() => push({ name: 'pay' })}><IconSwap /> Převod peněz na účet <IconChev className="right" /></button>
                <button className="menu-item" onClick={() => push({ name: 'roundup' })}><IconPig /> Přidat pravidelné spoření <IconChev className="right" /></button>
                <button className="menu-item" onClick={() => push({ name: 'envelope' })}><IconMail /> Vytvořit novou obálku <IconChev className="right" /></button>
              </>
            )}
            {sheet === 'more' && (
              <>
                <div className="section-h"><h2>Další</h2><button onClick={() => setSheet(null)}><IconClose /></button></div>
                <button className="menu-item" onClick={() => push({ name: 'pay' })}>Trvalé příkazy</button>
                <button className="menu-item" onClick={() => push({ name: 'templates' })}>Šablony plateb</button>
                <button className="menu-item" onClick={() => push({ name: 'request' })}>Vyžádat platbu</button>
                <button className="menu-item" onClick={() => push({ name: 'qr' })}>Načíst QR</button>
              </>
            )}
            {sheet === 'aneta' && <Aneta onClose={() => setSheet(null)} />}
          </SheetPane>
        </>
      )}
    </AnimatePresence>
  )
}

function Aneta({ onClose }: { onClose: () => void }) {
  const [lines, setLines] = useState<string[]>([])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  function ask(text: string) {
    const answer = text.includes('PIN')
      ? 'PIN ke kartě je 2580. Stejné číslo je v Kartách.'
      : text.includes('zhodnot')
        ? 'Spořicí účet úročí 3,20 % p.a. do 300 000 CZK.'
        : text.includes('mluv')
          ? 'Hlas v náhledu nepouštíme. Napište to tlačítkem Psát.'
          : 'Podívejte se do Přehledu, nebo mi napište, kterého účtu se to týká.'
    setLines((prev) => [...prev, `Vy: ${text}`, `Aneta: ${answer}`])
    setDraft('')
    setTyping(false)
  }
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span className="green">?</span>
        <img className="face" src={art('aneta.png')} alt="" />
        <button onClick={onClose}><IconClose /></button>
      </div>
      <div className="log">
        <p>Zdravím, jsem Aneta 👋 AI asistentka a více o mně se dočtete v obchodních podmínkách. S čím vám pomůžu?</p>
        {lines.map((line) => <p key={line}>{line}</p>)}
        {typing ? (
          <input value={draft} autoFocus placeholder="Napište Anetě" onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && draft) ask(draft) }} />
        ) : (
          <div className="chips">
            <button onClick={() => ask('Jak si zobrazím PIN?')}>Jak si zobrazím PIN?</button>
            <button onClick={() => ask('Jak zhodnotím peníze?')}>Jak zhodnotím peníze?</button>
          </div>
        )}
      </div>
      <div className="composer">
        <button onClick={() => ask('Chci mluvit')}><span className="round"><IconMic /></span>Mluvit</button>
        <button onClick={() => setTyping(true)}><span className="round"><IconKeyboard /></span>Psát</button>
      </div>
    </>
  )
}
