import {reactive, ref} from 'vue'
import {workMode, workId, chapterId} from './work'
import { localStore } from './store'
import { initBookmark } from './bookmark'

const mainContent = document.querySelector('#workskin')
const chapterDoms = mainContent.querySelectorAll('#chapters > .chapter')
console.log('chapter length', chapterDoms.length)

let chapters = null
const chaptersRef = {}
const curChI = ref(0)

if (chapterDoms.length) { // multi chapter
  curChI.value = parseInt(chapterDoms[0].getAttribute('id').split('chapter-')[1]) - 1
} else { // one shot
  chaptersRef[0] = reactive({
    middle: -1, height: 0, progress: 0, id: chapterId,
    title: mainContent.querySelector('.title').innerText,
    dom: mainContent.querySelector('#chapters > .userstuff'),
    paraBM: reactive({}),
    percBM: reactive([]),
    bmIndex: reactive({})
  })
}

chapterDoms.forEach(ch => {
  const chIndex = parseInt(ch.getAttribute('id').split('chapter-')[1]) - 1
  const chID = ch.querySelector('.title a').getAttribute('href').match(/\/works\/(\d+)(?:\/chapters\/(\d+))?/)[2]
  console.log('chapter id', chID, chIndex)
  chaptersRef[chIndex] = reactive({
    middle: -1, height: 0, progress: 0, id: chapterId,
    title: ch.querySelector('.title').innerHTML.replace(/<a[^>]*>(.*?)<\/a>(?:\s*:\s*)?(.*)/, '$2').trim(),
    dom: ch.querySelector(':scope > .userstuff'),
    paraBM: reactive({}),
    percBM: reactive([]),
    bmIndex: reactive({})
  })
  
})

chapters = chaptersRef
console.log('chapters', chapters)

if (localStore.bookmarks[workId]) {
  initBookmark(localStore.bookmarks[workId], chapters, curChI)
}

const onScroll = () => {
  const scrollBottom = window.scrollY + window.innerHeight
  let curChInView = chapterDoms.length > 0 ? curChI.value : 0
  if (workMode) {
    curChInView = Object.keys(chapters).filter(chI => chapters[chI].middle < scrollBottom).length
    curChInView = curChInView < 2 ? 0 : curChInView - 1
  }
  chapters[curChInView].progress = (Math.min(1, Math.max(0, (scrollBottom - chapters[curChInView].middle) / chapters[curChInView].height)) * 100).toFixed(0)
  curChI.value = curChInView
}

const onResize = () => {
  Object.keys(chapters).forEach(chIndex => {
    const {height, top} = chapters[chIndex].dom.getBoundingClientRect()
    chapters[chIndex].height = height
    chapters[chIndex].middle = window.scrollY + top
    // chapters[chIndex].middle = window.scrollY + top + window.innerHeight / 2
  })
  onScroll()
}

window.addEventListener('scroll', onScroll)
window.addEventListener('resize', onResize)

onResize()



export {mainContent, chapters, curChI}
