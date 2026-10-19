import type { ReactNode } from 'react'
import { Heading, Text } from './Typography'

type Props = {
  title: ReactNode; emphasis?: ReactNode; introduction?: ReactNode; id?: string
  align?: 'centre' | 'left'; level?: 'h1' | 'h2' | 'h3'; size?: 'editorial' | 'compact'
}

export function EditorialHeading({ title, emphasis, introduction, id, align = 'centre', level = 'h2', size = 'editorial' }: Props) {
  return <header className={'sl-editorial-heading sl-editorial-heading--' + align}>
    <Heading as={level} variant={size} id={id}>{title}{emphasis && <> <em>{emphasis}</em></>}</Heading>
    {introduction && <Text variant="lead">{introduction}</Text>}
  </header>
}
