import {reactive, ref} from 'vue'
import {fullViewMode, workId, chapterId, mainContent, chapterDoms} from './static'
import { localStore } from './store'
import { initBookmark } from './bookmark'

console.log('chapter length', chapterDoms.length)

let chapters = null
const chaptersRef = {}
const curChI = ref(0)

if (chapterDoms.length) { // multi chapter
  curChI.value = parseInt(chapterDoms[0].getAttribute('id').split('chapter-')[1]) - 1
} else { // one shot
  chaptersRef[0] = reactive({
    top: -1, height: 0, progress: 0, id: chapterId,
    title: mainContent.querySelector('.title').innerText,
    // dom: mainContent.querySelector('#chapters > .userstuff'),
    dom: mainContent.querySelector('#chapters'),
    // paraBM: reactive({}),
    percBM: reactive([]),
    // paraBMCount: 0,
    percBMCount: 0
  })
}

chapterDoms.forEach(ch => {
  const chIndex = parseInt(ch.getAttribute('id').split('chapter-')[1]) - 1
  // const chID = ch.querySelector('.title a').getAttribute('href').match(/\/works\/(\d+)(?:\/chapters\/(\d+))?/)[2]
  // console.log('chapter id', chID, chIndex)
  chaptersRef[chIndex] = reactive({
    top: -1, height: 0, progress: 0, id: chapterId,
    title: ch.querySelector('.title').innerHTML.replace(/<a[^>]*>(.*?)<\/a>(?:\s*:\s*)?(.*)/, '$2').trim(),
    // dom: ch.querySelector(':scope > .userstuff'),
    dom: ch,
    // paraBM: reactive({}),
    percBM: reactive([]),
    // paraBMCount: 0,
    percBMCount: 0
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
  if (fullViewMode) {
    curChInView = Object.keys(chapters).filter(chI => chapters[chI].top < scrollBottom).length
    curChInView = curChInView < 2 ? 0 : curChInView - 1
  }
  chapters[curChInView].progress = (Math.min(1, Math.max(0, (scrollBottom - chapters[curChInView].top) / chapters[curChInView].height)) * 100).toFixed(0)
  curChI.value = curChInView
}

const onResize = () => {
  Object.keys(chapters).forEach(chIndex => {
    const {height, top} = chapters[chIndex].dom.getBoundingClientRect()
    chapters[chIndex].height = height
    chapters[chIndex].top = window.scrollY + top
    // chapters[chIndex].top = window.scrollY + top + window.innerHeight / 2
  })
  onScroll()
}

window.addEventListener('scroll', onScroll)
window.addEventListener('resize', onResize)

onResize()



export {chapters, curChI}
