import { AnimatePresence, motion } from 'framer-motion'
import { NavProvider, useNav } from './nav'
import {
  Accounts, Bonus, Cards, Charts, Done, Envelope, Home, Insurance, Interest, Invest, Limits,
  LinkBank, Loan, MenuTab, Messages, NewAccount, Pay, Pick, QrScan, RequestPay, Rewards,
  Roundup, Savings, Settings, Sheets, Statements, StatusBar, TabBar, Templates,
} from './views'

function Stage() {
  const { tab, stack, toast } = useNav()
  const top = stack[stack.length - 1]
  return (
    <div className="device">
      <StatusBar />
      <div className="stage">
        {tab === 'prehled' && <Home />}
        {tab === 'odmeny' && <Rewards />}
        {tab === 'grafy' && <Charts />}
        {tab === 'menu' && <MenuTab />}
      </div>
      <AnimatePresence>
        {top && (
          <motion.div
            key={stack.length}
            className="stage front"
            style={{ background: '#f6f6f7' }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
          >
            {top.name === 'pay' && <Pay />}
            {top.name === 'request' && <RequestPay />}
            {top.name === 'cards' && <Cards />}
            {top.name === 'qr' && <QrScan />}
            {top.name === 'accounts' && <Accounts index={top.index} />}
            {top.name === 'savings' && <Savings />}
            {top.name === 'settings' && <Settings kind={top.kind} />}
            {top.name === 'bonus' && <Bonus />}
            {top.name === 'interest' && <Interest />}
            {top.name === 'roundup' && <Roundup />}
            {top.name === 'invest' && <Invest />}
            {top.name === 'loan' && <Loan />}
            {top.name === 'insurance' && <Insurance />}
            {top.name === 'messages' && <Messages />}
            {top.name === 'envelope' && <Envelope />}
            {top.name === 'done' && <Done title={top.title} body={top.body} home={top.home} />}
            {top.name === 'pick' && <Pick mode={top.mode} />}
            {top.name === 'limits' && <Limits />}
            {top.name === 'statements' && <Statements />}
            {top.name === 'templates' && <Templates />}
            {top.name === 'link' && <LinkBank />}
            {top.name === 'newAccount' && <NewAccount />}
          </motion.div>
        )}
      </AnimatePresence>
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
