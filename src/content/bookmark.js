import {ref, reactive, watch} from 'vue'
import { work, updateBookmarkStore, removeBookmarkStore } from './store'
import { workId, chapterInfos } from './static'

const mainBM = reactive({chI: null, perc: null, tooClose: false, chID: null, link: null, fwLink: null})

const bmInProgress = ref(false)

watch(() => work.value,
newWork => {
  if (!newWork) {
    mainBM.chI = null
    mainBM.tooClose = false
  } else {
    const {chI, perc, chID} = newWork
    mainBM.chI = chI
    mainBM.perc = perc
    mainBM.chID = chID
    // mainBM.isOneShot = isOneShot
    mainBM.link = `/works/${workId}/chapters/${chID}#chapter-${parseInt(chI) + 1}`
    mainBM.fwLink = `/works/${workId}?view_full_work=true#chapter-${parseInt(chI) + 1}`
  }
  
})

const updateBookmark = (chI, perc) => {
  updateBookmarkStore(chI, perc, chapterInfos[chI].chID)
  mainBM.chI = chI
  mainBM.perc = perc
  mainBM.chID = chapterInfos[chI].chID
  mainBM.link = `/works/${workId}/chapters/${chapterInfos[chI].chID}#chapter-${parseInt(chI) + 1}`
  mainBM.fwLink = `/works/${workId}?view_full_work=true#chapter-${parseInt(chI) + 1}`
  mainBM.tooClose = true
}

const removeBookmark = () => {
  mainBM.chI = null
  mainBM.tooClose = false
  removeBookmarkStore() // delete store record
}

export { updateBookmark, removeBookmark, mainBM, bmInProgress }
