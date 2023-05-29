import {reactive, computed} from 'vue'
import { STORE_WORK_KEY_PREFIX, STORE_ALL_WORK_KEYS, AO3_DOMAIN } from '@/common/variables'

const works = reactive({})

const worksGroupByAuthor = computed(() => {
  const workGroupObj = Object.keys(works)
    .reduce((acc, workID) => {
      const work = works[workID]
      if (!acc[work.author]) acc[work.author] = []

      acc[work.author].push({workID, ...works[workID]})

      return acc
    }, {})

    return Object.keys(workGroupObj)
      .sort((a,b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      .reduce((acc, curAuthor) => {
        acc[curAuthor] = workGroupObj[curAuthor]
        return acc
      }, {})
})

const fetchSyncData = () => {
  chrome.storage.sync.get(STORE_ALL_WORK_KEYS).then(wIDObj => {
    // chrome.storage.local.get(STORE_ALL_WORK_KEYS).then(wIDObj => {
    const workIDs = wIDObj[STORE_ALL_WORK_KEYS]
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
    }).catch(err => console.warn(`[AO3 IPB] Error occur on fetching works`, err))
  }).catch(err => console.warn('[AO3 IPB] Error occur on fetching all work IDs', err))
}
fetchSyncData()

const removeWork = workID => {
  chrome.storage.sync.remove(STORE_WORK_KEY_PREFIX + workID)
  delete works[workID]

  chrome.storage.sync.get(STORE_ALL_WORK_KEYS).then(obj => {
    const workIDs = obj[STORE_ALL_WORK_KEYS] || []
    chrome.storage.sync.set({ [STORE_ALL_WORK_KEYS]: workIDs.filter(wID => wID !== workID) })
  }).catch(err => console.warn('[AO3 IPB] Error occur on fetching all work IDs', err))
}

const removeAllWorks = () => {
  chrome.storage.sync.get(STORE_ALL_WORK_KEYS).then(obj => {
    const workIDs = obj[STORE_ALL_WORK_KEYS] || []

    workIDs.forEach(workID => {
      chrome.storage.sync.remove(STORE_WORK_KEY_PREFIX + workID)
      delete works[workID]
    })
    chrome.storage.sync.set({ [STORE_ALL_WORK_KEYS]: [] })
  }).catch(err => console.warn('[AO3 IPB] Error occur on fetching all work IDs', err))
}

const visitURL = subURL => {
  chrome.runtime.sendMessage(
    {type: 'tab', url: AO3_DOMAIN + subURL},
    res => {
      console.log(res)
    }
  )
}

export {works, worksGroupByAuthor, removeWork, removeAllWorks, visitURL, fetchSyncData}
