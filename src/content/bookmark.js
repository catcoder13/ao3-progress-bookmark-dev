import {reactive} from 'vue'
import { updateBookmarkStore, removeBookmarkStore } from './store'
import { workId, chapterInfos } from './static'
const mainBM = reactive({chI: null, perc: null, tooClose: false, chID: null, link: null, fwLink: null})

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
  // mainBM.perc = null
  mainBM.tooClose = false
  removeBookmarkStore() // delete store record
}

export {updateBookmark, removeBookmark, mainBM}
