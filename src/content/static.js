// retrieve dom reference 
// mainContent: one-shot title, one-shot chapter section
// chapterDoms: multiple chapter work's chapter's titles, each chapter's section
const mainContent = document.querySelector('#workskin')
const chapterDoms = mainContent.querySelectorAll('#chapters > .chapter')

// initialise mainContent class name
mainContent.classList.toggle('oneshot', chapterDoms.length === 0)

// retrieve work id and chapter id(if any)
let workId = null
// let chapterId = null
let fullViewMode = false

const match1 = (window.location.href).match(/chapters\/(\d+)/)
const match2 = (window.location.href).match(/\/works\/(\d+)/)

if (match1) { // pattern: https://archiveofourown.org/chapters/xxxxxxxxx
  // workId not found on window.location.href, extract from dom element instead
  workId = mainContent.querySelector('.title a').getAttribute('href').match(/\/works\/(\d+)/)[1]
} else if (match2) { // pattern: https://archiveofourown.org/works/xxxxxxxxx/...
  workId = match2[1]

  const urlParams = (new URLSearchParams(window.location.search)).get('view_full_work')
  fullViewMode = (urlParams && urlParams.toLowerCase() === 'true') ? 1 : 0
} else {
  console.warn('url not match, workId not found')
}

console.log(fullViewMode, workId)

const chapterListElem = document.getElementById('selected_id')
let chapterInfos = null 
if (chapterListElem) {
  chapterInfos = Array.from(chapterListElem.querySelectorAll('option')).map(optElem => {
    return {
      chID: optElem.getAttribute('value'),
      title: optElem.innerText.match(/(?:\d+\. )?(.+)/)[1]
    }
  })
} else if (chapterDoms.length) {
  chapterInfos = Array.from(chapterDoms).map(chDom => {
    const matches = (/^Chapter \d+(?:: (.*))?$/).exec(chDom.querySelector('.title').innerText)
    return {
      chID: chDom.querySelector('.title a').getAttribute('href').match(/\/works\/\d+\/chapters\/(\d+)/)[1],
      title: matches[1] || matches[0]
    }
  })
} else {
  // one shot does not have chapter id
  chapterInfos = [{ chID: null, title: mainContent.querySelector('.title').innerText }]
}

console.log(chapterInfos)

// identify user or guest
const iconHrefDom = document.querySelector('#greeting .icon a')
const userName = iconHrefDom && iconHrefDom.getAttribute('href').split('/users/')[1].toLowerCase()
console.log('user', userName)

export {
  userName,
  workId, fullViewMode,
  mainContent, chapterDoms, chapterInfos
}
