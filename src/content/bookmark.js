import {ref, reactive, watch} from 'vue'
import { work, updateBookmarkStore, removeBookmarkStore } from './store'
import { workId, chapterInfos, mainContent } from './static'
import { activateMouseMove, deactivateMouseMove } from './mousePos'

const mainBM = reactive({chI: null, perc: null, chID: null, link: null, fwLink: null})

const bmInProgress = ref(false)

watch(() => work.value,
newWork => {
  if (!newWork) {
    mainBM.chI = null
  } else {
    const {chI, perc, chID} = newWork
    mainBM.chI = chI
    mainBM.perc = perc
    mainBM.chID = chID
    mainBM.link = `/works/${workId}/chapters/${chID}#chapter-${parseInt(chI) + 1}`
    mainBM.fwLink = `/works/${workId}?view_full_work=true#chapter-${parseInt(chI) + 1}`
  }
  
})

const updateBookmark = (chI, perc) => {
  updateBookmarkStore(chI, perc, chapterInfos[chI].chID, chapterInfos[chI].title)
  mainBM.chI = chI
  mainBM.perc = perc
  mainBM.chID = chapterInfos[chI].chID
  mainBM.link = `/works/${workId}/chapters/${chapterInfos[chI].chID}#chapter-${parseInt(chI) + 1}`
  mainBM.fwLink = `/works/${workId}?view_full_work=true#chapter-${parseInt(chI) + 1}`
}

const removeBookmark = () => {
  mainBM.chI = null
  removeBookmarkStore() // delete store record
}

const onBookmarkEnd = () => {
  mainContent.classList.toggle('bmInProgress', false)
  bmInProgress.value = false
  deactivateMouseMove()
}

const toggleBookmarkEdit = (e, chapters) => {
  bmInProgress.value = !bmInProgress.value
  if (bmInProgress.value) activateMouseMove(null, e.clientY)
  else deactivateMouseMove()

  mainContent.classList.toggle('bmInProgress', bmInProgress.value)
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
  mainBM, bmInProgress,
  toggleBookmarkEdit, updateBookmark, removeBookmark, onBookmarkEnd
}
