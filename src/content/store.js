import { ref } from "vue"
import { workId, workName, authorName, authorLink, isOneShot } from "./static"

const STORE_WORK_KEY = `AO3_IPB_WORK_${workId}`
const STORE_ALL_WORK_KEYS = `AO3_IPB_ALL_WORK_KEYS`

const work = ref(null)
let allWorkKeys = []

const initStoreData = () => {
  Promise.all([
    chrome.storage.local.get(STORE_WORK_KEY),
    chrome.storage.local.get(STORE_ALL_WORK_KEYS)
  ]).then(([workObj, allKeys ]) => {
    if (workObj[STORE_WORK_KEY]) work.value = workObj[STORE_WORK_KEY]
    else console.log('no bookmark in this work yet')

    allWorkKeys = allKeys[STORE_ALL_WORK_KEYS] ? allKeys[STORE_ALL_WORK_KEYS] : []
    console.log('work loaded', work.value)
    console.log('all key loaded', allWorkKeys)
  })

  chrome.storage.onChanged.addListener(obj => {
    console.log('data change', obj)
    work.value = obj[STORE_WORK_KEY] && obj[STORE_WORK_KEY].newValue
  })
}
initStoreData()

const updateBookmarkStore = (chI, perc, chID) => {
  if (!allWorkKeys.some(wID => wID === workId)) allWorkKeys.push(workId)

  chrome.storage.local.set({
    [STORE_WORK_KEY]: { chI, perc, chID, workName, authorName, authorLink, isOneShot },
    [STORE_ALL_WORK_KEYS]: allWorkKeys
  })

  // if (!allWorkKeys.some(wID => wID === workId)) allWorkKeys.push(workId)
  // chrome.storage.local.set({[STORE_ALL_WORK_KEYS]: allWorkKeys})
}

const removeBookmarkStore = () => {
  chrome.storage.local.remove(STORE_WORK_KEY)

  allWorkKeys = allWorkKeys.filter(wID => wID !== workId)
  chrome.storage.local.set({[STORE_ALL_WORK_KEYS]: allWorkKeys})
}

export {work, updateBookmarkStore, removeBookmarkStore}
