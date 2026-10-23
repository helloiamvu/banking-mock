export type Currency = 'CZK' | 'EUR' | 'USD'

export type Account = {
  id: string
  name: string
  number: string
  balance: number
  currency: Currency
  kind: 'current' | 'savings'
}

export type Tx = {
  id: string
  accountId: string
  title: string
  subtitle: string
  amount: number
  currency: Currency
  when: string
  group: string
  letter: string
  badge: 'in' | 'out' | 'card'
  detail?: string
  mark?: 'bank'
}

// Nominal annual rates, ACT/365. A full week is balance × rate × 7 / 365.
// Crediting that each Wednesday is what turns the nominal rate into the APY below.
export const SAVINGS_CAP = 300_000
export const RATE_UP_TO_CAP = 0.032
export const RATE_ABOVE_CAP = 0.02
export const SAVINGS_DEPOSIT = 300_000
export const SAVINGS_TOP_UP = 200_000
export const INTEREST_TAX = 0.15

export function roundMoney(value: number) {
  return Math.round(value * 100 + 1e-8) / 100
}

/** Unrounded ACT/365 interest. The first 300k earns 3.20%, the rest 2.00%. */
function periodInterest(balance: number, days: number) {
  const base = Math.min(balance, SAVINGS_CAP)
  const extra = Math.max(0, balance - SAVINGS_CAP)
  return (base * RATE_UP_TO_CAP + extra * RATE_ABOVE_CAP) * days / 365
}

export function weeklyInterest(balance: number) {
  return roundMoney(periodInterest(balance, 7))
}

// Deposit landed Wednesday 23 Sep 2026. Each following Wednesday posts the days
// since the previous credit. Saturday 10 Oct adds 200k after 3 days of that week
// (7–9 Oct) and those 200k earn on the remaining 4 days (10–13 Oct). Friday 23 Oct
// is two days into the next week, so that second 200k is not in a posted credit yet.
function accrueSavings() {
  let balance = SAVINGS_DEPOSIT
  const credits: { when: string; group: string; gross: number; tax: number }[] = []

  const credit = (when: string, group: string, exact: number) => {
    const gross = roundMoney(exact)
    const tax = roundMoney(gross * INTEREST_TAX)
    credits.push({ when, group, gross, tax })
    balance = roundMoney(balance + gross - tax)
  }

  credit('Středa 30. 9.', 'Září', periodInterest(balance, 7))
  credit('Středa 7. 10.', 'Tento měsíc', periodInterest(balance, 7))

  const beforeTopUp = balance
  const withTopUp = roundMoney(beforeTopUp + SAVINGS_TOP_UP)
  const splitGross = roundMoney(periodInterest(beforeTopUp, 3) + periodInterest(withTopUp, 4))
  const splitTax = roundMoney(splitGross * INTEREST_TAX)
  credits.push({ when: 'Středa 14. 10.', group: 'Tento měsíc', gross: splitGross, tax: splitTax })
  balance = roundMoney(withTopUp + splitGross - splitTax)

  credit('Středa 21. 10.', 'Tento měsíc', periodInterest(balance, 7))

  const gross = roundMoney(credits.reduce((sum, item) => sum + item.gross, 0))
  const tax = roundMoney(credits.reduce((sum, item) => sum + item.tax, 0))
  return {
    credits,
    gross,
    tax,
    net: roundMoney(gross - tax),
    balanceAfterInterest: balance,
  }
}

export const savingsInterest = accrueSavings()

export function weeklyApy(nominal: number) {
  return (1 + (nominal * 7) / 365) ** (365 / 7) - 1
}

// balanceAfterInterest already includes the 10 Oct top-up. 23 Oct is still ahead of the next Wednesday.
export const savingsBalance = roundMoney(savingsInterest.balanceAfterInterest + SAVINGS_TOP_UP)

export const accounts: Account[] = [
  { id: 'osobni', name: 'Osobní', number: '1124433013/3030', balance: 206.12, currency: 'CZK', kind: 'current' },
  { id: 'eur', name: 'EUR', number: '1124433056/3030', balance: 0, currency: 'EUR', kind: 'current' },
  { id: 'usd', name: 'USD', number: '', balance: 0, currency: 'USD', kind: 'current' },
  { id: 'sporeni', name: 'Spořicí účet', number: '1124433048/3030', balance: savingsBalance, currency: 'CZK', kind: 'savings' },
]

export const currentAccounts = accounts.filter((a) => a.kind === 'current')

function interestTxs(when: string): Tx[] {
  const credit = savingsInterest.credits.find((item) => item.when === when)
  if (!credit) throw new Error(`missing interest credit ${when}`)
  const key = when.replaceAll(/[^0-9]/g, '')
  return [
    {
      id: `s-int-${key}`,
      accountId: 'sporeni',
      title: 'Air Bank',
      subtitle: 'Kreditní úrok',
      detail: 'Peníze získané úročením tohoto účtu',
      amount: credit.gross,
      currency: 'CZK',
      when: credit.when,
      group: credit.group,
      letter: '',
      badge: 'in',
      mark: 'bank',
    },
    {
      id: `s-tax-${key}`,
      accountId: 'sporeni',
      title: 'Air Bank',
      subtitle: 'Daň z úroku',
      detail: 'Daň z peněz získaných úročením tohoto účtu',
      amount: -credit.tax,
      currency: 'CZK',
      when: credit.when,
      group: credit.group,
      letter: '',
      badge: 'out',
      mark: 'bank',
    },
  ]
}

const incoming = (id: string, when: string): Tx => ({
  id,
  accountId: 'sporeni',
  title: 'Vu Hoang Anh',
  subtitle: 'Příchozí úhrada',
  amount: SAVINGS_TOP_UP,
  currency: 'CZK',
  when,
  group: 'Tento měsíc',
  letter: 'V',
  badge: 'in',
})

