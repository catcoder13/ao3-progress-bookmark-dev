import {ref, reactive, computed, watch } from 'vue'
import { workIDs, updateBookmarkStore, removeBookmarkStore, work } from './store'
import { workID, chapterInfos, mainContent, fullViewMode } from './static'
import { activateMouseMove, deactivateMouseMove } from './mousePos'
import { BOOKMARK_LIMIT } from '@/common/variables'
import {onScroll} from './scroll'

const mainBM = reactive({chI: null, perc: null, chID: null, link: null, fwLink: null})

const bmInProgress = ref(false)
const bmFocusCountDown = ref(0)

const withinBookmarkLimit = computed(() => workIDs.value.length < BOOKMARK_LIMIT)

watch(() => work.value,
newWork => {
  if (newWork) {
    const {chI, perc, chID} = newWork
    mainBM.chI = chI
    mainBM.perc = perc
    mainBM.chID = chID
    mainBM.link = `/works/${workID}/chapters/${chID}#chapter-${parseInt(chI) + 1}`
    mainBM.fwLink = `/works/${workID}?view_full_work=true#chapter-${parseInt(chI) + 1}`
  } else {
    mainBM.chI = null
  }
  
})

const updateBookmark = (chI, perc) => {
  if (mainBM.chI != null || withinBookmarkLimit.value) {
    updateBookmarkStore(chI, perc, chapterInfos[chI].chID, chapterInfos[chI].title)
    mainBM.chI = chI
    mainBM.perc = perc
    mainBM.chID = chapterInfos[chI].chID
    mainBM.link = `/works/${workID}/chapters/${chapterInfos[chI].chID}#chapter-${parseInt(chI) + 1}`
    mainBM.fwLink = `/works/${workID}?view_full_work=true#chapter-${parseInt(chI) + 1}`
  }
}

const removeBookmark = e => {
  mainBM.chI = null
  e.stopPropagation()
  removeBookmarkStore() // delete store record
}

const stopBookmarkEdit = () => {
  mainContent.classList.toggle('bmInProgress', false)
  bmInProgress.value = false
  deactivateMouseMove()
}

const startBookmarkEdit = (e, chapters) => {
  if (mainBM.chI == null && !withinBookmarkLimit.value) {
    // console.warn(`[AO3 IPB] Reached bookmark limit! Maximum bookmark: ${BOOKMARK_LIMIT}`)
    return
  }

  mainContent.classList.toggle('bmInProgress', true)
  bmInProgress.value = true
  activateMouseMove(null, e.clientY)

  if (!chapters) return

  const chIs = Object.keys(chapters)
  const firstChI = chIs[0]
  const lastChI = chIs[chIs.length - 1]
  const {y: bmAreaFirstTop} = chapters[firstChI].dom.getBoundingClientRect()
  const {y: bmAreaLastTop, height: lastHeight} = chapters[lastChI].dom.getBoundingClientRect()

  if (bmAreaFirstTop > e.clientY) {
    window.scrollTo({
      top: window.scrollY + bmAreaFirstTop - e.clientY + 30,
      behavior: 'smooth'
    })
  } else if (e.clientY > bmAreaLastTop + lastHeight) {
    window.scrollTo({
      top: window.scrollY + bmAreaLastTop + lastHeight - e.clientY - 30,
      behavior: 'smooth'
    })
  }
}

let countDownInt = null
const jumpToBookmark = (chapters, curChI) => {
  if (!fullViewMode && mainBM.chI != curChI.value) return
      
  const {top, height} = chapters[mainBM.chI]
  const bmPos = top + height * mainBM.perc
  const targetScroll = bmPos - window.innerHeight / 2
  window.scrollTo({top: targetScroll })
  onScroll(null, targetScroll)

  bmFocusCountDown.value = true
  if (!countDownInt) clearTimeout(countDownInt)
  countDownInt = setTimeout(() => {
    bmFocusCountDown.value = false
  }, 1200)
}

export {
  mainBM, bmInProgress, bmFocusCountDown, withinBookmarkLimit,
  startBookmarkEdit, updateBookmark, removeBookmark, stopBookmarkEdit, jumpToBookmark
}
