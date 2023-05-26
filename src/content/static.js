// retrieve dom reference 
// mainContent: one-shot title, one-shot chapter section
// chapterDoms: multiple chapter work's chapter's titles, each chapter's section
const mainContent = document.querySelector('#workskin')
if (!mainContent) console.warn('not in a work page')

const chapterDoms = mainContent ? mainContent.querySelectorAll('#chapters > .chapter') : []

// initialise mainContent class name
const isOneShot = chapterDoms.length === 0
if (mainContent) mainContent.classList.toggle('oneshot', isOneShot)

// retrieve work id and chapter id(if any)
let workId = null
const workName = mainContent && mainContent.querySelector('.title').innerText
const authorName = mainContent && mainContent.querySelector('.byline a[rel=author]').innerText
const authorLink = mainContent && mainContent.querySelector('.byline a[rel=author]').getAttribute('href')

// let chapterId = null
let fullViewMode = false

const match1 = (window.location.href).match(/chapters\/(\d+)/)
const match2 = (window.location.href).match(/\/works\/(\d+)/)

if (match1) { // pattern: https://archiveofourown.org/chapters/xxxxxxxxx
  // workId not found on window.location.href, extract from dom element instead
  workId = mainContent && mainContent.querySelector('.title a').getAttribute('href').match(/\/works\/(\d+)/)[1]
} else if (match2) { // pattern: https://archiveofourown.org/works/xxxxxxxxx/...
  workId = match2[1]

  const urlParams = (new URLSearchParams(window.location.search)).get('view_full_work')
  fullViewMode = (urlParams && urlParams.toLowerCase() === 'true') ? 1 : 0
} else {
  console.warn('url not match, workId not found')
}

console.log(fullViewMode, workId, workName, authorName, authorLink)

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

// console.log(chapterInfos)

export {
  workId, workName, fullViewMode, isOneShot,
  authorName, authorLink,
  mainContent, chapterDoms, chapterInfos
}
