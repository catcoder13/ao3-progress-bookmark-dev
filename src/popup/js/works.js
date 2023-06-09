import {reactive} from 'vue'
import { STORE_WORK_KEY_PREFIX, STORE_ALL_WORK_KEYS, AO3_DOMAIN } from '@/common/variables'
import { partialText, selection } from './search'

const works = reactive({})

const fetchSyncData = () => {
  chrome.storage.local.get(STORE_ALL_WORK_KEYS)
    .then(obj => obj[STORE_ALL_WORK_KEYS])
    .then(workIDs => {
      if (!workIDs) return

      Promise.all(
        workIDs.map(workID => chrome.storage.local.get(STORE_WORK_KEY_PREFIX + workID))
      ).then(workObjs => {
        const existingWorkKeys = Object.keys(works)
        existingWorkKeys.forEach(key => {
          delete works[key]
        })
        workObjs.forEach((workObj, i) => {
          const work = workObj[STORE_WORK_KEY_PREFIX + workIDs[i]]
          if (work) {
            work.workID = workIDs[i]
            works[workIDs[i]] = work
          } else {
            console.warn('[AO3 IPB]', workIDs[i], 'exist in array but bm item does not exist')
          }
    
        })
      }).catch(err => console.warn(`[AO3 IPB] Error occur on fetching works`, err))
  }).catch(err => console.warn('[AO3 IPB] Error occur on fetching all work IDs', err))
}
fetchSyncData()

const removeWork = workID => {
  if (selection.value) {
    console.log(selection.value, works[workID])
    if ((selection.value.type === 'work' && selection.value.val === workID) ||
      (selection.value.type === 'author' && selection.value.val === works[workID].author)) {
        selection.value = null
        partialText.value = ''
    }
  }

  delete works[workID]

  chrome.storage.local.remove(STORE_WORK_KEY_PREFIX + workID)
  
  chrome.storage.local.get(STORE_ALL_WORK_KEYS).then(obj => {
    const workIDs = obj[STORE_ALL_WORK_KEYS] || []
    chrome.storage.local.set({ [STORE_ALL_WORK_KEYS]: workIDs.filter(wID => wID !== workID) })
  }).catch(err => console.warn('[AO3 IPB] Error occur on fetching all work IDs', err))
}

const removeAllWorks = () => {
  selection.value = null
  partialText.value = ''
  chrome.storage.local.get(STORE_ALL_WORK_KEYS).then(obj => {
    const workIDs = obj[STORE_ALL_WORK_KEYS] || []

    chrome.storage.local.remove([
      ...workIDs.map(workID => STORE_WORK_KEY_PREFIX + workID),
      STORE_ALL_WORK_KEYS
    ])

    workIDs.forEach(workID => delete works[workID])
    
    // chrome.storage.local.set({ [STORE_ALL_WORK_KEYS]: [] })
  }).catch(err => console.warn('[AO3 IPB] Error occur on fetching all work IDs', err))
}

const visitURL = subURL => {
  chrome.runtime.sendMessage(
    {type: 'tab', url: AO3_DOMAIN + subURL},
    // res => {
    //   console.log(res)
    // }
  )
}

export {works, removeWork, removeAllWorks, visitURL, fetchSyncData}
