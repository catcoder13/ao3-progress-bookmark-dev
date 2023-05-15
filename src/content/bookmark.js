import {reactive} from 'vue'
import { updateBookmarkStore, removeBookmarkStore } from './store'

const mainBM = reactive({chI: null, perc: null, tooClose: false})

const updateBookmark = (chI, perc) => {
  updateBookmarkStore(chI, perc)
  mainBM.chI = chI
  mainBM.perc = perc
  mainBM.tooClose = true
}

const removeBookmark = () => {
  mainBM.chI = null
  mainBM.perc = null
  mainBM.tooClose = false
  removeBookmarkStore() // delete store record
}

export {updateBookmark, removeBookmark, mainBM}
