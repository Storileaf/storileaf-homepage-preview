import fs from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright-core'

const base = 'http://127.0.0.1:4173/storileaf-homepage-preview/'
const folder = 'qa/screenshots'
await fs.mkdir(folder, { recursive: true })
const problems = []
const observations = {}
function check(ok, message) { if (!ok) problems.push(message) }
const executablePath = process.env.CHROME_PATH || '/usr/bin/google-chrome'
const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox'] })
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' })
const desktop = await context.newPage()
desktop.on('pageerror', e => problems.push('Browser error: ' + e.message))
try {
  await desktop.goto(base, { waitUntil: 'domcontentloaded' })
  await desktop.waitForTimeout(1300)
  observations.title = await desktop.title()
  observations.headerAlignment = await desktop.evaluate(() => {
    const nav = document.querySelector('.desktop-nav-list')
    const centre = r => (r.top + r.bottom) / 2
    const round = n => Math.round(n * 10) / 10
    const controls = [...nav.querySelectorAll(':scope > li > .header-nav-trigger, :scope > li > .header-simple-link')]
    return controls.map(el => {
      const content = [...el.childNodes].find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim())
      const textRange = document.createRange()
      textRange.selectNodeContents(content)
      const glyph = textRange.getBoundingClientRect(), control = el.getBoundingClientRect()
      const parent = el.parentElement.getBoundingClientRect(), s = getComputedStyle(el)
      const icon = el.querySelector('svg')
      return {label:el.textContent.trim(),type:el.tagName, textTop:round(glyph.top), textCentre:round(centre(glyph)),
        elementTop:round(control.top),elementCentre:round(centre(control)),height:round(control.height),
        parentCentre:round(centre(parent)),font:s.font,lineHeight:s.lineHeight,paddingTop:s.paddingTop,paddingBottom:s.paddingBottom,
        transform:s.transform,svgCentre:icon?round(centre(icon.getBoundingClientRect())):null}
    })
  })
  const centres = observations.headerAlignment.map(item => item.textCentre)
  const maxTextOffset = Math.max(...centres) - Math.min(...centres)
  observations.headerMaxTextOffset = Math.round(maxTextOffset * 10) / 10
  check(maxTextOffset <= 0.8, 'Navigation label baselines differ across dropdown triggers and links')
  const chevronOffsets = observations.headerAlignment.filter(item => item.svgCentre !== null)
    .map(item => Math.abs(item.svgCentre - item.textCentre))
  check(chevronOffsets.every(offset => offset <= 1.5), 'Dropdown chevrons are not centred with labels')
  await desktop.locator('.site-header').screenshot({ path:path.join(folder,'header-navigation-aligned.png'), animations:'disabled' })
  check(await desktop.getByRole('heading', { name: /The stories of your life/i }).count() > 0, 'Homepage hero absent')
  const coverState = await desktop.evaluate(() => {
    const inner = document.querySelectorAll('.hero-orbit-inner .hero-orbit-square');
    const outer = document.querySelectorAll('.hero-orbit-outer .hero-orbit-square');
    const combined = [...inner, ...outer];
    const names = combined.map(el => el.getAttribute('src').split('/').pop());
    const counts = Object.fromEntries([...new Set(names)].map(name => [name, names.filter(value => value === name).length]));
    const radius = selector => getComputedStyle(document.querySelector(selector)).getPropertyValue('--orbit-radius').trim();
    const failedImages = combined.filter(img => !img.complete || img.naturalWidth === 0).length;
    return { inner:inner.length,outer:outer.length,distinct:new Set(names).size,counts,
      outerRadius:radius('.hero-orbit-outer'),innerRadius:radius('.hero-orbit-inner'),failedImages };
  })
  observations.heroCovers = coverState
  check(coverState.inner === 6 && coverState.outer === 8, 'Hero orbit must have 6 inner and 8 outer covers')
  check(coverState.distinct === 7 && Object.values(coverState.counts).every(n => n === 2), 'The original seven covers must each appear exactly twice')
  check(coverState.failedImages === 0, 'A local hero cover image is missing or broken')
  check(coverState.outerRadius === '665.5px' && coverState.innerRadius === '345px', 'Outer orbit radius must increase by 10%, while inner stays unchanged')
  await desktop.locator('.hero').screenshot({ path:path.join(folder,'hero-fourteen-covers-desktop.png'), animations:'disabled' })

  // Discovery heading and its supporting paragraph must form a connected editorial pair.
  const discoveryHeadings = {}
  for (const width of [1024,1280,1440,1920]) {
    await desktop.setViewportSize({width,height:900})
    await desktop.waitForTimeout(120)
    const heading = await desktop.locator('.discovery-heading').evaluate(el => {
      const title=el.querySelector('.discovery-title'),description=el.querySelector('.discovery-description')
      const a=title.getBoundingClientRect(),b=description.getBoundingClientRect(),s=getComputedStyle(el)
      const titleStyle=getComputedStyle(title)
      return {
        columns:s.gridTemplateColumns,
        align:s.alignItems,
        titleTop:Math.round(a.top*10)/10,
        descTop:Math.round(b.top*10)/10,
        titleLeft:Math.round(a.left*10)/10,
        titleRight:Math.round(a.right*10)/10,
        descLeft:Math.round(b.left*10)/10,
        titleHeight:Math.round(a.height*10)/10,
        titleLineHeight:titleStyle.lineHeight,
        introText:description.textContent.trim(),
        titleText:title.textContent.trim()
      }
    })
    discoveryHeadings[width]=heading
    check(heading.introText === 'Think of a person, a journey, the years together or a moment that stayed with you. Choose a subject to see the book it could become.', 'Six-book supporting paragraph was changed')
    check(heading.titleText === 'Which part of life would you like to tell?', 'Six-book heading was changed')
    if (width>1130) {
      check(heading.align==='start' && Math.abs(heading.titleTop-heading.descTop)<=2, 'Desktop book heading and description are not top aligned at '+width+'px')
      check(heading.descLeft-heading.titleRight >= 20 && heading.descLeft-heading.titleRight <= 50, 'Desktop book heading columns have excessive or insufficient gap at '+width+'px')
    } else {
      check(heading.descTop >= heading.titleTop+heading.titleHeight, 'Tablet book paragraph should remain beneath the heading')
    }
    await desktop.locator('.book-discovery-section').screenshot({
      path:path.join(folder,'book-discovery-heading-'+width+'px.png'),animations:'disabled'})
  }
  observations.discoveryHeadings=discoveryHeadings
  await desktop.setViewportSize({width:1440,height:900})
  await desktop.waitForTimeout(150)


  const galleryNames = ['Life Story','Travel Memoir','Relationship Memoir',"Founder's Memoir",'Parent to Child Letters','Celebrating Occasions']
  const gallerySlugs = ['life-story','travel-memoir','relationship-memoir','founders-memoir','parent-to-child-letters','celebrating-occasions']
  const galleryCards = desktop.locator('.sample-rail .sample-card')
  check(await galleryCards.count() === 6, 'Gallery must have exactly six clickable book images')
  const captions = await galleryCards.locator('.sample-card-caption').allTextContents()
  check(JSON.stringify(captions.map(s=>s.trim())) === JSON.stringify(galleryNames), 'Gallery captions must show only the six formal book names')
  check(await desktop.locator('.sample-rail .book-spread,.sample-rail .sample-excerpt,.sample-rail .sample-read-action,.sample-rail .sample-card-caption small').count() === 0, 'Legacy sample pages or Read this example controls remain')
  const arrows = await desktop.locator('.gallery-controls').evaluate(el => ({
    left:el.querySelector('[aria-label="Previous book image"] svg path')?.getAttribute('d'),
    right:el.querySelector('[aria-label="Next book image"] svg path')?.getAttribute('d')
  }))
  observations.galleryArrowPaths = arrows
  check(arrows.left?.startsWith('M20 12H5') && arrows.right?.startsWith('M4 12h15'), 'Carousel arrows do not face opposite directions')
  for (let i=0; i<6; i++) {
    const card=galleryCards.nth(i)
    await card.scrollIntoViewIfNeeded()
    const image=card.locator('img')
    await image.evaluate(img => img.complete ? true : new Promise(resolve => {img.addEventListener('load',()=>resolve(true),{once:true});img.addEventListener('error',()=>resolve(false),{once:true})}))
    const data=await image.evaluate(el=>({src:el.getAttribute('src'),width:el.naturalWidth,ratio:el.naturalWidth/(el.naturalHeight||1)}))
    check(data.src?.includes(gallerySlugs[i]+'-open-book-placeholder.svg') && data.width>0, 'Local placeholder image failed to load for '+gallerySlugs[i])
    check(Math.abs(data.ratio-1.5)<0.01, 'Placeholder image ratio must remain 3:2 for '+gallerySlugs[i])
  }
  await galleryCards.first().scrollIntoViewIfNeeded()
  await desktop.locator('#samples').screenshot({path:path.join(folder,'six-book-gallery-desktop.png'),animations:'disabled'})
  const rail=desktop.locator('.sample-rail')
  const initialScroll=await rail.evaluate(el=>el.scrollLeft)
  await desktop.getByRole('button',{name:'Next book image'}).click()
  await desktop.waitForTimeout(700)
  const forwardScroll=await rail.evaluate(el=>el.scrollLeft)
  check(forwardScroll>initialScroll+30, 'Gallery next arrow did not scroll the image rail')
  await desktop.getByRole('button',{name:'Previous book image'}).click()
  await desktop.waitForTimeout(700)
  const reverseScroll=await rail.evaluate(el=>el.scrollLeft)
  check(reverseScroll<forwardScroll-30, 'Gallery previous arrow did not scroll the image rail')
  const firstGalleryButton=desktop.locator('[data-testid="sample-life-story"]')
  await firstGalleryButton.click()
  const viewer=desktop.locator('[role="dialog"].sample-lightbox')
  await viewer.waitFor({state:'visible'})
  const viewerTitle=()=>viewer.locator('.sample-lightbox-title').innerText()
  check(await viewerTitle()==='Life Story', 'Clicked gallery item did not open matching lightbox')
  check(await viewer.getByRole('button',{name:'Previous book'}).isDisabled(), 'Previous lightbox arrow should be disabled on first book')
  await viewer.screenshot({path:path.join(folder,'six-book-lightbox-first-desktop.png'),animations:'disabled'})
  await desktop.keyboard.press('ArrowRight')
  check(await viewerTitle()==='Travel Memoir', 'Right keyboard arrow did not change lightbox image')
  await desktop.keyboard.press('ArrowLeft')
  check(await viewerTitle()==='Life Story', 'Left keyboard arrow did not change lightbox image')
  for(let i=1;i<6;i++){
    await viewer.getByRole('button',{name:'Next book'}).click()
    check(await viewerTitle()===galleryNames[i], 'Lightbox next arrow failed at book '+i)
  }
  check(await viewer.getByRole('button',{name:'Next book'}).isDisabled(), 'Final lightbox image should disable the next arrow')
  await viewer.screenshot({path:path.join(folder,'six-book-lightbox-sixth-desktop.png'),animations:'disabled'})
  for(let i=4;i>=0;i--){
    await viewer.getByRole('button',{name:'Previous book'}).click()
    check(await viewerTitle()===galleryNames[i], 'Lightbox previous arrow failed at book '+i)
  }
  await desktop.keyboard.press('Escape')
  await viewer.waitFor({state:'hidden'})
  check(await firstGalleryButton.evaluate(el=>document.activeElement===el), 'Closing the lightbox should restore focus to its gallery image')
  observations.bookGallery={cards:6,localImages:6,captionOnly:true,leftArrow:arrows.left,rightArrow:arrows.right,
    railBefore:initialScroll,railAfterNext:forwardScroll,railAfterPrevious:reverseScroll,
    navigatedBothDirections:true,keyboardNavigation:true,escapeFocusReturn:true}

  // The founder-approved book introductions and points are displayed for all six tabs.
  // Desktop copies share the exact top-left start and bottom-left CTA position.
  const bookCopyExpected = [{"slug":"life-story","description":"A personal memoir of the people, places and experiences that shaped a life.","points":["Childhood, family and the places you called home","Choices, relationships and defining moments","Reflections, values and lessons worth passing on"]},{"slug":"travel-memoir","description":"A book about the journeys you remember for more than the places you visited.","points":["How each journey began and what drew you there","Unexpected detours, discoveries and people you met","The experiences that changed how you saw the world"]},{"slug":"relationship-memoir","description":"A memoir of your shared years, from how you met to the life you've built together.","points":["The early days and memories that brought you closer","Shared traditions, milestones and ordinary moments","The changes, challenges and joys you've experienced together"]},{"slug":"founders-memoir","description":"The personal story behind building a business, beyond the milestones others see.","points":["The original idea, purpose and people who helped you begin","Important decisions, turning points and moments of growth","Lessons, reflections and the values behind your work"]},{"slug":"parent-to-child-letters","description":"A collection of personal letters with the stories and guidance you want your child to have.","points":["Experiences and lessons from your own life","Advice about work, money and relationships","Hopes and words of reassurance for the years ahead"]},{"slug":"celebrating-occasions","description":"A book about one meaningful celebration and the people and moments that made it special.","points":["The planning, anticipation and details behind the occasion","Speeches, surprises and moments from the day","Memories and reflections from the people involved"]}];
  const desktopBookGeometry = []
  const bookTabs = desktop.locator('.book-tab-trigger')
  check(await bookTabs.count() === 6, 'Discovery tab count should remain six')
  for (const book of bookCopyExpected) {
    await desktop.locator('[data-testid="book-' + book.slug + '"]').click()
    await desktop.waitForTimeout(170)
    const panel = desktop.locator('.book-detail-stage[data-state="active"]')
    check(await panel.count() === 1, 'One selected book panel must be visible')
    const result = await panel.evaluate((el) => {
      const rect = selector => {const r=(selector === ':scope' ? el : el.querySelector(selector)).getBoundingClientRect();return {top:r.top+scrollY,left:r.left,bottom:r.bottom+scrollY,height:r.height}}
      return {
        intro:el.querySelector('.book-detail-intro')?.textContent ?? '',
        points:[...el.querySelectorAll('.book-detail-points li')].map(li => li.textContent),
        link:el.querySelector('.book-detail-copy .button')?.getAttribute('href'),
        geometry:{panel:rect(':scope'),intro:rect('.book-detail-intro'),list:rect('.book-detail-points'),button:rect('.book-detail-copy .button'),photo:rect('.book-detail-visual')},
        buttonText:el.querySelector('.book-detail-copy .button')?.textContent.trim() ?? '',
        copyStyle:getComputedStyle(el.querySelector('.book-detail-copy')).justifyContent
      }
    })
    check(result.intro === book.description, 'Description mismatch in '+book.slug)
    check(JSON.stringify(result.points) === JSON.stringify(book.points), 'Bullet points mismatch in '+book.slug)
    check(result.points.length >= 2 && result.points.length <= 4, 'Book panel should support two to four bullets')
    check(result.link === 'https://storileaf.com/'+book.slug+'/', 'Book destination changed for '+book.slug)
    check(result.buttonText.includes('Explore this book'), 'CTA label changed for '+book.slug)
    check(result.copyStyle === 'flex-start', 'Book text remains vertically centred for '+book.slug)
    check(result.geometry.button.bottom < result.geometry.panel.bottom-8, 'Book CTA outside panel in '+book.slug)
    check(result.geometry.list.bottom < result.geometry.button.top, 'Book copy overlaps CTA in '+book.slug)
    check(result.geometry.intro.top < result.geometry.list.top, 'Book description must appear above bullets in '+book.slug)
    check(result.geometry.list.bottom < result.geometry.panel.bottom, 'Book text is clipped in '+book.slug)
    desktopBookGeometry.push({slug:book.slug,...result.geometry})
    await panel.screenshot({path:path.join(folder,'book-discovery-'+book.slug+'-desktop.png'),animations:'disabled'})
  }

  const spread = get => Math.round((Math.max(...desktopBookGeometry.map(get))-Math.min(...desktopBookGeometry.map(get)))*10)/10
  observations.bookDiscovery = {
    descriptionsVerified:desktopBookGeometry.length,
    introTopVariation:spread(row=>row.intro.top),
    introLeftVariation:spread(row=>row.intro.left),
    buttonBottomVariation:spread(row=>row.button.bottom),
    buttonLeftVariation:spread(row=>row.button.left),
    panelHeightVariation:spread(row=>row.panel.height),
    photographTopVariation:spread(row=>row.photo.top)
  }
  check(observations.bookDiscovery.introTopVariation <= 1 && observations.bookDiscovery.introLeftVariation <= 1, 'Book text starting position shifts across tabs')
  check(observations.bookDiscovery.buttonBottomVariation <= 1 && observations.bookDiscovery.buttonLeftVariation <= 1, 'Book CTA position shifts across tabs')
  check(observations.bookDiscovery.panelHeightVariation <= 1 && observations.bookDiscovery.photographTopVariation <= 1, 'Book panel or photograph size shifts between tabs')
  await desktop.locator('[data-testid="book-life-story"]').click()

  const physicalBook = await desktop.locator('.book-craft').evaluate(el => {
    const section = el.closest('.samples-section')
    const link = el.querySelector('.book-craft-copy > a.text-link')
    const details = [...el.querySelectorAll('.book-craft-detail')]
    return {
      imageCount:el.querySelectorAll('.book-craft-image img').length,
      detailLabels:details.map(row => row.querySelector('.small-label')?.textContent.trim()),
      ctaText:link?.textContent.trim(),ctaHref:link?.getAttribute('href'),
      detachedLinks:section.querySelectorAll('.samples-bottom').length,
      detailsBeforeCTA:details.at(-1).getBoundingClientRect().bottom < link.getBoundingClientRect().top,
      paddingBottom:getComputedStyle(section).paddingBottom
    }
  })
  observations.physicalBookSingleCTA = physicalBook
  check(physicalBook.imageCount === 1, 'Physical book image was removed')
  check(JSON.stringify(physicalBook.detailLabels) === JSON.stringify(['Printed copy','Binding and finish','Before print']), 'Physical details were changed')
  check(physicalBook.ctaHref === 'https://storileaf.com/pricing/' && physicalBook.ctaText.includes('See package details'), 'Pricing CTA changed')
  check(physicalBook.detachedLinks === 0 && await desktop.getByText('See more inside the books').count() === 0, 'Rejected extra CTA still appears')
  check(physicalBook.detailsBeforeCTA && physicalBook.paddingBottom === '80px', 'Desktop CTA placement or lower spacing incorrect')
  await desktop.locator('.book-craft').screenshot({path:path.join(folder,'physical-book-single-cta-desktop.png'),animations:'disabled'})
  await desktop.locator('.samples-section').screenshot({path:path.join(folder,'samples-section-one-cta-desktop.png'),animations:'disabled'})

  const steps = desktop.locator('.process-steps li')
  const heights = await steps.evaluateAll(els => els.map(el => Math.round(el.getBoundingClientRect().height)))
  observations.desktopStepHeights = heights
  check(heights.length === 4 && heights.every(h => h >= 85 && h <= 108), 'Desktop process steps not condensed')
  const desktopSectionLayout = await desktop.locator('.process-grid').evaluate(el => ({
    copyDisplay: getComputedStyle(el.querySelector('.process-copy')).display,
    photoRow: getComputedStyle(el.querySelector('.process-visual')).gridRowStart,
    firstBorder: getComputedStyle(el.querySelector('.process-steps li:first-child')).borderTopWidth,
    lastBorder: getComputedStyle(el.querySelector('.process-steps li:last-child')).borderBottomWidth,
    middleBorder: getComputedStyle(el.querySelector('.process-steps li:nth-child(2)')).borderBottomWidth
  }))
  observations.processLayout = desktopSectionLayout
  check(desktopSectionLayout.copyDisplay === 'contents' && desktopSectionLayout.photoRow === '2', 'Photograph does not align with the list rows')
  check(desktopSectionLayout.firstBorder === '0px' && desktopSectionLayout.lastBorder === '0px', 'Unwanted first or last divider')
  check(desktopSectionLayout.middleBorder !== '0px', 'Internal divider was removed')
    observations.processGridPosition = await desktop.locator('.process-grid').evaluate(el => getComputedStyle(el).position)
  check(observations.processGridPosition === 'sticky', 'Sticky process grid missing')
  observations.processRunwayHeight = await desktop.locator('.process-section').evaluate(el =>
    Math.round(el.getBoundingClientRect().height - el.querySelector('.process-grid').getBoundingClientRect().height))
  check(observations.processRunwayHeight >= 450, 'Independent scroll runway missing')
  check(await desktop.getByRole('link', { name: /Choose a book/i }).count() >= 1, 'Choose a book CTA missing')
  check(await desktop.getByRole('link', { name: /Explore gifting/i }).count() >= 1, 'Explore gifting CTA missing')
  check((await desktop.locator('.process-bottom-actions a').first().getAttribute('href'))?.includes('#books'), 'Temporary Choose a book destination broken')
  check((await desktop.locator('.process-bottom-actions a').nth(1).getAttribute('href'))?.includes('/gift/'), 'Gifting destination broken')
  check(await desktop.locator('.final-invitation h2').innerText() === 'Let’s find your book.', 'Missing FAQ CTA heading')
  check(await desktop.locator('.final-invitation-intro').innerText() === 'One question is enough to begin.', 'Missing original FAQ CTA line')
  check((await desktop.locator('.final-invitation a').getAttribute('href'))?.includes('#books'), 'Restored CTA target incorrect')
  check(await desktop.evaluate(() => Boolean(document.querySelector('.final-invitation').compareDocumentPosition(document.querySelector('.newsletter-strip')) & Node.DOCUMENT_POSITION_FOLLOWING)), 'CTA must be before newsletter')
  check(await desktop.locator('.newsletter-inline-preview input:disabled').count() === 1, 'Newsletter email field should be visibly disabled')
  check((await desktop.locator('.newsletter-inline-preview a').getAttribute('href')) === 'https://storileaf.com/#newsletter-heading', 'Newsletter link incorrect')

  for (let i = 0; i < 4; i++) {
    await desktop.locator('.process-step').nth(i).click()
    await desktop.waitForTimeout(130)
    check((await desktop.locator('.process-steps li.is-active').getAttribute('data-step-index')) === String(i), 'Process step '+(i+1)+' click failed')
  }
  await desktop.locator('.process-step').first().click()
  const number = await desktop.locator('.process-steps li.is-active .step-number').evaluate(el => {
    const s = getComputedStyle(el)
    return { color:s.color, background:s.backgroundColor }
  })
  observations.activeNumber = number
  check(number.color === 'rgb(255, 255, 255)', 'Active step number contrast failed')
  await desktop.locator('#how-it-works').scrollIntoViewIfNeeded()
  await desktop.waitForTimeout(200)
  await desktop.locator('#how-it-works').screenshot({ path:path.join(folder,'process-desktop.png'), animations:'disabled' })
  const scrollStages = []
  const photoChanges = []
  const pinnedTopPositions = []
  for (let i = 0; i < 4; i++) {
    await desktop.evaluate(index => {
      const rect = document.querySelector('.process-section').getBoundingClientRect()
      window.scrollTo({ top: Math.max(0, scrollY + rect.top - 20 + index * 112 + 6), behavior:'instant' })
    }, i)
    await desktop.waitForTimeout(220)
    scrollStages.push(await desktop.locator('.process-steps li.is-active').getAttribute('data-step-index'))
    photoChanges.push(await desktop.locator('.process-photo').getAttribute('src'))
    pinnedTopPositions.push(await desktop.locator('.process-grid').evaluate(el => Math.round(el.getBoundingClientRect().top)))
  }
  observations.desktopScrollStages = scrollStages
  check(scrollStages.join(',') === '0,1,2,3', 'Independent scroll activation failed')
  check(new Set(photoChanges).size === 4, 'All four process photographs must change')
  observations.processPinnedTopPositions = pinnedTopPositions
  check(Math.max(...pinnedTopPositions) - Math.min(...pinnedTopPositions) <= 2, 'The compact stages should remain pinned while the photos advance')
  const pinnedGeometry = await desktop.evaluate(() => {
    const bounds = s => { const r = document.querySelector(s).getBoundingClientRect(); return { top:r.top, bottom:r.bottom, height:r.height } }
    return { header:bounds('.site-header'), title:bounds('.process-copy h2'),
      first:bounds('.process-steps li:first-child'), last:bounds('.process-steps li:last-child'),
      photo:bounds('.process-visual'), grid:bounds('.process-grid'), actions:bounds('.process-bottom-actions') }
  })
  observations.desktopPinnedGeometry = pinnedGeometry
  check(pinnedGeometry.title.top >= pinnedGeometry.header.bottom + 20, 'Heading still touches or hides behind header')
  check(pinnedGeometry.grid.top >= 120 && pinnedGeometry.grid.top <= 175, 'The process does not pin at a comfortable viewport height')
  check(Math.abs(pinnedGeometry.photo.top - pinnedGeometry.first.top) <= 5, 'Photograph top does not align with first step')
  check(pinnedGeometry.photo.bottom >= pinnedGeometry.last.bottom, 'Photograph does not cover the four-step group')
  check(pinnedGeometry.photo.bottom <= pinnedGeometry.actions.bottom + 10, 'Photograph extends beyond the bottom actions')
  await desktop.screenshot({ path:path.join(folder,'process-stage-four-desktop.png'), animations:'disabled' })
  // Stage 04 should hold like stages 01–03, rather than releasing immediately.
  const fourthBefore = await desktop.evaluate(() => ({
    scrollY, top:document.querySelector('.process-grid').getBoundingClientRect().top,
    photo:document.querySelector('.process-photo').getAttribute('src')
  }))
  await desktop.evaluate(() => window.scrollBy({ top:100, behavior:'instant' }))
  await desktop.waitForTimeout(220)
  const fourthAfter = await desktop.evaluate(() => ({
    scrollY, top:document.querySelector('.process-grid').getBoundingClientRect().top,
    photo:document.querySelector('.process-photo').getAttribute('src'),
    selected:document.querySelector('.process-steps li.is-active')?.dataset.stepIndex
  }))
  observations.fourthStageHold = {
    scrollDistance:Math.round(fourthAfter.scrollY - fourthBefore.scrollY),
    pinnedTopBefore:Math.round(fourthBefore.top),
    pinnedTopAfter:Math.round(fourthAfter.top),
    selected:fourthAfter.selected,
    photoUnchanged:fourthBefore.photo === fourthAfter.photo
  }
  check(observations.fourthStageHold.scrollDistance >= 99, 'Final stage did not advance through its 100px hold interval')
  check(Math.abs(fourthAfter.top - fourthBefore.top) <= 2, 'Final stage becomes unpinned too soon')
  check(fourthAfter.selected === '3' && fourthBefore.photo === fourthAfter.photo, 'Final step or photograph does not remain active')
  await desktop.screenshot({ path:path.join(folder,'process-stage-four-held-desktop.png'), animations:'disabled' })
  const reverseStages = []
  for (let i = 3; i >= 0; i--) {
    await desktop.evaluate(index => {
      const rect = document.querySelector('.process-section').getBoundingClientRect()
      window.scrollTo({ top: Math.max(0, scrollY + rect.top - 20 + index * 112 + 6), behavior:'instant' })
    }, i)
    await desktop.waitForTimeout(160)
    reverseStages.push(await desktop.locator('.process-steps li.is-active').getAttribute('data-step-index'))
  }
  observations.reverseScrollStages = reverseStages
  check(reverseStages.join(',') === '3,2,1,0', 'Reverse scrolling through stages failed')
  await desktop.locator('.final-invitation').scrollIntoViewIfNeeded()
  await desktop.locator('.faq-section').screenshot({ path:path.join(folder,'faq-final-invitation-desktop.png'), animations:'disabled' })
  await desktop.locator('.newsletter-strip').scrollIntoViewIfNeeded()
  await desktop.locator('.newsletter-strip').screenshot({ path:path.join(folder,'newsletter-desktop.png'), animations:'disabled' })
  const booksTrigger = desktop.getByRole('button', {name:'The books', exact:true}).first()
  await booksTrigger.hover()
  await desktop.waitForTimeout(320)
  observations.bookMenuVisible = await desktop.locator('.books-dropdown').first().isVisible()
  check(observations.bookMenuVisible, 'Desktop Books hover dropdown not visible')
  if(observations.bookMenuVisible) await desktop.screenshot({ path:path.join(folder,'books-menu-desktop.png'), animations:'disabled' })
  const resourcesTrigger = desktop.getByRole('button', {name:'Resources', exact:true}).first()
  await resourcesTrigger.hover()
  await desktop.waitForTimeout(360)
  observations.resourceMenuVisible = await desktop.locator('.resources-dropdown').first().isVisible()
  check(observations.resourceMenuVisible, 'Resources hover dropdown not visible after alignment correction')
  if (observations.resourceMenuVisible) {
    await desktop.locator('.site-header').screenshot({ path:path.join(folder,'resources-menu-aligned.png'), animations:'disabled' })
    const resourceLinks = await desktop.locator('.resources-dropdown > a').evaluateAll(links =>
      links.map(el => ({
        direction:getComputedStyle(el).flexDirection,
        label:el.textContent?.trim() ?? ''
      })))
    observations.resourceMenuLinks = resourceLinks
    check(resourceLinks.length >= 3 && resourceLinks.every(link => link.direction === 'row'), 'Resources menu links lost their horizontal alignment')
    const menuAlignment = await desktop.evaluate(() => {
      const trigger = document.querySelector('.header-nav-item .header-nav-trigger[data-state="open"]')
      const panel = document.querySelector('.resources-dropdown')
      return Math.round((panel.getBoundingClientRect().left - trigger.getBoundingClientRect().left)*10)/10
    })
    observations.resourcesPanelLeftOffset = menuAlignment
    check(Math.abs(menuAlignment) <= 1, 'Resources dropdown has shifted horizontally from its trigger')
    await desktop.screenshot({ path:path.join(folder,'resources-menu-open-desktop.png'), animations:'disabled' })
  }

  const multiWidthAlignment = {}
  for (const width of [1280,1440]) {
    await desktop.setViewportSize({width,height:900})
    const diffs = await desktop.evaluate(() => {
      const controls = [...document.querySelectorAll('.desktop-nav-list > li > .header-nav-trigger, .desktop-nav-list > li > .header-simple-link')]
      return controls.map(el => {
        const text = [...el.childNodes].find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim())
        const range = document.createRange()
        range.selectNodeContents(text)
        return range.getBoundingClientRect().top
      })
    })
    multiWidthAlignment[width] = Math.round((Math.max(...diffs) - Math.min(...diffs))*10)/10
    check(multiWidthAlignment[width] <= 0.8, 'Navigation label alignment regressed at '+width+'px')
  }
  observations.headerTextOffsetByWidth = multiWidthAlignment
  const widths=[320,360,390,430,768,820,1024,1280,1440]
  for(const width of widths) {
    await desktop.setViewportSize({width,height:900})
    await desktop.waitForTimeout(90)
    const dimensions=await desktop.evaluate(()=>({vw:innerWidth,doc:document.documentElement.scrollWidth}))
    check(dimensions.doc <= dimensions.vw + 1, 'Document horizontal overflow at '+width+'px')
  }
  observations.checkedWidths = widths

  await desktop.setViewportSize({ width:390, height:844 })
  await desktop.goto(base,{waitUntil:'domcontentloaded'})
  await desktop.waitForTimeout(1100)
  const mobileDiscovery = await desktop.locator('.discovery-heading').evaluate(el => {
    const h=el.querySelector('.discovery-title').getBoundingClientRect()
    const p=el.querySelector('.discovery-description').getBoundingClientRect()
    return {textBelowHeading:p.top>=h.bottom,sideGap:Math.round(p.left-h.left),separation:Math.round(p.top-h.bottom)}
  })
  observations.mobileDiscoveryHeading=mobileDiscovery
  check(mobileDiscovery.textBelowHeading && Math.abs(mobileDiscovery.sideGap)<=2 && mobileDiscovery.separation<=25,
    'Phone heading and supporting paragraph must be stacked and left aligned')
  await desktop.locator('.discovery-heading').screenshot({path:path.join(folder,'book-discovery-heading-mobile.png'),animations:'disabled'})


  await desktop.locator('[data-testid="sample-life-story"]').click()
  const mobileViewer=desktop.locator('[role="dialog"].sample-lightbox')
  await mobileViewer.waitFor({state:'visible'})
  await mobileViewer.screenshot({path:path.join(folder,'six-book-lightbox-mobile.png'),animations:'disabled'})
  const mobileTitle=()=>mobileViewer.locator('.sample-lightbox-title').innerText()
  await desktop.evaluate(()=>{
    const stage=document.querySelector('.sample-lightbox-stage')
    const begin=new Touch({identifier:1,target:stage,clientX:300,clientY:220})
    const finish=new Touch({identifier:1,target:stage,clientX:75,clientY:228})
    stage.dispatchEvent(new TouchEvent('touchstart',{bubbles:true,touches:[begin],changedTouches:[begin],targetTouches:[begin]}))
    stage.dispatchEvent(new TouchEvent('touchend',{bubbles:true,touches:[],changedTouches:[finish],targetTouches:[]}))
  })
  await desktop.waitForTimeout(80)
  check(await mobileTitle()==='Travel Memoir', 'Mobile leftward swipe should advance to next book')
  await desktop.evaluate(()=>{
    const stage=document.querySelector('.sample-lightbox-stage')
    const begin=new Touch({identifier:2,target:stage,clientX:70,clientY:220})
    const finish=new Touch({identifier:2,target:stage,clientX:302,clientY:230})
    stage.dispatchEvent(new TouchEvent('touchstart',{bubbles:true,touches:[begin],changedTouches:[begin],targetTouches:[begin]}))
    stage.dispatchEvent(new TouchEvent('touchend',{bubbles:true,touches:[],changedTouches:[finish],targetTouches:[]}))
  })
  await desktop.waitForTimeout(80)
  check(await mobileTitle()==='Life Story', 'Mobile rightward swipe should return to previous book')
  await mobileViewer.getByRole('button',{name:'Close book image'}).click()
  await mobileViewer.waitFor({state:'hidden'})
  check(await desktop.locator('[data-testid="sample-life-story"]').evaluate(el=>document.activeElement===el), 'Mobile viewer close did not restore focus')
  await desktop.locator('#samples').screenshot({path:path.join(folder,'six-book-gallery-mobile.png'),animations:'disabled'})
  observations.mobileBookGallery={swipeForward:true,swipeBack:true,focusReturn:true}

  const mobileCovers = await desktop.locator('.hero-orbit-square').count()
  const mobileOuterRadius = await desktop.locator('.hero-orbit-outer').evaluate(el => getComputedStyle(el).getPropertyValue('--orbit-radius').trim())
  observations.mobileHero = {count:mobileCovers,outerRadius:mobileOuterRadius}
  check(mobileCovers === 14 && mobileOuterRadius === '412.5px', 'Mobile hero must retain all fourteen covers and the 10% wider outer radius')
  await desktop.locator('.hero').screenshot({ path:path.join(folder,'hero-fourteen-covers-mobile.png'), animations:'disabled' })
  for (const book of bookCopyExpected) {
    await desktop.locator('[data-testid="book-' + book.slug + '"]').click()
    await desktop.waitForTimeout(75)
    const el = desktop.locator('.book-detail-stage[data-state="active"]')
    const metrics = await el.evaluate(panel => {
      const description = panel.querySelector('.book-detail-intro').getBoundingClientRect()
      const points = panel.querySelector('.book-detail-points').getBoundingClientRect()
      const button = panel.querySelector('.button').getBoundingClientRect()
      const panelRect = panel.getBoundingClientRect()
      return {descriptionTop:description.top,pointsTop:points.top,pointsBottom:points.bottom,buttonTop:button.top,buttonBottom:button.bottom,panelBottom:panelRect.bottom}
    })
    check(metrics.descriptionTop < metrics.pointsTop && metrics.pointsBottom < metrics.buttonTop && metrics.buttonBottom <= metrics.panelBottom, 'Mobile book layout overlaps or clips '+book.slug)
  }
  await desktop.locator('[data-testid="book-parent-to-child-letters"]').click()
  await desktop.locator('.book-detail-stage[data-state="active"]').screenshot({path:path.join(folder,'book-discovery-parent-to-child-letters-mobile.png'),animations:'disabled'})
  await desktop.locator('#how-it-works').scrollIntoViewIfNeeded()
  const physicalBookMobile = await desktop.locator('.book-craft').evaluate(el => {
    const section=el.closest('.samples-section')
    return {
      detached:section.querySelectorAll('.samples-bottom').length,
      details:el.querySelectorAll('.book-craft-detail').length,
      cta:el.querySelector('.book-craft-copy > a.text-link')?.getAttribute('href'),
      paddingBottom:getComputedStyle(section).paddingBottom
    }
  })
  observations.physicalBookMobile = physicalBookMobile
  check(physicalBookMobile.detached === 0 && physicalBookMobile.details === 3, 'Mobile physical book section incomplete')
  check(physicalBookMobile.cta === 'https://storileaf.com/pricing/' && physicalBookMobile.paddingBottom === '66px', 'Mobile pricing CTA or bottom spacing changed')
  observations.mobileCraftGeometry = await desktop.locator('.book-craft').evaluate(el => {
    const link = el.querySelector('.book-craft-copy > a.text-link')
    const r = x => { const q=x.getBoundingClientRect();return {top:Math.round(q.top),bottom:Math.round(q.bottom),height:Math.round(q.height)} }
    return {craft:r(el),copy:r(el.querySelector('.book-craft-copy')),link:r(link),
      visible:!!link.getClientRects().length,display:getComputedStyle(link).display,
      overflow:getComputedStyle(el).overflow,
      section:r(el.closest('.samples-section'))}
  })
  check(observations.mobileCraftGeometry.visible, 'Mobile Pricing CTA is not displayed')
  check(observations.mobileCraftGeometry.link.bottom <= observations.mobileCraftGeometry.craft.bottom + 2, 'Mobile Pricing CTA extends beyond the book-craft panel')
  await desktop.locator('.book-craft').scrollIntoViewIfNeeded()
  await desktop.waitForTimeout(150)
  await desktop.locator('.book-craft').screenshot({path:path.join(folder,'physical-book-single-cta-mobile.png'),animations:'disabled'})
  await desktop.locator('.book-craft-copy').screenshot({path:path.join(folder,'physical-book-copy-and-cta-mobile.png'),animations:'disabled'})
  await desktop.locator('.samples-section').screenshot({path:path.join(folder,'samples-section-one-cta-mobile.png'),animations:'disabled'})
    const mobileDividers = await desktop.locator('.process-steps').evaluate(el => ({
    first:getComputedStyle(el.querySelector('li:first-child')).borderTopWidth,
    last:getComputedStyle(el.querySelector('li:last-child')).borderBottomWidth,
    middle:getComputedStyle(el.querySelector('li:nth-child(2)')).borderBottomWidth
  }))
  observations.mobileDividers = mobileDividers
  check(mobileDividers.first === '0px' && mobileDividers.last === '0px' && mobileDividers.middle !== '0px', 'Mobile outer dividers should be removed, inner dividers retained')
  check(await desktop.locator('.process-copy').evaluate(el => getComputedStyle(el).display) !== 'contents', 'Mobile should retain normal process reading order')
  await desktop.locator('#how-it-works').screenshot({ path:path.join(folder,'process-mobile.png'), animations:'disabled' })
  await desktop.locator('.final-invitation').scrollIntoViewIfNeeded()
  await desktop.locator('.final-invitation').screenshot({ path:path.join(folder,'faq-final-invitation-mobile.png'), animations:'disabled' })
  await desktop.locator('.newsletter-strip').scrollIntoViewIfNeeded()
  await desktop.locator('.newsletter-strip').screenshot({ path:path.join(folder,'newsletter-mobile.png'), animations:'disabled' })
  const mobileMenu=desktop.getByRole('button',{name:/Open navigation/i}).first()
  if(await mobileMenu.count()) {
    await mobileMenu.click()
    await desktop.waitForTimeout(150)
    await desktop.screenshot({path:path.join(folder,'mobile-menu.png'),animations:'disabled'})
  } else problems.push('Mobile navigation trigger missing')

  const reduced = await browser.newContext({ viewport: { width: 1440,height:900 }, reducedMotion:'reduce' })
  const reducedPage=await reduced.newPage()
  await reducedPage.goto(base,{waitUntil:'domcontentloaded'})
  observations.prefersReducedMotion=await reducedPage.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches)
  check(observations.prefersReducedMotion, 'Reduced motion context not applied')
  await reduced.close()
} catch (error) {
  problems.push('Test execution error: '+String(error))
} finally {
  await fs.mkdir('qa',{recursive:true})
  await fs.writeFile('qa/homepage-qa-report.json',JSON.stringify({date:new Date().toISOString(),commit:process.env.GITHUB_SHA||'',observations,problems},null,2)+'\n')
  await browser.close()
}
console.log(JSON.stringify({observations,problems},null,2))
if(problems.length) process.exitCode=1
