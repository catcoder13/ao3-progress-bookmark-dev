import { reactive, watch } from "vue"
import { STORE_SETTING_KEY, DEFAULT_SETTINGS } from "@/common/variables"

const settings = reactive(DEFAULT_SETTINGS)

chrome.storage.sync.get(STORE_SETTING_KEY).then(settingObjKey => {
// chrome.storage.local.get(STORE_SETTING_KEY).then(settingObjKey => {
  const settingObj = settingObjKey[STORE_SETTING_KEY]
  if (settingObj) {
    Object.keys(settingObj).forEach(setKey => {
      settings[setKey] = settingObj[setKey]
    })
  }
})

watch([
  () => settings.compact,
  () => settings.showNav,
  () => settings.extraSideNav,
  () => settings.bmAtRight,
],
([newCompact, newShowNav, newExtraSideNav, newbmAtRight]) => {
  chrome.storage.sync.set({ [STORE_SETTING_KEY]: settings})
  // chrome.storage.local.set({ [STORE_SETTING_KEY]: settings})
  console.log('new setting', newCompact, newShowNav, newExtraSideNav, newbmAtRight)
})

// watch(() => settings.showNav,
// () => {
//   chrome.storage.sync.set({ [STORE_SETTING_KEY]: settings})
//   // chrome.storage.local.set({ [STORE_SETTING_KEY]: settings})
//   console.log('new setting showNav')
// })

// watch(() => settings.extraSideNav,
// () => {
//   chrome.storage.local.set({ [STORE_SETTING_KEY]: settings})
//   chrome.storage.local.set({ [STORE_SETTING_KEY]: settings})
//   console.log('new setting extraSideNav')
// })

// watch(() => settings.bmAtRight,
// () => {
//   chrome.storage.local.set({ [STORE_SETTING_KEY]: settings})
//   console.log('new setting bmAtRight')
// })

export { settings }
