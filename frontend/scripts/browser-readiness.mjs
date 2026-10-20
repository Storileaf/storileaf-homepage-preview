// Browser test utility only. Never imported by the public runtime.
// A completed resize/style event does not guarantee a stable computed snapshot.
// Keep all measured values, fail if they do not settle, and never wait for a
// particular expected result (a stable genuine regression must still fail).
export async function settledSnapshot(page, read, { quietMilliseconds = 200, timeout = 5000 } = {}) {
  await page.bringToFront()
  const start = Date.now()
  let signature, stableSince = start, value, stableSamples = 0
  while (Date.now() - start <= timeout) {
    value = await read()
    const next = JSON.stringify(value)
    if (signature !== next) { signature = next; stableSince = Date.now(); stableSamples = 1 }
    else stableSamples++
    if (stableSamples >= 3 && Date.now() - stableSince >= quietMilliseconds) return value
    await page.waitForTimeout(40)
  }
  throw new Error('Browser geometry and computed styles did not settle within ' + timeout + 'ms')
}
