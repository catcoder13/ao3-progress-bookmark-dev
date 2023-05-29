import { reactive, watch } from "vue"
import {
  STORE_SETTING_KEY, DEFAULT_SETTINGS,
  STORE_SETTING_EXTRA_BTN_KEY, DEFAULT_SETTING_EXTRA_BUTTONS
} from "@/common/variables"

const settings = reactive({...DEFAULT_SETTINGS})
const settingExtraBtn = reactive({...DEFAULT_SETTING_EXTRA_BUTTONS})

const onResetSetting = () => {
  // tempPauseSettingWatch = true
  // below will trigger chrome.storage.sync.set of settings
  Object.keys(DEFAULT_SETTINGS).forEach(setKey => settings[setKey] = DEFAULT_SETTINGS[setKey])
  Object.keys(DEFAULT_SETTING_EXTRA_BUTTONS).forEach(setKey => settingExtraBtn[setKey] = DEFAULT_SETTING_EXTRA_BUTTONS[setKey])

  chrome.storage.sync.set({
    [STORE_SETTING_KEY]: DEFAULT_SETTINGS,
    [STORE_SETTING_EXTRA_BTN_KEY]: DEFAULT_SETTING_EXTRA_BUTTONS
  }).catch(err => console.warn('[AO3 IPB] Error occurs on reset setting', err))

  console.log('reset setting')
}

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

watch(() => settingExtraBtn,
() => {
  chrome.storage.sync.set({ [STORE_SETTING_EXTRA_BTN_KEY]: settingExtraBtn})
  console.log('new setting extra button', settings)
}
, {deep: true})

watch(() => settings,
() => {
  chrome.storage.sync.set({ [STORE_SETTING_KEY]: settings})
  console.log('new setting', settings)
}, {deep: true})

export { settings, settingExtraBtn, onResetSetting }
