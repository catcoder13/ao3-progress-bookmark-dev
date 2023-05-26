import { reactive, watch } from "vue"

const STORE_SETTING_KEY = 'AO3_IPB_SETTINGS'

const settings = reactive({
  compact: false,
  showNav: true,
  extraSideNav: false,
  bmAtRight: true
})

chrome.storage.local.get(STORE_SETTING_KEY).then(settingObjKey => {
  const settingObj = settingObjKey[STORE_SETTING_KEY]
  if (settingObj) {
    Object.keys(settingObj).forEach(setKey => {
      settings[setKey] = settingObj[setKey]
    })
  }
})

watch(() => settings.compact,
() => {
  chrome.storage.local.set({ [STORE_SETTING_KEY]: settings})
  console.log('new setting compact')
})

watch(() => settings.showNav,
() => {
  chrome.storage.local.set({ [STORE_SETTING_KEY]: settings})
  console.log('new setting showNav')
})

watch(() => settings.extraSideNav,
() => {
  chrome.storage.local.set({ [STORE_SETTING_KEY]: settings})
  console.log('new setting extraSideNav')
})

watch(() => settings.bmAtRight,
() => {
  chrome.storage.local.set({ [STORE_SETTING_KEY]: settings})
  console.log('new setting bmAtRight')
})

export { settings }
