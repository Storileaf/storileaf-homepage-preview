import type { ReactNode } from 'react'

type Props = { children: ReactNode; href?: string; variant?: 'primary' | 'outline' | 'gold' | 'text'; ariaLabel?: string; className?: string; arrow?: boolean; 'data-testid'?: string }

function Arrow() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h15M13 5l7 7-7 7" /></svg>
}

export function ActionLink({children, href, variant = 'text', ariaLabel, className = '', arrow = true, 'data-testid': testId}: Props) {
  const cls = ('sl-action sl-action--' + variant + ' ' + className).trim()
  if (!href) return <span className={cls + ' sl-action--planned'}>{children}{arrow && <Arrow />}</span>
  return <a className={cls} href={href} aria-label={ariaLabel} data-testid={testId}>{children}{arrow && <Arrow />}</a>
}
