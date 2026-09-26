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
}

export const accounts: Account[] = [
  { id: 'osobni', name: 'Osobní', number: '1124433013/3030', balance: 206.12, currency: 'CZK', kind: 'current' },
  { id: 'eur', name: 'EUR', number: '1124433056/3030', balance: 0, currency: 'EUR', kind: 'current' },
  { id: 'usd', name: 'USD', number: '', balance: 0, currency: 'USD', kind: 'current' },
  { id: 'sporeni', name: 'Spořicí účet', number: '1124433048/3030', balance: 300000, currency: 'CZK', kind: 'savings' },
]

export const currentAccounts = accounts.filter((a) => a.kind === 'current')

export const txs: Tx[] = [
  { id: 't2', accountId: 'osobni', title: 'Vu Hoang Anh', subtitle: 'Příchozí úhrada', amount: 150000, currency: 'CZK', when: 'Včera', group: 'Včera', letter: 'V', badge: 'in' },
  { id: 't3', accountId: 'osobni', title: 'Vu Hoang Anh', subtitle: 'Příchozí úhrada', amount: 150000, currency: 'CZK', when: 'Včera', group: 'Včera', letter: 'V', badge: 'in' },
  { id: 't1', accountId: 'osobni', title: 'Spořicí účet', subtitle: 'Odchozí úhrada', amount: -300000, currency: 'CZK', when: 'Středa 23. 9.', group: 'Středa 23. 9.', letter: 'S', badge: 'out' },
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
    if (tx.amount >= 0) g.plus += tx.amount
    else g.minus += tx.amount
  }
  return groups
}
