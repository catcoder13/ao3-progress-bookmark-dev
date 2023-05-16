import { reactive } from "vue"
import { workId, userName } from "./static"


const STORAGE_KEY_PREFIX = 'AO3_IPB_'
const STORAGE_KEY = STORAGE_KEY_PREFIX + (userName ? 'user_' + userName : 'guest')
// get localstorage data
const localStoreRaw = JSON.parse(localStorage.getItem(STORAGE_KEY)) ||
  {works: {}} // workID -> {chI, progressValue}


const localStore = reactive(localStoreRaw)

console.log('localStore', localStore)

const updateBookmarkStore = (chI, perc, chID) => {
  if (!localStore.works[workId]) localStore.works[workId] = {}
  // update local store record
  localStore.works[workId] = { chI, perc, chID }
  console.log('update perc bm value on local storage', localStore)
  updateLocalStorage()
  // TODO: update remote store record
}

const removeBookmarkStore = () => {
  localStore.works[workId] = {}
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

export {localStore, updateBookmarkStore, removeBookmarkStore, clearLocalStorage}
