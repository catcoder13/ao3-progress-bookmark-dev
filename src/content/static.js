const urlParams = (new URLSearchParams(window.location.search)).get('view_full_work')
const fullViewMode = (urlParams && urlParams.toLowerCase() === 'true') ? 1 : 0
console.log('cookie', document.cookie)
const match = (window.location.href).match(/\/works\/(\d+)(?:\/chapters\/(\d+))?/)
let workId = null
let chapterId = null

if (match) {
  workId = match[1]
  chapterId = match[2]
} else {
  console.log('url not match')
}

console.log('fullViewMode: ', fullViewMode, workId, chapterId)

const mainContent = document.querySelector('#workskin')
const chapterDoms = mainContent.querySelectorAll('#chapters > .chapter')

mainContent.classList.toggle('oneshot', chapterDoms.length === 0)

export {
  workId, chapterId, fullViewMode,
  mainContent, chapterDoms
}
