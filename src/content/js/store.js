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
    chrome.storage.local.get(STORE_WORK_KEY).then(obj => obj[STORE_WORK_KEY]),
    chrome.storage.local.get(STORE_SETTING_KEY).then(obj => obj[STORE_SETTING_KEY] || {...DEFAULT_SETTINGS}),
    chrome.storage.local.get(STORE_SETTING_EXTRA_BTN_KEY).then(obj => obj[STORE_SETTING_EXTRA_BTN_KEY] || {...DEFAULT_SETTING_EXTRA_BUTTONS}),
    chrome.storage.local.get(STORE_ALL_WORK_KEYS).then(obj => obj[STORE_ALL_WORK_KEYS] || [])
  ]).then(([workObj, settingObj, settingExtraBtnObj, workIDObjArr]) => {

    if (workObj) work.value = workObj

    updateSetting(settingObj)
    
    updateSettingExtraBtn(settingExtraBtnObj)
    
    workIDs.value = workIDObjArr
    workIDArr = workIDObjArr
  })

  chrome.storage.onChanged.addListener(obj => {
    if (obj[STORE_WORK_KEY]) {
      work.value = obj[STORE_WORK_KEY].newValue
    }

    if (obj[STORE_SETTING_KEY]) {
      const settingObj = obj[STORE_SETTING_KEY].newValue || {}
      updateSetting(settingObj)
    }

    if (obj[STORE_SETTING_EXTRA_BTN_KEY]) {
      const settingExtraBtnObj = obj[STORE_SETTING_EXTRA_BTN_KEY].newValue || {}
      updateSettingExtraBtn(settingExtraBtnObj)
    }

    if (obj[STORE_ALL_WORK_KEYS]) {
      workIDArr = obj[STORE_ALL_WORK_KEYS].newValue || []
      workIDs.value = workIDArr
    }
    
  })
}
initStoreData()

const updateBookmarkStore = (chI, perc, chID, chTitle) => {
  if (!workIDArr.some(wID => wID === workID)) workIDArr.push(workID)
  workIDs.value = workIDArr

  const t = Date.now()
  chrome.storage.local.set({
    [STORE_WORK_KEY]: { authorURL, author, chI, chID, oneShot, perc, t, chTitle, name},
    [STORE_ALL_WORK_KEYS]: workIDArr
  })
}

const removeBookmarkStore = () => {
  chrome.storage.local.remove(STORE_WORK_KEY)
  
  workIDArr = workIDArr.filter(wID => wID !== workID)
  workIDs.value = workIDArr

  chrome.storage.local.set({[STORE_ALL_WORK_KEYS]: workIDArr})
}

export {work, workIDs, updateBookmarkStore, removeBookmarkStore}
