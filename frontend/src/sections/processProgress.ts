export const processMotionQuery = '(min-width: 901px) and (min-height: 731px) and (prefers-reduced-motion: no-preference)'
export const processStageDistance = 112
export const processOrigin = 20

/** Published progression is independent of rendered row heights. */
export function processStageAt(sectionTop: number): number {
  return Math.min(3, Math.floor(Math.max(0, processOrigin - sectionTop) / processStageDistance))
}

/** Land 6px inside a stage rather than on its scroll boundary. */
export function processStageScrollTop(sectionDocumentTop: number, stage: number): number {
  return sectionDocumentTop - processOrigin + stage * processStageDistance + 6
}
