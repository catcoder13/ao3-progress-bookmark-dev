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

  chapterDoms.forEach(ch => {
    const chIndex = parseInt(ch.getAttribute('id').split('chapter-')[1]) - 1
    chaptersRef[chIndex] = reactive({
      top: -1, height: 0, progress: 0, id: chapterId,
      title: ch.querySelector('.title').innerHTML.replace(/<a[^>]*>(.*?)<\/a>(?:\s*:\s*)?(.*)/, '$2').trim(),
      dom: ch,
      percBM: reactive([])
    })
  })
} else { // one shot
  chaptersRef[0] = reactive({
    top: -1, height: 0, progress: 0, id: chapterId,
    title: mainContent.querySelector('.title').innerText,
    dom: mainContent.querySelector('#chapters'),
    percBM: reactive([])
  })
}

chapters = chaptersRef
console.log('chapters', chapters)

if (localStore.bookmarks[workId]) {
  initBookmark(localStore.bookmarks[workId], chapters, curChI)
}

const onScroll = () => {
  const scrollBottom = window.scrollY + window.innerHeight
  let curChInView = chapterDoms.length > 0 ? curChI.value : 0
  
  if (fullViewMode) {
    curChInView = Object.keys(chapters).filter(chI => {
      const trigger = chapters[chI].top + window.innerHeight / 2
      return trigger < scrollBottom
    }).length
    curChInView = curChInView < 2 ? 0 : curChInView - 1
  }
  
  const triggerHorizon = chapters[curChInView].top + window.innerHeight / 2
  chapters[curChInView].progress = (Math.min(1, Math.max(0, (scrollBottom - triggerHorizon) / chapters[curChInView].height)) * 100).toFixed(0)
  curChI.value = curChInView
}

const onResize = () => {
  const chIs = Object.keys(chapters)
  const {top, height} = mainContent.getBoundingClientRect()
  // set first chapter top
  chapters[chIs[0]].top = window.scrollY + top
  
  // middle chapters
  for (var i=1; i < chIs.length; i++) {
    const chI = chIs[i]
    const prevChI = chIs[i-1]
    const {top: mTop} = chapters[chI].dom.getBoundingClientRect()
    chapters[chI].top = window.scrollY + mTop
    chapters[prevChI].height = chapters[chI].top - chapters[prevChI].top
  }

  // set last chapter height
  chapters[chIs[chIs.length - 1]].height = chapters[chIs[0]].top + height - chapters[chIs[chIs.length - 1]].top
  
  onScroll()
}

window.addEventListener('scroll', onScroll)
window.addEventListener('resize', onResize)
onResize()



export {chapters, curChI}
