import { ref } from "vue"
import { workID, name, author, authorURL, oneShot } from "./static"
import { updateSetting, updateSettingExtraBtn } from './setting'
import {
  DEFAULT_SETTINGS, DEFAULT_SETTING_EXTRA_BUTTONS,
  STORE_ALL_WORK_KEYS, STORE_SETTING_EXTRA_BTN_KEY, STORE_SETTING_KEY, STORE_WORK_KEY_PREFIX
} from "@/common/variables"

const STORE_WORK_KEY = STORE_WORK_KEY_PREFIX + workID

const work = ref(null)

let workIDArr = []
const workIDs = ref(workIDArr)


const initStoreData = () => {
  Promise.all([
    chrome.storage.sync.get(STORE_WORK_KEY).then(obj => obj[STORE_WORK_KEY]),
    chrome.storage.sync.get(STORE_SETTING_KEY).then(obj => obj[STORE_SETTING_KEY] || {...DEFAULT_SETTINGS}),
    chrome.storage.sync.get(STORE_SETTING_EXTRA_BTN_KEY).then(obj => obj[STORE_SETTING_EXTRA_BTN_KEY] || {...DEFAULT_SETTING_EXTRA_BUTTONS}),
    chrome.storage.sync.get(STORE_ALL_WORK_KEYS).then(obj => obj[STORE_ALL_WORK_KEYS] || [])
  ]).then(([workObj, settingObj, settingExtraBtnObj, workIDObjArr]) => {

    if (workObj) work.value = workObj
    else console.log('no bookmark in this work yet')

    updateSetting(settingObj)
    
    updateSettingExtraBtn(settingExtraBtnObj)
    console.log('work arr', workIDArr)
    workIDs.value = workIDObjArr
    workIDArr = workIDObjArr
  })

  chrome.storage.onChanged.addListener(obj => {
    if (obj[STORE_WORK_KEY]) {
      work.value = obj[STORE_WORK_KEY].newValue
      console.log('data change', obj)
    }

    if (obj[STORE_SETTING_KEY]) {
      const settingObj = obj[STORE_SETTING_KEY].newValue || {}
      updateSetting(settingObj)
      console.log('data change', obj)
    }

    if (obj[STORE_SETTING_EXTRA_BTN_KEY]) {
      const settingExtraBtnObj = obj[STORE_SETTING_EXTRA_BTN_KEY].newValue || {}
      updateSettingExtraBtn(settingExtraBtnObj)
      console.log('data change', obj)
    }

    if (obj[STORE_ALL_WORK_KEYS]) {
      workIDArr = obj[STORE_ALL_WORK_KEYS].newValue || []
      workIDs.value = workIDArr
      console.log('data change', obj)
    }
    
  })
}
initStoreData()

const updateBookmarkStore = (chI, perc, chID, chTitle) => {
  if (!workIDArr.some(wID => wID === workID)) workIDArr.push(workID)
  workIDs.value = workIDArr

  const t = Date.now()
  chrome.storage.sync.set({
    [STORE_WORK_KEY]: { authorURL, author, chI, chID, oneShot, perc, t, chTitle, name},
    [STORE_ALL_WORK_KEYS]: workIDArr
  })
}

const removeBookmarkStore = () => {
  chrome.storage.sync.remove(STORE_WORK_KEY)
  
  workIDArr = workIDArr.filter(wID => wID !== workID)
  workIDs.value = workIDArr

  chrome.storage.sync.set({[STORE_ALL_WORK_KEYS]: workIDArr})
}

export {work, workIDs, updateBookmarkStore, removeBookmarkStore}
