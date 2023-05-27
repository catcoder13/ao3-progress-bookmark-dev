import {reactive, computed} from 'vue'
import { STORE_WORK_KEY_PREFIX, STORE_ALL_WORK_KEYS } from '@/common/variables'

const AO3_DOMAIN = "https://archiveofourown.org"

const works = reactive({})

const worksGroupByAuthor = computed(() => {
  const workGroupObj = Object.keys(works)
    .reduce((acc, workID) => {
      const work = works[workID]
      if (!acc[work.authorName]) acc[work.authorName] = []

      acc[work.authorName].push({workID, ...works[workID]})

      return acc
    }, {})

    return Object.keys(workGroupObj)
      .sort((a,b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      .reduce((acc, curAuthor) => {
        acc[curAuthor] = workGroupObj[curAuthor]
        return acc
      }, {})
})
let workIDs = []

chrome.storage.sync.get(STORE_ALL_WORK_KEYS).then(wIDObj => {
// chrome.storage.local.get(STORE_ALL_WORK_KEYS).then(wIDObj => {
  workIDs = wIDObj[STORE_ALL_WORK_KEYS]
  if (!workIDs) return

  Promise.all(
    workIDs.map(workID => chrome.storage.sync.get(STORE_WORK_KEY_PREFIX + workID))
    // workIDs.map(workID => chrome.storage.local.get(STORE_WORK_KEY_PREFIX + workID))
  ).then(workObjs => {
    workObjs.forEach((workObj, i) => {
      const work = workObj[STORE_WORK_KEY_PREFIX + workIDs[i]]
      if (work) {
        works[workIDs[i]] = work
      } else {
        console.log(workIDs[i], 'object not found')
      }

    })
  })
})

const removeWork = workID => {
  chrome.storage.sync.remove(STORE_WORK_KEY_PREFIX + workID)
  // chrome.storage.local.remove(STORE_WORK_KEY_PREFIX + workID)
  chrome.storage.sync.set({
  // chrome.storage.local.set({
    [STORE_ALL_WORK_KEYS]: workIDs.filter(wID => wID !== workID)
  })
  delete works[workID]
}

const visitURL = subURL => {
  chrome.runtime.sendMessage(
    {type: 'tab', url: AO3_DOMAIN + subURL},
    res => {
      console.log(res)
    }
  )
}

const clearChromeStorage = () => {
  chrome.storage.sync.clear()
  // chrome.storage.local.clear()
}

export {works, worksGroupByAuthor, removeWork, visitURL, clearChromeStorage}
