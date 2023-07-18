import {
  STORE_WORK_KEY_PREFIX,
  STORE_ALL_WORK_KEYS
 } from '@/common/variables'

 import { fetchSyncData, removeAllWorks } from '@/popup/js/works'

 const importData = obj => {
  removeAllWorks(() => {
    chrome.storage.local.set(obj).then(() => {
      fetchSyncData()
    })
  })
 }
 
const downloadData = () => {
  Promise.all([
    chrome.storage.local.get(STORE_ALL_WORK_KEYS).then(obj => obj[STORE_ALL_WORK_KEYS] || [])
  ]).then(([
    workIDs
  ]) => {
    Promise.all(
      workIDs.map(workID => chrome.storage.local.get(STORE_WORK_KEY_PREFIX + workID))
    ).then(workObjs => {
      const workObjResemble = workObjs
        .filter(workObjs => workObjs)
        .reduce((acc, workObj) => {
          const workKey = Object.keys(workObj)[0]
          acc[workKey] = workObj[workKey]
          return acc
        }, {})
        
      const downloadObj = {
        [STORE_ALL_WORK_KEYS]: workIDs,
        ...workObjResemble
      }

      // download obj
      const a = document.createElement('a')
      a.href = URL.createObjectURL(new Blob([JSON.stringify(downloadObj)], { type: 'application/json' }))

      a.download = 'ao3-ao3pb-data.json'
      a.click()
      a.remove()
    })
  
  })
}

export { importData, downloadData }
