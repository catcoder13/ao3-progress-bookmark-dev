// retrieve view mode (true: entire work view, false: chapter by chapter view)
const urlParams = (new URLSearchParams(window.location.search)).get('view_full_work')
const fullViewMode = (urlParams && urlParams.toLowerCase() === 'true') ? 1 : 0
console.log('cookie', document.cookie)
const match = (window.location.href).match(/\/works\/(\d+)(?:\/chapters\/(\d+))?/)

// retrieve work id and chapter id(if any)
let workId = null
let chapterId = null

if (match) {
  workId = match[1]
  chapterId = match[2]
} else {
  console.log('url not match')
}

console.log('fullViewMode: ', fullViewMode, workId, chapterId)

// retrieve dom reference 
// mainContent: one-shot title, one-shot chapter section
// chapterDoms: multiple chapter work's chapter's titles, each chapter's section
const mainContent = document.querySelector('#workskin')
const chapterDoms = mainContent.querySelectorAll('#chapters > .chapter')

// initialise mainContent class name
mainContent.classList.toggle('oneshot', chapterDoms.length === 0)

// identify user or guess
const iconHrefDom = document.querySelector('#greeting .icon a')
const userName = iconHrefDom && iconHrefDom.getAttribute('href').split('/users/')[1].toLowerCase()
console.log('user', userName)

export {
  userName,
  workId, chapterId, fullViewMode,
  mainContent, chapterDoms
}
