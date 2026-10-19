import type { HTMLAttributes, ReactNode } from 'react'

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  children: ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  variant?: 'hero' | 'feature' | 'editorial' | 'compact' | 'card' | 'newsletter'
}

// Visual size is independent of document hierarchy. A page owns its single h1.
export function Heading({ as: Tag = 'h2', variant = 'editorial', className = '', ...props }: HeadingProps) {
  return <Tag className={`sl-heading sl-heading--${variant} ${className}`.trim()} {...props} />
}

type TextProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  as?: 'p' | 'span' | 'div'
  variant?: 'body' | 'lead' | 'support' | 'meta'
}

export function Text({ as: Tag = 'p', variant = 'body', className = '', ...props }: TextProps) {
  return <Tag className={`sl-copy sl-copy--${variant} ${className}`.trim()} {...props} />
}
