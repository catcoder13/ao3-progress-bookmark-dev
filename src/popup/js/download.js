import {
  STORE_SETTING_KEY,
  STORE_SETTING_EXTRA_BTN_KEY,
  STORE_WORK_KEY_PREFIX,
  STORE_ALL_WORK_KEYS
 } from '@/common/variables'

 const onImportData = () => {

 }
 
const onDownloadData = () => {
  Promise.all([
    chrome.storage.sync.get(STORE_SETTING_KEY).then(obj => obj[STORE_SETTING_KEY] || {}),
    chrome.storage.sync.get(STORE_SETTING_EXTRA_BTN_KEY).then(obj => obj[STORE_SETTING_EXTRA_BTN_KEY] || {}),
    chrome.storage.sync.get(STORE_ALL_WORK_KEYS).then(obj => obj[STORE_ALL_WORK_KEYS] || [])
  ]).then(([settingObj, settingExtraBtnObj, workIDs]) => {
    Promise.all(
      workIDs.map(workID => chrome.storage.sync.get(STORE_WORK_KEY_PREFIX + workID))
    ).then(workObjs => {
      const workObjResemble = workObjs
        .filter(workObjs => workObjs)
        .reduce((acc, workObj) => {
          const workKey = Object.keys(workObj)[0]
          acc[workKey] = workObj[workKey]
          return acc
        }, {})
      // console.log(workObjResemble)
      const downloadObj = {
        STORE_SETTING_KEY: settingObj,
        STORE_SETTING_EXTRA_BTN_KEY: settingExtraBtnObj,
        STORE_ALL_WORK_KEYS: workIDs,
        ...workObjResemble
      }

      console.log(downloadObj)

      // download obj
      const name = 'ao3-ipb-data.json'
      const text = JSON.stringify(downloadObj)
      const a = document.createElement('a')
      const type = name.split('.').pop()
      a.href = URL.createObjectURL(new Blob([text], {
        type: `text/${type === 'txt' ? 'plain' : type }`
      }))

      a.download = name
      a.click()
      a.remove()
    })
  
  })
}

const onDeleteAllData = () => {
  chrome.storage.sync.clear()
}

export { onImportData, onDownloadData, onDeleteAllData }
