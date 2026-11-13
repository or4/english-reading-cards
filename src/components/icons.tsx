import type { ReactNode } from 'react'

// иконки из Tabler Icons (MIT), https://tabler.io/icons
export function VolumeIcon() {
  return (
    <TablerIcon>
      <path d="M15 8a5 5 0 0 1 0 8" />
      <path d="M17.7 5a9 9 0 0 1 0 14" />
      <path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />
    </TablerIcon>
  )
}

export function SnailIcon() {
  return (
    <TablerIcon>
      <path d="M11 11c-1.25 0 -2 .755 -2 2s1.372 3 3 3c2.01 0 4 -2.51 4 -5c0 -2.585 -3.223 -5 -6 -5c-3.543 0 -6 2.266 -6 6c0 1.5 .393 2.107 .75 3c.5 1.25 1.804 2.257 2.25 3q -1.034 .099 -2.527 .063a1.44 1.44 0 0 0 -1.473 1.437a1.5 1.5 0 0 0 1.5 1.5h11.71a3.75 3.75 0 0 0 3.083 -1.612c.712 -1.016 .707 -2.138 .707 -3.388v-7a2 2 0 1 0 -4 0v2" />
      <path d="M21 3c-.862 .479 -1.904 1.76 -2 4.25" />
      <path d="M17 3c-.383 .766 -1.053 2.43 0 4.25" />
    </TablerIcon>
  )
}

export function ChevronLeftIcon() {
  return (
    <TablerIcon>
      <path d="M15 6l-6 6l6 6" />
    </TablerIcon>
  )
}

export function ChevronRightIcon() {
  return (
    <TablerIcon>
      <path d="M9 6l6 6l-6 6" />
    </TablerIcon>
  )
}

export function ArrowLeftIcon() {
  return (
    <TablerIcon>
      <path d="M5 12l14 0" />
      <path d="M5 12l6 6" />
      <path d="M5 12l6 -6" />
    </TablerIcon>
  )
}

function TablerIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}
