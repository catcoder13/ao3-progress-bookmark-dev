import {reactive} from 'vue'
import { STORE_WORK_KEY_PREFIX, STORE_ALL_WORK_KEYS, AO3_DOMAIN } from '@/common/variables'

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
          if (work) works[workIDs[i]] = {...work, id: workIDs[i]}
          else console.warn('[AO3 IPB]', workIDs[i], 'exist in array but bm item does not exist')
    
        })
      }).catch(err => console.warn(`[AO3 IPB] Error occur on fetching works`, err))
  }).catch(err => console.warn('[AO3 IPB] Error occur on fetching all work IDs', err))
}
fetchSyncData()

chrome.storage.onChanged.addListener(obj => {
  const existingWorkKeys = Object.keys(works)

  // handle changed work and removed work
  existingWorkKeys
    .filter(key => obj[STORE_WORK_KEY_PREFIX + key])
    .forEach(key => {
      const newWork = obj[STORE_WORK_KEY_PREFIX + key].newValue
      if (newWork) works[key] = {...newWork, id: key} // this is changed work
      else delete works[key] // this is a removed work
    })

  // handle new work
  if (obj[STORE_ALL_WORK_KEYS]) {
    const workIDArr = obj[STORE_ALL_WORK_KEYS].newValue || []
    
    workIDArr
      .filter(key => !existingWorkKeys.includes(key))
      .forEach(key => {
        chrome.storage.local.get(STORE_WORK_KEY_PREFIX + key).then(workObj => {
          const work = workObj[STORE_WORK_KEY_PREFIX + key]
          works[key] = {...work, id: key}
        })
      })
  }
  
  // console.log(obj)
})

const removeWork = workID => {
  delete works[workID]

  chrome.storage.local.remove(STORE_WORK_KEY_PREFIX + workID)
  
  chrome.storage.local.get(STORE_ALL_WORK_KEYS).then(obj => {
    const workIDs = obj[STORE_ALL_WORK_KEYS] || []
    chrome.storage.local.set({ [STORE_ALL_WORK_KEYS]: workIDs.filter(wID => wID !== workID) })
  }).catch(err => console.warn('[AO3 IPB] Error occur on fetching all work IDs', err))
}

const removeAllWorks = cb => {
  chrome.storage.local.get(STORE_ALL_WORK_KEYS).then(obj => {
    const workIDs = obj[STORE_ALL_WORK_KEYS] || []

    chrome.storage.local.remove([
      ...workIDs.map(workID => STORE_WORK_KEY_PREFIX + workID),
      STORE_ALL_WORK_KEYS
    ]).then(res => {
      // console.log('removed complete in store', res)
      workIDs.forEach(workID => delete works[workID])

      if (cb) cb()
    })
    
  }).catch(err => console.warn('[AO3 IPB] Error occur on fetching all work IDs', err))
}

const visitURL = subURL => {
  chrome.tabs.create({ url: AO3_DOMAIN + subURL }, () => {
    window.close()
  })
}

export {works, removeWork, removeAllWorks, visitURL, fetchSyncData}
