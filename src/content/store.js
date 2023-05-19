import { reactive } from "vue"
import { workId, workName, userName, authorName, authorLink, isOneShot } from "./static"


const STORAGE_KEY_PREFIX = 'AO3_IPB_'
const STORAGE_KEY = STORAGE_KEY_PREFIX + (userName ? 'user_' + userName : 'guest')
// get localstorage data
const storeRaw = JSON.parse(localStorage.getItem(STORAGE_KEY)) ||
  {works: {}} // workID -> {chI, progressValue}


const store = reactive(storeRaw)

console.log('store', store)

const updateBookmarkStore = (chI, perc, chID) => {
  if (!store.works[workId]) store.works[workId] = {}
  // update local store record
  store.works[workId] = { chI, perc, chID, workName, authorName, authorLink, isOneShot }
  console.log('update perc bm value on local storage', store)
  updateLocalStorage()
  // TODO: update remote store record
}

const removeBookmarkStore = () => {
  // store.works[workId] = {}
  delete store.works[workId]
  updateLocalStorage()

  // TODO: delete remote store record
}

const removeBookmarkStoreByWorkID = wID => {
  // store.works[wID] = {}
  delete store.works[wID]
  console.log('remove by wID', store.works)
  updateLocalStorage()
}

const updateLocalStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  console.log('localstorage updated', JSON.parse(localStorage.getItem(STORAGE_KEY)))
}

const clearLocalStorage = () => {
  localStorage.removeItem(STORAGE_KEY)
  console.log(localStorage.getItem(STORAGE_KEY))
}

export {store, updateBookmarkStore, removeBookmarkStore, removeBookmarkStoreByWorkID, clearLocalStorage}
