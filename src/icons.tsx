import type { ReactNode, SVGProps } from 'react'

type Props = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 24, children, ...props }: Props & { children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      {children}
    </svg>
  )
}

export function IconHome(p: Props) {
  return (
    <Svg {...p}>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5.2v-5.2h-3.6V21H5a1 1 0 0 1-1-1v-9.5Z" fill="currentColor" />
    </Svg>
  )
}

export function IconGift(p: Props) {
  return (
    <Svg {...p}>
      <rect x="3.5" y="10" width="17" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 14.2h17M12 10v10" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 10c-2.2 0-3.6-1.2-3.6-2.6S10 5 12 7.2C14 5 15.6 5.8 15.6 7.4S14.2 10 12 10Z" stroke="currentColor" strokeWidth="1.8" />
    </Svg>
  )
}

export function IconArrow(p: Props) {
  return (
    <Svg {...p}>
      <path d="M7 15c2.2-5 7.2-6.2 10.2-2.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14.2 8.6 17.6 12.6 13.2 13.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export function IconRequest(p: Props) {
  return (
    <Svg {...p}>
      <path d="M7 4.5h7.2L18 8.2V19a1.4 1.4 0 0 1-1.4 1.4H7.4A1.4 1.4 0 0 1 6 19V5.9A1.4 1.4 0 0 1 7.4 4.5H7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14 4.7V8h3.6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12 10.2v5.2M9.8 13.2 12 15.6l2.2-2.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export function IconChart(p: Props) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="7.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 12V5.2A6.8 6.8 0 0 1 18.6 13.2H12Z" fill="currentColor" />
    </Svg>
  )
}

export function IconMenu(p: Props) {
  return (
    <Svg {...p}>
      <path d="M5 7h14M5 12h14M5 17h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  )
}

export function IconDoc(p: Props) {
  return (
    <Svg {...p}>
      <path d="M7 4h6.4L18 8.4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5.5A1.5 1.5 0 0 1 7.5 4H7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M13.2 4.2V8.2H17.4" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8.5 13.2h7M8.5 16.2h4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  )
}

export function IconLoop(p: Props) {
  return (
    <Svg {...p}>
      <path d="M8 8.5h7.2a3 3 0 0 1 0 6H9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M10 6.4 7.4 8.5 10 10.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16.4" cy="16.8" r="1.7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14.8 18.6c.3-.8.8-1.2 1.6-1.2s1.3.4 1.6 1.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </Svg>
  )
}

export function IconCard(p: Props) {
  return (
    <Svg {...p}>
      <rect x="3" y="6" width="18" height="12" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.7" />
    </Svg>
  )
}

export function IconQr(p: Props) {
  return (
    <Svg {...p}>
      <path d="M5 5h4.2v4.2H5V5Zm1.5 1.5v1.2h1.2V6.5H6.5ZM14.8 5H19v4.2h-4.2V5Zm1.5 1.5v1.2H17.5V6.5h-1.2ZM5 14.8h4.2V19H5v-4.2Zm1.5 1.5v1.2h1.2v-1.2H6.5Z" fill="currentColor" />
      <path d="M14.8 14.8h1.6v1.6h-1.6v-1.6Zm2.6 0H19v1.6h-1.6v-1.6Zm-2.6 2.6h1.6V19h-1.6v-1.6Zm2.6 0H19V19h-1.6v-1.6Z" fill="currentColor" />
    </Svg>
  )
}

export function IconDots(p: Props) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="8.2" cy="12" r="1.15" fill="currentColor" />
      <circle cx="12" cy="12" r="1.15" fill="currentColor" />
      <circle cx="15.8" cy="12" r="1.15" fill="currentColor" />
    </Svg>
  )
}

export function IconChat(p: Props) {
  return (
    <Svg {...p}>
      <path d="M6 16.5 4.5 19.2c-.3.5.3 1.1.8.8L8.4 18A8 8 0 1 0 6 16.5Z" stroke="currentColor" strokeWidth="1.7" />
    </Svg>
  )
}

