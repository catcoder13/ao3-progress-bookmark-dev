import { reactive } from "vue"
import { workId, workMode } from "./work"
import { curChI, chapters } from "./page" 

const STORAGE_KEY = 'AO3_IN_PAGE_BOOKMARK'
// get localstorage data
const localStoreRaw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  bookmarks: {} // work's id -> chapter id -> para id
}

const localStore = reactive(localStoreRaw)

if (localStore.bookmarks[workId]) {
  if (workMode) {
    Object.keys(localStore.bookmarks[workId]).forEach(cIndex => {
      const paras = chapters[cIndex].dom.querySelectorAll('.userstuff > p')
      Object.keys(localStore.bookmarks[workId][cIndex]).forEach(i => {
        paras[i].classList.add('bookmarked')
      })
    })
  } else {
    if (localStore.bookmarks[workId][curChI.value]) {
      const paras = chapters[curChI.value].dom.querySelectorAll('.userstuff > p')
      Object.keys(localStore.bookmarks[workId][curChI.value]).forEach(i => {
        paras[i].classList.add('bookmarked')
      })
    }
  }
}

console.log('localStore', localStore)

// const saveBookmark = (cIndex, elemIndex) => {
//   if (!localStore.bookmarks[workId]) localStore.bookmarks[workId] = {}
//   if (!localStore.bookmarks[workId][cIndex]) localStore.bookmarks[workId][cIndex] = {}

//   localStore.bookmarks[workId][cIndex][elemIndex] = {type: 1}
//   updateLocalStorage()
// }

const updateLocalStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(localStore))
}

const clearLocalStorage = () => {
  localStorage.removeItem(STORAGE_KEY)
  console.log(localStorage.getItem(STORAGE_KEY))
}

export {localStore, updateLocalStorage, clearLocalStorage}
