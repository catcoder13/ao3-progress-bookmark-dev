import {ref, reactive, watch} from 'vue'
import { work, updateBookmarkStore, removeBookmarkStore } from './store'
import { workID, chapterInfos, mainContent } from './static'
import { activateMouseMove, deactivateMouseMove } from './mousePos'

const mainBM = reactive({chI: null, perc: null, chID: null, link: null, fwLink: null})

const bmInProgress = ref(false)

const bmFocusCountDown = ref(0)

watch(() => work.value,
newWork => {
  if (!newWork) {
    mainBM.chI = null
  } else {
    const {chI, perc, chID} = newWork
    mainBM.chI = chI
    mainBM.perc = perc
    mainBM.chID = chID
    mainBM.link = `/works/${workID}/chapters/${chID}#chapter-${parseInt(chI) + 1}`
    mainBM.fwLink = `/works/${workID}?view_full_work=true#chapter-${parseInt(chI) + 1}`
  }
  
})

const updateBookmark = (chI, perc) => {
  updateBookmarkStore(chI, perc, chapterInfos[chI].chID, chapterInfos[chI].title)
  mainBM.chI = chI
  mainBM.perc = perc
  mainBM.chID = chapterInfos[chI].chID
  mainBM.link = `/works/${workID}/chapters/${chapterInfos[chI].chID}#chapter-${parseInt(chI) + 1}`
  mainBM.fwLink = `/works/${workID}?view_full_work=true#chapter-${parseInt(chI) + 1}`
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

export {
  mainBM, bmInProgress, bmFocusCountDown,
  startBookmarkEdit, updateBookmark, removeBookmark, stopBookmarkEdit
}
