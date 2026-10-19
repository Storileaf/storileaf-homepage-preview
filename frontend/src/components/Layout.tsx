import type { HTMLAttributes } from 'react'

export function Container({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`sl-container ${className}`.trim()} {...props} />
}

type SectionProps = HTMLAttributes<HTMLElement> & { spacing?: 'standard' | 'compact' | 'none' }

// Special homepage compositions keep their own spacing. This is the reusable default.
export function Section({ spacing = 'standard', className = '', ...props }: SectionProps) {
  return <section className={`sl-reference-section ${className}`.trim()} data-spacing={spacing} {...props} />
}
