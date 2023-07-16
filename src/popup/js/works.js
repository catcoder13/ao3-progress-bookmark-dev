import {reactive} from 'vue'
import { STORE_WORK_KEY_PREFIX, STORE_ALL_WORK_KEYS, AO3_DOMAIN, STORE_SETTING_POPUP_KEY } from '@/common/variables'

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
            work.id = workIDs[i]
            works[workIDs[i]] = work
          } else {
            console.warn('[AO3 IPB]', workIDs[i], 'exist in array but bm item does not exist')
          }
    
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
      if (obj[STORE_WORK_KEY_PREFIX + key].newValue) { // this is changed work
        const newWork = obj[STORE_WORK_KEY_PREFIX + key].newValue
        works[key] = {...newWork, id: key}
        // console.log('work change', key)
      } else { // this is a removed work
        delete works[key]
        // console.log('remove work', key)
      }
    })

  // handle new work
  if (obj[STORE_ALL_WORK_KEYS]) {
    const workIDArr = obj[STORE_ALL_WORK_KEYS].newValue || []
    
    workIDArr
      .filter(key => !existingWorkKeys.includes(key))
      .forEach(key => {
        chrome.storage.local.get(STORE_WORK_KEY_PREFIX + key).then(workObj => {
          const work = workObj[STORE_WORK_KEY_PREFIX + key]
          work.id = key
          works[key] = work
          // console.log('new bookmark added into popup', key)
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
