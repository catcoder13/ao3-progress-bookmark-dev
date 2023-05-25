import { reactive, watch } from "vue"

const STORE_SETTING_KEY = 'AO3_IPB_SETTINGS'

const settings = reactive({
  compact: false,
  showNav: true,
  extraSideNav: false,
  sideNavVPos: 100,
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

watch(() => settings.showNav,
newShowNav => {
  // chrome.runtime.sendMessage({ type: 'setting', prop: 'showNav', val: newShowNav})
  chrome.storage.local.set({ [STORE_SETTING_KEY]: settings})

  console.log('new setting showNav')
})

watch(() => settings.extraSideNav,
newExtraSideNav => {
  // chrome.runtime.sendMessage({ type: 'setting', prop: 'extraSideNav', val: newExtraSideNav})
  chrome.storage.local.set({ [STORE_SETTING_KEY]: settings})

  console.log('new setting extraSideNav')
})

watch(() => settings.sideNavVPos,
newSideNavVPos => {
  // chrome.runtime.sendMessage({ type: 'setting', prop: 'sideNavVPos', val: newSideNavVPos})
  chrome.storage.local.set({ [STORE_SETTING_KEY]: settings})

  console.log('new setting sideNavVPos')
})

watch(() => settings.bmAtRight,
newbmAtRight => {
  // chrome.runtime.sendMessage({ type: 'setting', prop: 'bmAtRight', val: newbmAtRight})
  chrome.storage.local.set({ [STORE_SETTING_KEY]: settings})

  console.log('new setting bmAtRight')
})




export { settings }
