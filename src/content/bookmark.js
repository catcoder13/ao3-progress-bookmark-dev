import {reactive} from 'vue'
import { updateBookmarkStore, removeBookmarkStore } from './store'
import { workId } from './static'
const mainBM = reactive({chI: null, perc: null, tooClose: false, chID: null, link: null, fwLink: null})

const updateBookmark = (chI, perc, chID) => {
  updateBookmarkStore(chI, perc, chID)
  mainBM.chI = chI
  mainBM.perc = perc
  mainBM.chID = chID
  mainBM.link = `/works/${workId}/chapters/${chID}`
  mainBM.fwLink = `/works/${workId}?view_full_work=true#chapter-${parseInt(chI) + 1}`
  mainBM.tooClose = true
}

const removeBookmark = () => {
  mainBM.chI = null
  mainBM.perc = null
  mainBM.tooClose = false
  removeBookmarkStore() // delete store record
}

export {updateBookmark, removeBookmark, mainBM}
