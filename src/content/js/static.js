// retrieve dom reference 
// mainContent: one-shot title, one-shot chapter section
// chapterDoms: multiple chapter work's chapter's titles, each chapter's section
const outer = document.getElementById('outer')
const mainContent = document.getElementById('workskin')
if (!mainContent) console.warn('[AO3 IPB] URL matches a work page, however #worksin does not exist, thus it is deemed not a work page.')

const innerDivWorkWrapper = document.querySelector('#inner #main .wrapper')
if (!innerDivWorkWrapper) console.warn('[AO3 IPB] URL matches a work page, however (#inner #main .wrapper) does not exist, thus it is deemed not a work page.')

const chapterDoms = mainContent ? mainContent.querySelectorAll('#chapters > .chapter') : []

// initialise mainContent class name
const oneShot = chapterDoms.length === 0
if (mainContent) mainContent.classList.toggle('oneshot', oneShot)

// retrieve work id and chapter id(if any)
let workID = null
const name = mainContent && mainContent.querySelector('.title').innerText
const author = mainContent && mainContent.querySelector('.byline a[rel=author]').innerText
const authorURL = mainContent && mainContent.querySelector('.byline a[rel=author]').getAttribute('href')

let fullViewMode = false
let jumpToBMOnLoad = false
const match1 = (window.location.href).match(/chapters\/(\d+)/)
const match2 = (window.location.href).match(/\/works\/(\d+)/)

if (match1) { // pattern: https://archiveofourown.org/chapters/xxxxxxxxx
  // workID not found on window.location.href, extract from dom element instead
  workID = mainContent && mainContent.querySelector('.title a').getAttribute('href').match(/\/works\/(\d+)/)[1]
} else if (match2) { // pattern: https://archiveofourown.org/works/xxxxxxxxx/...
  workID = match2[1]

  const url = new URL(window.location.href)

  // const urlParams = new URLSearchParams(window.location.search)
  const fullViewParam = url.searchParams.get('view_full_work')
  jumpToBMOnLoad = url.searchParams.has('jumptobm')
  console.log('test jumptobm', jumpToBMOnLoad)
  fullViewMode = (fullViewParam && fullViewParam.toLowerCase() === 'true') ? 1 : 0
} else {
  console.warn('url not match, workID not found')
}

// console.log(fullViewMode, workID, name, author, authorURL)

const chapterListElem = document.getElementById('selected_id')
let chapterInfos = null 
if (chapterListElem) {
  chapterInfos = Array.from(chapterListElem.querySelectorAll('option')).map((optElem,i) => {
    const title = optElem.innerText.match(/(?:\d+\. )?(.+)/)[1]
    
    return {
      chID: optElem.getAttribute('value'),
      title: title !== `Chapter ${i+1}` ? title : null
    }
  })
} else if (chapterDoms.length) {
  chapterInfos = Array.from(chapterDoms).map(chDom => {
    const matches = (/^Chapter \d+(?:: (.*))?$/).exec(chDom.querySelector('.title').innerText)
    const title = matches[1] || matches[0]
    return {
      chID: chDom.querySelector('.title a').getAttribute('href').match(/\/works\/\d+\/chapters\/(\d+)/)[1],
      title: title !== chDom.querySelector('.title a').innerText ? title : null
    }
  })
} else {
  // one shot does not have chapter id
  chapterInfos = [{ chID: null, title: null }]
}

export {
  workID, name, fullViewMode, jumpToBMOnLoad, oneShot,
  author, authorURL,
  outer, mainContent, innerDivWorkWrapper, chapterDoms, chapterInfos
}
