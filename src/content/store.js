import { reactive } from "vue"
import { workId, workMode } from "./work"
import { curChI, mainContent } from "./page" 
// import {c}
const STORAGE_KEY = 'AO3_IN_PAGE_BOOKMARK'

// get localstorage data
const localStoreRaw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  bookmarks: { [workId]: {} } // work's id -> chapter id -> para id
}
const localStore = reactive(localStoreRaw)

if (localStore.bookmarks[workId]) {
  if (workMode) {
    Object.keys(localStore.bookmarks[workId]).forEach(cIndex => {
      Object.keys(localStore.bookmarks[workId][cIndex]).forEach(itemID => {
        const {elem, type} = localStore.bookmarks[workId][cIndex][itemID]
        const bmElement = document.createElement('span')
        bmElement.classList.add('bookmarkIcon')
        elem.appendChild(bmElement)
      })
    })
  } else {
    console.log('chapter index', curChI.value)
    if (localStore.bookmarks[workId][curChI.value]) {
      const paras = mainContent.querySelectorAll(`#chapter-${curChI.value + 1} [role=article] > p`)
      Object.keys(localStore.bookmarks[workId][curChI.value]).forEach(itemID => {
        const {elem, type} = localStore.bookmarks[workId][curChI.value][itemID]
        console.log('elem', elem)
        const bmElement = document.createElement('span')
        bmElement.classList.add('bookmarkIcon')
        paras[itemID].appendChild(bmElement)
        // elem.appendChild(bmElement)
        // console.log('bound', elem.getBoundingClientRect())
      })
    }
    
  }
}

console.log('localStore', localStore)

const saveBookmark = (cIndex, elemIndex, elem) => {
  if (!localStore.bookmarks[workId][cIndex]) localStore.bookmarks[workId][cIndex] = {}

  localStore.bookmarks[workId][cIndex][elemIndex] = {elem, type: 1}
  updateLocalStorage()
}

const updateLocalStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(localStore))
}

const clearLocalStorage = () => {
  localStorage.removeItem(STORAGE_KEY)
  console.log(localStorage.getItem(STORAGE_KEY))
}

export {saveBookmark, clearLocalStorage}
