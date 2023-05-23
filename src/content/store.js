import { ref } from "vue"
import { workId, workName, authorName, authorLink, isOneShot } from "./static"

const STORE_WORK_KEY = `AO3_IPB_WORK_${workId}`
const STORE_ALL_WORK_KEYS = `AO3_IPB_ALL_WORK_KEYS`

const work = ref(null)

const initStoreData = () => {
  chrome.storage.local.get(STORE_WORK_KEY).then(workObj => {
    if (workObj[STORE_WORK_KEY]) work.value = workObj[STORE_WORK_KEY]
    else console.log('no bookmark in this work yet')
    
    console.log('work loaded', work.value)
  })

  chrome.storage.onChanged.addListener(obj => {
    console.log('data change', obj)
    if (obj[STORE_WORK_KEY]) {
      work.value = obj[STORE_WORK_KEY].newValue
    }
    
  })
}
initStoreData()

const updateBookmarkStore = (chI, perc, chID, chTitle) => {
  chrome.storage.local.get(STORE_ALL_WORK_KEYS).then(allKeys => {
    let allWorkKeys = allKeys[STORE_ALL_WORK_KEYS] || []
    if (!allWorkKeys.some(wID => wID === workId)) allWorkKeys.push(workId)
    const t = Date.now()
    chrome.storage.local.set({
      [STORE_WORK_KEY]: { authorLink, authorName, chI, chID, isOneShot, perc, t, chTitle, workName},
      [STORE_ALL_WORK_KEYS]: allWorkKeys
    })
  })
}

const removeBookmarkStore = () => {
  chrome.storage.local.remove(STORE_WORK_KEY)

  chrome.storage.local.get(STORE_ALL_WORK_KEYS).then(allKeys => {
    const allWorkKeys = allKeys[STORE_ALL_WORK_KEYS] || []
    chrome.storage.local.set({[STORE_ALL_WORK_KEYS]: allWorkKeys.filter(wID => wID !== workId)})
  })
}

export {work, updateBookmarkStore, removeBookmarkStore}
