import {reactive} from 'vue'

const STORE_WORK_KEY_PREFIX = `AO3_IPB_WORK_`
const STORE_ALL_WORK_KEYS = `AO3_IPB_ALL_WORK_KEYS`

const works = reactive({})
let workIDs = []

chrome.storage.local.get(STORE_ALL_WORK_KEYS).then(wIDObj => {
  workIDs = wIDObj[STORE_ALL_WORK_KEYS]
  if (!workIDs) return

  Promise.all(
    workIDs.map(workID => chrome.storage.local.get(STORE_WORK_KEY_PREFIX + workID))
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
  chrome.storage.local.remove(STORE_WORK_KEY_PREFIX + workID)
  chrome.storage.local.set({
    [STORE_ALL_WORK_KEYS]: workIDs.filter(wID => wID !== workID)
  })
  delete works[workID]
}

const clearChromeStorage = () => {
  chrome.storage.local.clear()
}

export {works, removeWork, clearChromeStorage}
