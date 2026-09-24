import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type Tab = 'prehled' | 'odmeny' | 'zaplatit' | 'grafy' | 'menu'

export type Screen =
  | { name: 'pay' }
  | { name: 'request' }
  | { name: 'cards' }
  | { name: 'qr' }
  | { name: 'accounts'; index: number }
  | { name: 'savings' }
  | { name: 'settings'; kind: 'current' | 'savings' }
  | { name: 'bonus' }
  | { name: 'interest' }
  | { name: 'roundup' }
  | { name: 'invest' }
  | { name: 'loan' }
  | { name: 'insurance' }
  | { name: 'messages' }
  | { name: 'envelope' }
  | { name: 'pick'; mode: 'from' | 'recipient' | 'request' }
  | { name: 'limits' }
  | { name: 'statements' }
  | { name: 'templates' }
  | { name: 'link' }
  | { name: 'newAccount' }
  | { name: 'done'; title: string; body: string; home?: boolean }

export type SheetName = 'funds' | 'more' | 'aneta' | null

export type Draft = {
  fromId: string
  toName: string
  toNumber: string
  toBank: string
  requestId: string
}

type NavValue = {
  tab: Tab
  stack: Screen[]
  sheet: SheetName
  toast: string
  draft: Draft
  push: (screen: Screen) => void
  pop: () => void
  setTab: (tab: Tab) => void
  setSheet: (sheet: SheetName) => void
  setDraft: (patch: Partial<Draft>) => void
  showToast: (text: string) => void
}

const NavContext = createContext<NavValue | null>(null)

export function NavProvider({ children }: { children: ReactNode }) {
  const [tab, setTabState] = useState<Tab>('prehled')
  const [stack, setStack] = useState<Screen[]>([])
  const [sheet, setSheet] = useState<SheetName>(null)
  const [toast, setToast] = useState('')
  const [draft, setDraftState] = useState<Draft>({
    fromId: 'osobni',
    toName: '',
    toNumber: '',
    toBank: '',
    requestId: 'osobni',
  })

  const value = useMemo<NavValue>(() => ({
    tab,
    stack,
    sheet,
    toast,
    draft,
    push: (screen) => {
      setSheet(null)
      setStack((prev) => [...prev, screen])
    },
    pop: () => setStack((prev) => prev.slice(0, -1)),
    setTab: (next) => {
      setSheet(null)
      setStack([])
      if (next === 'zaplatit') {
        setTabState('prehled')
        setStack([{ name: 'pay' }])
        return
      }
      setTabState(next)
    },
    setSheet,
    setDraft: (patch) => setDraftState((prev) => ({ ...prev, ...patch })),
    showToast: (text) => {
      setToast(text)
      window.setTimeout(() => setToast(''), 1600)
    },
  }), [draft, sheet, stack, tab, toast])

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>
}

export function useNav() {
  const value = useContext(NavContext)
  if (!value) throw new Error('nav')
  return value
}
