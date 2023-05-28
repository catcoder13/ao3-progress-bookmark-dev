import {reactive, ref} from 'vue'
import {mainContent, chapterDoms, fullViewMode, workId, chapterInfos, isOneShot} from './static'
import { AO3_DOMAIN } from '@/common/variables'

let chapters = null
const chaptersRef = {}
const curChI = ref(0)
const curChITop = ref(0)

const view = reactive({ width: document.documentElement.clientWidth, height: document.documentElement.clientHeight, scrollY: 0})

if (chapterDoms.length) { // multi chapter
  curChI.value = parseInt(chapterDoms[0].getAttribute('id').split('chapter-')[1]) - 1
  curChITop.value = curChI.value

  chapterDoms.forEach(ch => {
    const chIndex = parseInt(ch.getAttribute('id').split('chapter-')[1]) - 1
    chaptersRef[chIndex] = reactive({ top: -1, height: 0, progress: 0, dom: ch })
  })
} else { // one shot
  chaptersRef[0] = reactive({ top: -1, height: 0, progress: 0, dom: mainContent && mainContent.querySelector('#chapters') })
}

chapters = chaptersRef



const onScroll = (e, manualY) => {
  const scrollBottom = (manualY || window.scrollY) + view.height
  let curChInView = chapterDoms.length > 0 ? curChI.value : 0

  if (chapterDoms.length > 1) { // if the page is fullViewMode
    curChInView = Object.keys(chapters).filter(chI => {
      // const trigger = chapters[chI].top + view.height / 2
      const trigger = chapters[chI].top
      return trigger < scrollBottom
    }).length
    curChInView = curChInView < 2 ? 0 : curChInView - 1
  }
  
  // const triggerHorizon = chapters[curChInView].top + view.height / 2
  const triggerHorizon = chapters[curChInView].top
  chapters[curChInView].progress = (Math.min(1, Math.max(0, (scrollBottom - triggerHorizon) / chapters[curChInView].height)) * 100).toFixed(0)
  curChI.value = curChInView

  view.scrollY = window.scrollY
}

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

const getCurrentChapter = () => {
  let curChInView = chapterDoms.length > 0 ? curChI.value : 0
  const scrollBottom = window.scrollY + window.innerHeight

  if (chapterDoms.length > 1) { // if the page is fullViewMode
    curChInView = Object.keys(chapters).filter(chI => {
      const trigger = chapters[chI].top
      return trigger < scrollBottom
    }).length
    curChInView = curChInView < 2 ? 0 : curChInView - 1
  }

  return curChInView
}

const jumpToFirstChapter = () => {
  jumpToChapter(0)
}

const jumpToPreviousChapter = () => {
  const prevChI = Math.max(0, getCurrentChapter() - 1)
  jumpToChapter(prevChI)
}

const jumpToCurrentChapter = () => {
  if (isOneShot) {
    mainContent.querySelector('.title').scrollIntoView()
  } else {
    chapters[getCurrentChapter()].dom.scrollIntoView()
  }
  
}

const jumpToNextChapter = () => {
  const nextChI = Math.min(chapterInfos.length - 1, getCurrentChapter() + 1)
  jumpToChapter(nextChI)
}

const jumpToLastChapter = () => {
  jumpToChapter(chapterInfos.length - 1)
}

const jumpToChapter = chI => {
  if (isOneShot) return

  if (fullViewMode) {
    document.getElementById(`chapter-${parseInt(chI) + 1}`).scrollIntoView()
  } else {
    window.location.href = `${AO3_DOMAIN}/works/${workId}/chapters/${chapterInfos[chI].chID}#chapter-${parseInt(chI) + 1}`
  }

  onScroll()
}


window.addEventListener('scroll', onScroll)
window.addEventListener('resize', onResize)
onResize()



export {
  chapters, curChI, view, onScroll,
  jumpToChapter, jumpToCurrentChapter,
  jumpToFirstChapter, jumpToLastChapter, jumpToPreviousChapter, jumpToNextChapter
}
