import { reactive, watch } from "vue"
import {
  STORE_SETTING_KEY, DEFAULT_SETTINGS,
  STORE_SETTING_EXTRA_BTN_KEY, DEFAULT_SETTING_EXTRA_BUTTONS
} from "@/common/variables"

const settings = reactive(DEFAULT_SETTINGS)
const settingExtraBtn = reactive(DEFAULT_SETTING_EXTRA_BUTTONS)

Promise.all([
  chrome.storage.sync.get(STORE_SETTING_KEY).then(obj => obj[STORE_SETTING_KEY]),
  chrome.storage.sync.get(STORE_SETTING_EXTRA_BTN_KEY).then(obj => obj[STORE_SETTING_EXTRA_BTN_KEY])
]).then(([settingObj, extraBtnObj]) => {
  if (settingObj) {
    Object.keys(settingObj).forEach(setKey => settings[setKey] = settingObj[setKey])
  }

  if (extraBtnObj) {
    Object.keys(extraBtnObj).forEach(setKey => settingExtraBtn[setKey] = extraBtnObj[setKey])
  }
})

// chrome.storage.sync.get(STORE_SETTING_KEY).then(settingObjKey => {
// // chrome.storage.local.get(STORE_SETTING_KEY).then(settingObjKey => {
//   const settingObj = settingObjKey[STORE_SETTING_KEY]
//   if (settingObj) {
//     Object.keys(settingObj).forEach(setKey => {
//       settings[setKey] = settingObj[setKey]
//     })
//   }
// })

watch(() => settingExtraBtn,
() => {
  chrome.storage.sync.set({ [STORE_SETTING_EXTRA_BTN_KEY]: settingExtraBtn})
}
, {deep: true})

watch([
  () => settings.compact,
  () => settings.progressBar,
  () => settings.extraSideBtn,
  () => settings.alignRight,
],
([newCompact, newprogressBar, newextraSideBtn, newalignRight]) => {
  chrome.storage.sync.set({ [STORE_SETTING_KEY]: settings})
  // chrome.storage.local.set({ [STORE_SETTING_KEY]: settings})
  console.log('new setting', newCompact, newprogressBar, newextraSideBtn, newalignRight)
})

export { settings, settingExtraBtn }
