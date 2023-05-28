import { ref } from "vue"
import { workId, workName, authorName, authorLink, isOneShot } from "./static"
import { updateSetting, updateSettingExtraBtn } from './setting'
import { STORE_ALL_WORK_KEYS, STORE_SETTING_EXTRA_BTN_KEY, STORE_SETTING_KEY, STORE_WORK_KEY_PREFIX } from "@/common/variables"

const STORE_WORK_KEY = STORE_WORK_KEY_PREFIX + workId

const work = ref(null)

const initStoreData = () => {
  Promise.all([
    chrome.storage.sync.get(STORE_WORK_KEY).then(obj => obj[STORE_WORK_KEY]),
    chrome.storage.sync.get(STORE_SETTING_KEY).then(obj => obj[STORE_SETTING_KEY]),
    chrome.storage.sync.get(STORE_SETTING_EXTRA_BTN_KEY).then(obj => obj[STORE_SETTING_EXTRA_BTN_KEY])
    // chrome.storage.local.get(STORE_WORK_KEY),
    // chrome.storage.local.get(STORE_SETTING_KEY)
  ]).then(([workObj, settingObj, settingExtraBtnObj]) => {

    if (workObj) work.value = workObj
    else console.log('no bookmark in this work yet')

    if (settingObj) updateSetting(settingObj)
    
    if (settingExtraBtnObj) updateSettingExtraBtn(settingExtraBtnObj)
  })

  chrome.storage.onChanged.addListener(obj => {
    console.log('data change', obj)
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
    
  })
}
initStoreData()

const updateBookmarkStore = (chI, perc, chID, chTitle) => {
  chrome.storage.sync.get(STORE_ALL_WORK_KEYS).then(allKeys => {
  // chrome.storage.local.get(STORE_ALL_WORK_KEYS).then(allKeys => {
    let allWorkKeys = allKeys[STORE_ALL_WORK_KEYS] || []
    if (!allWorkKeys.some(wID => wID === workId)) allWorkKeys.push(workId)
    const t = Date.now()
    chrome.storage.sync.set({
    // chrome.storage.local.set({
      [STORE_WORK_KEY]: { authorLink, authorName, chI, chID, isOneShot, perc, t, chTitle, workName},
      [STORE_ALL_WORK_KEYS]: allWorkKeys
    })
  })
}

const removeBookmarkStore = () => {
  chrome.storage.sync.remove(STORE_WORK_KEY)
  // chrome.storage.local.remove(STORE_WORK_KEY)

  chrome.storage.sync.get(STORE_ALL_WORK_KEYS).then(allKeys => {
  // chrome.storage.local.get(STORE_ALL_WORK_KEYS).then(allKeys => {
    const allWorkKeys = allKeys[STORE_ALL_WORK_KEYS] || []
    chrome.storage.sync.set({[STORE_ALL_WORK_KEYS]: allWorkKeys.filter(wID => wID !== workId)})
    // chrome.storage.local.set({[STORE_ALL_WORK_KEYS]: allWorkKeys.filter(wID => wID !== workId)})
  })
}

export {work, updateBookmarkStore, removeBookmarkStore}
