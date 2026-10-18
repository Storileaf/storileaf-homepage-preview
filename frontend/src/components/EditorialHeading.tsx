import type { ReactNode } from 'react'

type Props = { title: ReactNode; emphasis?: ReactNode; introduction?: ReactNode; id?: string; align?: 'centre' | 'left' }

export function EditorialHeading({title, emphasis, introduction, id, align = 'centre'}: Props) {
  return <header className={'sl-editorial-heading sl-editorial-heading--' + align}>
    <h2 id={id}>{title}{emphasis && <> <em>{emphasis}</em></>}</h2>
    {introduction && <p>{introduction}</p>}
  </header>
}
