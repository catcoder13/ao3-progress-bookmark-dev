import { reactive } from "vue"
import { workId } from "./work"

const STORAGE_KEY = 'AO3_IN_PAGE_BOOKMARK'
// get localstorage data
const localStoreRaw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  bookmarks: {} // work's id -> chapter id -> {paraBM, percBM}
}

const localStore = reactive(localStoreRaw)

console.log('localStore', localStore)

const updatePercKeyValue = (chIndex, bmLocation) => {
  if (!localStore.bookmarks[workId]) localStore.bookmarks[workId] = {}
  if (!localStore.bookmarks[workId][chIndex]) localStore.bookmarks[workId][chIndex] = {
    paraBM: {},
    percBM: []
  }

  const percBMLength = localStore.bookmarks[workId][chIndex].percBM.length
  localStore.bookmarks[workId][chIndex].percBM.push({id: percBMLength, perc: bmLocation})

  localStorage.setItem(STORAGE_KEY, JSON.stringify(localStore))
}

const updateParaKeyValue = (chIndex, bmLocation) => {
  if (!localStore.bookmarks[workId]) localStore.bookmarks[workId] = {}
  if (!localStore.bookmarks[workId][chIndex]) localStore.bookmarks[workId][chIndex] = {
    paraBM: {},
    percBM: []
  }

  localStore.bookmarks[workId][chIndex].paraBM[bmLocation] = 1

  localStorage.setItem(STORAGE_KEY, JSON.stringify(localStore))
}

// const updateLocalStorage = () => {


//   localStorage.setItem(STORAGE_KEY, JSON.stringify(localStore))
// }

const clearLocalStorage = () => {
  localStorage.removeItem(STORAGE_KEY)
  console.log(localStorage.getItem(STORAGE_KEY))
}

export {localStore, updatePercKeyValue, updateParaKeyValue, clearLocalStorage}