const savingsTxs: Tx[] = [
  incoming('s-topup', 'Pátek 23. 10.'),
  ...interestTxs('Středa 21. 10.'),
  ...interestTxs('Středa 14. 10.'),
  incoming('s-topup-10', 'Sobota 10. 10.'),
  ...interestTxs('Středa 7. 10.'),
  ...interestTxs('Středa 30. 9.'),
  { id: 's-deposit', accountId: 'sporeni', title: 'Osobní', subtitle: 'Příchozí úhrada', amount: SAVINGS_DEPOSIT, currency: 'CZK', when: 'Středa 23. 9.', group: 'Září', letter: 'O', badge: 'in' },
]

const savingsLedger = roundMoney(savingsTxs.reduce((sum, tx) => sum + tx.amount, 0))
if (savingsLedger !== savingsBalance) {
  throw new Error(`savings ledger ${savingsLedger} does not match balance ${savingsBalance}`)
}

export const txs: Tx[] = [
  ...savingsTxs,
  { id: 't1', accountId: 'osobni', title: 'Spořicí účet', subtitle: 'Odchozí úhrada', amount: -300000, currency: 'CZK', when: 'Středa 23. 9.', group: 'Středa 23. 9.', letter: 'S', badge: 'out' },
  { id: 't2', accountId: 'osobni', title: 'Vu Hoang Anh', subtitle: 'Příchozí úhrada', amount: 150000, currency: 'CZK', when: 'Středa 23. 9.', group: 'Středa 23. 9.', letter: 'V', badge: 'in' },
  { id: 't3', accountId: 'osobni', title: 'Vu Hoang Anh', subtitle: 'Příchozí úhrada', amount: 150000, currency: 'CZK', when: 'Středa 23. 9.', group: 'Středa 23. 9.', letter: 'V', badge: 'in' },
  { id: 't4', accountId: 'osobni', title: 'GOPAY *IDNES', subtitle: 'Platba kartou', amount: -99, currency: 'CZK', when: 'Sobota 5. 9.', group: 'Sobota 5. 9.', letter: 'G', badge: 'card' },
  { id: 't5', accountId: 'osobni', title: 'Hoang Anh Vu', subtitle: 'Odchozí úhrada', amount: -20000, currency: 'CZK', when: 'Červenec', group: 'Červenec', letter: 'H', badge: 'out' },
  { id: 't6', accountId: 'osobni', title: 'Vu Hoang Anh', subtitle: 'Příchozí úhrada', amount: 20000, currency: 'CZK', when: 'Červenec', group: 'Červenec', letter: 'V', badge: 'in' },
  { id: 't7', accountId: 'osobni', title: 'Hoang Anh Vu', subtitle: 'Odchozí úhrada', amount: -72900, currency: 'CZK', when: 'Pondělí 13. 7.', group: 'Červenec', letter: 'H', badge: 'out' },
  { id: 't8', accountId: 'osobni', title: 'HOANG ANH VU', subtitle: 'Vklad hotovosti', amount: 73000, currency: 'CZK', when: 'Pondělí 13. 7.', group: 'Červenec', letter: 'H', badge: 'in' },
  { id: 't9', accountId: 'osobni', title: 'Spořicí účet', subtitle: 'Odchozí úhrada', amount: -150000, currency: 'CZK', when: 'Úterý 30. 6.', group: 'Červen', letter: 'S', badge: 'out' },
  { id: 't10', accountId: 'osobni', title: 'Vu Hoang Anh', subtitle: 'Příchozí úhrada', amount: 150000, currency: 'CZK', when: 'Úterý 30. 6.', group: 'Červen', letter: 'V', badge: 'in' },
  { id: 'e1', accountId: 'eur', title: 'Osobní', subtitle: 'Převod na Váš účet', amount: -3.13, currency: 'EUR', when: 'Neděle 1. 3.', group: 'Neděle 1. 3.', letter: 'O', badge: 'out' },
  { id: 'e2', accountId: 'eur', title: 'ZEN.COM UAB', subtitle: 'Platba kartou', amount: -1695, currency: 'EUR', when: 'Úterý 13. 2.', group: 'Únor 2024', letter: 'Z', badge: 'card' },
  { id: 'e3', accountId: 'eur', title: 'Andrea Lai', subtitle: 'Příchozí SEPA úhrada', amount: 1697, currency: 'EUR', when: 'Pondělí 12. 2.', group: 'Únor 2024', letter: 'A', badge: 'in' },
]

export function money(amount: number, currency: Currency, digits = 2) {
  const formatted = new Intl.NumberFormat('cs-CZ', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount)
  return `${formatted} ${currency}`
}

export function percent(rate: number, digits = 2) {
  const formatted = new Intl.NumberFormat('cs-CZ', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(rate * 100)
  return `${formatted} %`
}

export function signed(amount: number, currency: Currency) {
  const body = money(Math.abs(amount), currency)
  return amount > 0 ? body : amount < 0 ? `-${body.replace(currency, '').trim()} ${currency}` : body
}

export function groupTxs(list: Tx[]) {
  const groups: { label: string; items: Tx[]; plus: number; minus: number }[] = []
  for (const tx of list) {
    let g = groups.find((item) => item.label === tx.group)
    if (!g) {
      g = { label: tx.group, items: [], plus: 0, minus: 0 }
      groups.push(g)
    }
    g.items.push(tx)
    if (tx.amount >= 0) g.plus = roundMoney(g.plus + tx.amount)
    else g.minus = roundMoney(g.minus + tx.amount)
  }
  return groups
}