export function IconMail(p: Props) {
  return (
    <Svg {...p}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="m4.5 7 7.5 6L19.5 7" stroke="currentColor" strokeWidth="1.7" />
    </Svg>
  )
}

export function IconBack(p: Props) {
  return (
    <Svg {...p}>
      <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export function IconClose(p: Props) {
  return (
    <Svg {...p}>
      <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  )
}

export function IconSearch(p: Props) {
  return (
    <Svg {...p}>
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  )
}

export function IconPlus(p: Props) {
  return (
    <Svg {...p}>
      <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  )
}

export function IconChev(p: Props) {
  return (
    <Svg {...p}>
      <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export function IconBank(p: Props) {
  return (
    <Svg {...p}>
      <path d="m4 10 8-5 8 5M6 10v7M10 10v7M14 10v7M18 10v7M4 19h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  )
}

export function IconPig(p: Props) {
  return (
    <Svg {...p}>
      <path d="M6 14c0-3 2.4-5 6.2-5H16c1.6 0 2.5 1.2 2.5 2.4 1 .5 1.5 1.4 1.5 2.4 0 1.6-1.2 2.4-2.4 2.6-.4 1.6-1.6 2.6-3.4 2.6h-.4c-.3.8-1 1.4-2 1.4-.8 0-1.5-.4-1.8-1.1-2 .2-4-.8-4-2.7 0-.4 0-.8.1-1.2C5.2 15.6 6 14.8 6 14Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14.2" cy="12.2" r=".7" fill="currentColor" />
    </Svg>
  )
}

export function IconUmbrella(p: Props) {
  return (
    <Svg {...p}>
      <path d="M12 4c4.8 0 8 2.8 8 6H4c0-3.2 3.2-6 8-6Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 10v7.2a2 2 0 1 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  )
}

export function IconBag(p: Props) {
  return (
    <Svg {...p}>
      <path d="M9 9.5c0-2.2 6-2.2 6 0 2.4.4 3.2 2 3.2 4.2 0 3.4-2.2 6.3-6.2 6.3S6 17.1 6 13.7c0-2.2.8-3.8 3-4.2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M10.2 9.2c.4-1.6 3.2-1.6 3.6 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  )
}

export function IconInfo(p: Props) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 11v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="8" r=".9" fill="currentColor" />
    </Svg>
  )
}

export function IconCalendar(p: Props) {
  return (
    <Svg {...p}>
      <rect x="4.5" y="5.5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 4v3M16 4v3M4.5 10h15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <text x="12" y="16.6" textAnchor="middle" fontSize="7" fontWeight="700" fill="currentColor">%</text>
    </Svg>
  )
}

export function IconUpDown(p: Props) {
  return (
    <Svg {...p}>
      <path d="M8 16.5V8M5.6 10.2 8 7.4l2.4 2.8M16 7.5v8.5M13.6 13.8 16 16.6l2.4-2.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export function IconSwap(p: Props) {
  return (
    <Svg {...p}>
      <path d="M7 8h11M15 5.2 18 8l-3 2.8M17 16H6M9 13.2 6 16l3 2.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export function IconMic(p: Props) {
  return (
    <Svg {...p}>
      <rect x="9" y="4" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M7 11a5 5 0 0 0 10 0M12 16v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  )
}

export function IconKeyboard(p: Props) {
  return (
    <Svg {...p}>
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M7 10h.1M11 10h.1M15 10h.1M7 14h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  )
}

export function IconShare(p: Props) {
  return (
    <Svg {...p}>
      <path d="M12 15V5M8.5 8 12 4.5 15.5 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 13v5h12v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  )
}

export function IconTrash(p: Props) {
  return (
    <Svg {...p}>
      <path d="M5 8h14M9 8V6h6v2M8 8l.8 11h6.4L16 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  )
}

export function IconCopy(p: Props) {
  return (
    <Svg {...p}>
      <rect x="8" y="8" width="11" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M6 15H5.5A1.5 1.5 0 0 1 4 13.5v-8A1.5 1.5 0 0 1 5.5 4h8A1.5 1.5 0 0 1 15 5.5V6" stroke="currentColor" strokeWidth="1.7" />
    </Svg>
  )
}
