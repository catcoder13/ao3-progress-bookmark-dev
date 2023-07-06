import {
  // STORE_SETTING_KEY,
  // STORE_SETTING_EXTRA_BTN_KEY,
  STORE_WORK_KEY_PREFIX,
  STORE_ALL_WORK_KEYS
 } from '@/common/variables'

 import { fetchSyncData } from '@/popup/js/works'

 const importData = obj => {
  chrome.storage.local.set(obj).then(() => {
    fetchSyncData()
  })
 }
 
const downloadData = () => {
  Promise.all([
    // chrome.storage.local.get(STORE_SETTING_KEY).then(obj => obj[STORE_SETTING_KEY] || {}),
    // chrome.storage.local.get(STORE_SETTING_EXTRA_BTN_KEY).then(obj => obj[STORE_SETTING_EXTRA_BTN_KEY] || {}),
    chrome.storage.local.get(STORE_ALL_WORK_KEYS).then(obj => obj[STORE_ALL_WORK_KEYS] || [])
  ]).then(([
    // settingObj, settingExtraBtnObj,
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
        // [STORE_SETTING_KEY]: settingObj,
        // [STORE_SETTING_EXTRA_BTN_KEY]: settingExtraBtnObj,
        [STORE_ALL_WORK_KEYS]: workIDs,
        ...workObjResemble
      }

      // download obj
      const a = document.createElement('a')
      a.href = URL.createObjectURL(new Blob([JSON.stringify(downloadObj)], { type: 'application/json' }))

      a.download = 'ao3-ipb-data.json'
      a.click()
      a.remove()
    })
  
  })
}

export { importData, downloadData }
