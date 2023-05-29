import { ref } from "vue"
import { workID, name, author, authorURL, oneShot } from "./static"
import { updateSetting, updateSettingExtraBtn } from './setting'
import { DEFAULT_SETTINGS, DEFAULT_SETTING_EXTRA_BUTTONS, STORE_ALL_WORK_KEYS, STORE_SETTING_EXTRA_BTN_KEY, STORE_SETTING_KEY, STORE_WORK_KEY_PREFIX } from "@/common/variables"

const STORE_WORK_KEY = STORE_WORK_KEY_PREFIX + workID

const work = ref(null)

const initStoreData = () => {
  Promise.all([
    chrome.storage.sync.get(STORE_WORK_KEY).then(obj => obj[STORE_WORK_KEY]),
    chrome.storage.sync.get(STORE_SETTING_KEY).then(obj => obj[STORE_SETTING_KEY] || {...DEFAULT_SETTINGS}),
    chrome.storage.sync.get(STORE_SETTING_EXTRA_BTN_KEY).then(obj => obj[STORE_SETTING_EXTRA_BTN_KEY] || {...DEFAULT_SETTING_EXTRA_BUTTONS})
  ]).then(([workObj, settingObj, settingExtraBtnObj]) => {

    if (workObj) work.value = workObj
    else console.log('no bookmark in this work yet')

    updateSetting(settingObj)
    
    updateSettingExtraBtn(settingExtraBtnObj)
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
    if (!allWorkKeys.some(wID => wID === workID)) allWorkKeys.push(workID)
    const t = Date.now()
    chrome.storage.sync.set({
    // chrome.storage.local.set({
      [STORE_WORK_KEY]: { authorURL, author, chI, chID, oneShot, perc, t, chTitle, name},
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
    chrome.storage.sync.set({[STORE_ALL_WORK_KEYS]: allWorkKeys.filter(wID => wID !== workID)})
    // chrome.storage.local.set({[STORE_ALL_WORK_KEYS]: allWorkKeys.filter(wID => wID !== workID)})
  })
}

export {work, updateBookmarkStore, removeBookmarkStore}
