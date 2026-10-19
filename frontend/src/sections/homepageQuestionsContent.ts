/** The published homepage order and ledger IDs. Wording stays in the content ledger. */
export const reassuranceItems = [
  { copyId: 'home.reassurance.schedule', icon: 'clock' },
  { copyId: 'home.reassurance.editorial', icon: 'book' },
  { copyId: 'home.reassurance.payment', icon: 'card' },
] as const

export type ReassuranceIconName = typeof reassuranceItems[number]['icon']

type HomepageQuestion = {
  id: string
  questionId: string
  answerId: string
  actionId?: string
}

export const homepageQuestions: HomepageQuestion[] = [
  { id: 'faq-0', questionId: 'home.faq.writer.question', answerId: 'home.faq.writer.answer' },
  { id: 'faq-1', questionId: 'home.faq.gifting.question', answerId: 'home.faq.gifting.answer', actionId: 'home.faq.gifting.cta' },
  { id: 'faq-2', questionId: 'home.faq.time.question', answerId: 'home.faq.time.answer', actionId: 'home.faq.time.cta' },
  { id: 'faq-3', questionId: 'home.faq.media.question', answerId: 'home.faq.media.answer', actionId: 'home.faq.media.cta' },
  { id: 'faq-4', questionId: 'home.faq.choice.question', answerId: 'home.faq.choice.answer' },
  { id: 'faq-5', questionId: 'home.faq.review.question', answerId: 'home.faq.review.answer', actionId: 'home.faq.review.cta' },
]
