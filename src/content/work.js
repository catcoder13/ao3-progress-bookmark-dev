const urlParams = (new URLSearchParams(window.location.search)).get('view_full_work')
const workMode = (urlParams && urlParams.toLowerCase() === 'true') ? 1 : 0
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

console.log('workMode: ', workMode, workId, chapterId)


export {workId, chapterId, workMode}
