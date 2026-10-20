import { isDeepStrictEqual } from 'node:util'
import assert from 'node:assert/strict'

export const practiceQuestion = 'What do you remember about the home you grew up in?'
export const practicePrivacy = "This is a practice space. What you write here isn't saved."
const references = description => [
  { attribute: 'aria-labelledby', texts: [practiceQuestion] },
  { attribute: 'aria-describedby', texts: [description] }
]

/** P4-05 is an approved semantic improvement over the protected defect.
 * Never treat two broken references as a pass or ignore unrelated references. */
export function comparePracticeReferences(key, published, source) {
  if (key !== 'dialog') return { equal: isDeepStrictEqual(published, source), approvedDifference: false }
  const equal = isDeepStrictEqual(published, references(null)) && isDeepStrictEqual(source, references(practicePrivacy))
  return { equal, approvedDifference: equal, finding: 'P4-05', published, source }
}

/** Browser accessibility-tree evidence, not an actual screen-reader speech test. */
export async function verifyPracticeDescription(page) {
  const dom = await page.getByTestId('question-dialog').evaluate(dialog => {
    const paragraph = dialog.querySelector('#demo-privacy')
    const textarea = dialog.querySelector('textarea')
    const titleId = dialog.getAttribute('aria-labelledby')
    return {
      dialogDescriptionId: dialog.getAttribute('aria-describedby'),
      textareaDescriptionId: textarea.getAttribute('aria-describedby'),
      descriptionCount: document.querySelectorAll('[id="demo-privacy"]').length,
      descriptionTag: paragraph?.tagName,
      descriptionText: paragraph?.textContent,
      descriptionVisible: Boolean(paragraph && paragraph.getClientRects().length && getComputedStyle(paragraph).display !== 'none' && getComputedStyle(paragraph).visibility !== 'hidden'),
      title: document.getElementById(titleId)?.textContent,
      titleCount: titleId ? [...document.querySelectorAll('[id]')].filter(e => e.id === titleId).length : 0
    }
  })
  assert.deepEqual(dom, {
    dialogDescriptionId: 'demo-privacy', textareaDescriptionId: 'demo-privacy',
    descriptionCount: 1, descriptionTag: 'P', descriptionText: practicePrivacy,
    descriptionVisible: true, title: practiceQuestion, titleCount: 1
  }, 'P4-05 requires one visible privacy paragraph and valid dialog/textarea references')
  const client = await page.context().newCDPSession(page)
  try {
    const { nodes } = await client.send('Accessibility.getFullAXTree')
    const visible = nodes.filter(node => !node.ignored)
    const dialogs = visible.filter(node => node.role?.value === 'dialog')
    const fields = visible.filter(node => node.role?.value === 'textbox' && node.name?.value === 'Your example answer')
    assert.equal(dialogs.length, 1, 'Exactly one exposed practice dialog')
    assert.equal(fields.length, 1, 'Exactly one exposed practice answer field')
    assert.equal(dialogs[0].name?.value, practiceQuestion, 'Dialog accessible name is unchanged')
    assert.equal(dialogs[0].description?.value, practicePrivacy, 'Dialog accessible description exposes the existing privacy text')
    assert.equal(fields[0].description?.value, practicePrivacy, 'Textarea accessible description remains the privacy text')
    const select = node => ({ nodeId: node.nodeId, role: node.role, name: node.name, description: node.description, properties: node.properties })
    return { dom, dialog: select(dialogs[0]), textarea: select(fields[0]), method: 'Chromium CDP Accessibility.getFullAXTree; no screen-reader speech claim' }
  } finally { await client.detach() }
}
