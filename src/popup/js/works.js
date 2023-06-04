import {reactive} from 'vue'
import { STORE_WORK_KEY_PREFIX, STORE_ALL_WORK_KEYS, AO3_DOMAIN } from '@/common/variables'
import { partialText, selection } from './search'

const works = reactive({})

// const worksGroupByAuthor = computed(() => {
//   const workGroupObj = Object.keys(works)
//     .reduce((acc, workID) => {
//       const work = works[workID]
//       if (!acc[work.author]) acc[work.author] = []

//       acc[work.author].push({workID, ...works[workID]})

//       return acc
//     }, {})

//     return Object.keys(workGroupObj)
//       .sort((a,b) => a.toLowerCase().localeCompare(b.toLowerCase()))
//       .reduce((acc, curAuthor) => {
//         acc[curAuthor] = workGroupObj[curAuthor]
//         return acc
//       }, {})
// })

const fetchSyncData = () => {
  chrome.storage.sync.get(STORE_ALL_WORK_KEYS)
    .then(obj => obj[STORE_ALL_WORK_KEYS])
    .then(workIDs => {
      if (!workIDs) return

      console.log('workIDs', workIDs)

      Promise.all(
        workIDs.map(workID => chrome.storage.sync.get(STORE_WORK_KEY_PREFIX + workID))
        // workIDs.map(workID => chrome.storage.local.get(STORE_WORK_KEY_PREFIX + workID))
      ).then(workObjs => {
        workObjs.forEach((workObj, i) => {
          const work = workObj[STORE_WORK_KEY_PREFIX + workIDs[i]]
          if (work) {
            work.workID = workIDs[i]
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
  if (selection.value) {
    console.log(selection.value, works[workID])
    if ((selection.value.type === 'work' && selection.value.val === workID) ||
      (selection.value.type === 'author' && selection.value.val === works[workID].author)) {
        selection.value = null
        partialText.value = ''
    }
  }

  delete works[workID]

  chrome.storage.sync.remove(STORE_WORK_KEY_PREFIX + workID)
  
  chrome.storage.sync.get(STORE_ALL_WORK_KEYS).then(obj => {
    const workIDs = obj[STORE_ALL_WORK_KEYS] || []
    chrome.storage.sync.set({ [STORE_ALL_WORK_KEYS]: workIDs.filter(wID => wID !== workID) })
  }).catch(err => console.warn('[AO3 IPB] Error occur on fetching all work IDs', err))
}

const removeAllWorks = () => {
  selection.value = null
  partialText.value = ''
  chrome.storage.sync.get(STORE_ALL_WORK_KEYS).then(obj => {
    const workIDs = obj[STORE_ALL_WORK_KEYS] || []

    chrome.storage.sync.remove([
      ...workIDs.map(workID => STORE_WORK_KEY_PREFIX + workID),
      STORE_ALL_WORK_KEYS
    ])

    workIDs.forEach(workID => delete works[workID])
    
    // chrome.storage.sync.set({ [STORE_ALL_WORK_KEYS]: [] })
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

export {works, removeWork, removeAllWorks, visitURL, fetchSyncData}
