import { reactive } from "vue"
import { workId } from "./static"

const STORAGE_KEY = 'AO3_IN_PAGE_BOOKMARK'
// get localstorage data
const localStoreRaw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  bookmarks: {} // work's id -> chapter id -> {paraBM, percBM}
}

const localStore = reactive(localStoreRaw)

console.log('localStore', localStore)

const updatePercKeyValue = (chIndex, bmID, perc) => {
  if (!localStore.bookmarks[workId]) localStore.bookmarks[workId] = {}
  if (!localStore.bookmarks[workId][chIndex]) localStore.bookmarks[workId][chIndex] = {percBM: []}

  // update local store record
  localStore.bookmarks[workId][chIndex].percBM.push({id: bmID, perc: perc})
  console.log('update perc bm value on local storage', localStore)
  updateLocalStorage()
  // TODO: update remote store record
}



const removePercKeyValue = (chIndex, bmID) => {
  // delete local store record
  console.log('delete local bm, id: ', bmID)
  localStore.bookmarks[workId][chIndex].percBM = localStore.bookmarks[workId][chIndex].percBM.filter(({id}) => id !== bmID)
  updateLocalStorage()

  // TODO: delete remote store record
}

const updateLocalStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(localStore))
}

const clearLocalStorage = () => {
  localStorage.removeItem(STORAGE_KEY)
  console.log(localStorage.getItem(STORAGE_KEY))
}

export {localStore, updatePercKeyValue, removePercKeyValue, clearLocalStorage}
