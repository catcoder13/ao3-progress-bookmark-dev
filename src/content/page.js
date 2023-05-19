import {reactive, ref} from 'vue'
import {mainContent, chapterDoms} from './static'

let chapters = null
const chaptersRef = {}
const curChI = ref(0)

const navbarStyle = reactive({ position: 'fixed', top: 0, opacity: 0.5})
let mainContentTop = 0

const windowSize = reactive({ width: window.innerWidth, height: window.innerHeight})

if (chapterDoms.length) { // multi chapter
  curChI.value = parseInt(chapterDoms[0].getAttribute('id').split('chapter-')[1]) - 1

  chapterDoms.forEach(ch => {
    const chIndex = parseInt(ch.getAttribute('id').split('chapter-')[1]) - 1
    chaptersRef[chIndex] = reactive({ top: -1, height: 0, progress: 0, dom: ch })
  })
} else { // one shot
  chaptersRef[0] = reactive({ top: -1, height: 0, progress: 0, dom: mainContent && mainContent.querySelector('#chapters') })
}

chapters = chaptersRef

const onScroll = (e, manualY) => {
  const scrollBottom = (manualY || window.scrollY) + windowSize.height
  let curChInView = chapterDoms.length > 0 ? curChI.value : 0
  
  if (chapterDoms.length > 1) { // if the page is fullViewMode
    curChInView = Object.keys(chapters).filter(chI => {
      const trigger = chapters[chI].top + windowSize.height / 2
      return trigger < scrollBottom
    }).length
    curChInView = curChInView < 2 ? 0 : curChInView - 1
  }
  
  const triggerHorizon = chapters[curChInView].top + windowSize.height / 2
  chapters[curChInView].progress = (Math.min(1, Math.max(0, (scrollBottom - triggerHorizon) / chapters[curChInView].height)) * 100).toFixed(0)
  curChI.value = curChInView

  const sticked = window.scrollY >= mainContentTop
  navbarStyle.position = sticked ? 'fixed' : 'absolute'
  navbarStyle.top = sticked ? 0 : `${mainContentTop}px`
  navbarStyle.opacity = sticked ? 1 : 0.5
}

const onResize = () => {
  windowSize.width = document.documentElement.clientWidth
  windowSize.height = document.documentElement.clientHeight
  const chIs = Object.keys(chapters)
  chIs.forEach(chI => {
    const {top, height} = (chapters[chI].dom && chapters[chI].dom.getBoundingClientRect()) || {top: 0, height: 0}
    chapters[chI].top = window.scrollY + top
    chapters[chI].height = height
  })

  mainContentTop = window.scrollY + (mainContent ? mainContent.getBoundingClientRect().top : 0)
  // mainContentTop = window.scrollY + mainContent.getBoundingClientRect().top

  onScroll()
}

window.addEventListener('scroll', onScroll)
window.addEventListener('resize', onResize)
onResize()



export {chapters, curChI, navbarStyle, windowSize, onScroll}
