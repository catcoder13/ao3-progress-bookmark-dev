import {reactive, computed} from 'vue'
import {mainContent, chapterDoms, fullViewMode, oneShot} from './static'
import { scrollY, onScroll, activateScroll } from './scroll'

let chapters = null
const chaptersRef = {}
let initCurChI = 0

const view = reactive({ width: document.documentElement.clientWidth, height: document.documentElement.clientHeight})

if (chapterDoms.length) { // multi chapter
  initCurChI = parseInt(chapterDoms[0].getAttribute('id').split('chapter-')[1]) - 1

  chapterDoms.forEach(ch => {
    const chIndex = parseInt(ch.getAttribute('id').split('chapter-')[1]) - 1
    chaptersRef[chIndex] = reactive({ top: -1, height: 0, dom: ch })
  })
} else { // one shot
  chaptersRef[0] = reactive({ top: -1, height: 0, dom: mainContent && mainContent.querySelector('#chapters') })
}

chapters = chaptersRef

if (!oneShot && fullViewMode && chapterDoms.length > 1) {
 activateScroll()
}

const curChI = computed(() => {
  if (oneShot || chapterDoms.length === 1) return initCurChI

  const scrollBottom = scrollY.value + view.height

  const result = Object.keys(chapters).filter(chI => {
    return chapters[chI].top < scrollBottom
  }).length

  return result < 2 ? 0 : result - 1
})

const curChProgress = computed(() => {
  const scrollBottom = scrollY.value + view.height
  return (Math.min(1, Math.max(0, (scrollBottom - chapters[curChI.value].top) / chapters[curChI.value].height)) * 100).toFixed(0)
})

const onResize = () => {
  view.width = document.documentElement.clientWidth
  view.height = document.documentElement.clientHeight
  
  const chIs = Object.keys(chapters)
  chIs.forEach(chI => {
    const {top, height} = (chapters[chI].dom && chapters[chI].dom.getBoundingClientRect()) || {top: 0, height: 0}
    chapters[chI].top = window.scrollY + top
    chapters[chI].height = height
  })

  onScroll()
}

window.addEventListener('resize', onResize)
onResize()

export { chapters, curChI, curChProgress, view }
