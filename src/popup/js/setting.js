import { reactive, watch } from "vue"
import {
  STORE_SETTING_KEY, STORE_SETTING_EXTRA_BTN_KEY, STORE_SETTING_POPUP_KEY,
  DEFAULT_SETTINGS, DEFAULT_SETTING_EXTRA_BUTTONS, DEFAULT_SETTING_POPUP
} from "@/common/variables"

// settings influent both content and popup, should be read-only when accessed by popup
const settings = reactive({...DEFAULT_SETTINGS})
const settingExtraBtn = reactive({...DEFAULT_SETTING_EXTRA_BUTTONS})

// settingsPopup only affect popup, read/write on popup only
const settingsPopup = reactive({...DEFAULT_SETTING_POPUP})

const onResetSetting = () => {
  // below will trigger chrome.storage.local.set of settings
  Object.keys(DEFAULT_SETTINGS).forEach(setKey => settings[setKey] = DEFAULT_SETTINGS[setKey])
  Object.keys(DEFAULT_SETTING_EXTRA_BUTTONS).forEach(setKey => settingExtraBtn[setKey] = DEFAULT_SETTING_EXTRA_BUTTONS[setKey])
  // reset only apply to content, not popup layout
  // Object.keys(DEFAULT_SETTING_POPUP).forEach(setKey => settingsPopup[setKey] = DEFAULT_SETTING_POPUP[setKey])
}

Promise.all([
  chrome.storage.local.get(STORE_SETTING_KEY).then(obj => obj[STORE_SETTING_KEY]),
  chrome.storage.local.get(STORE_SETTING_EXTRA_BTN_KEY).then(obj => obj[STORE_SETTING_EXTRA_BTN_KEY]),
  chrome.storage.local.get(STORE_SETTING_POPUP_KEY).then(obj => obj[STORE_SETTING_POPUP_KEY])
]).then(([settingObj, extraBtnObj, settingPopupObj]) => {
  if (settingObj) {
    Object.keys(settingObj).forEach(setKey => settings[setKey] = settingObj[setKey])
  }

  if (extraBtnObj) {
    Object.keys(extraBtnObj).forEach(setKey => settingExtraBtn[setKey] = extraBtnObj[setKey])
  }

  if (settingPopupObj) {
    Object.keys(settingPopupObj).forEach(setKey => settingsPopup[setKey] = settingPopupObj[setKey])
  }

  // initialise setting watch only after setting values are initialised
  watch(() => settingExtraBtn,
  () => {
    chrome.storage.local.set({ [STORE_SETTING_EXTRA_BTN_KEY]: settingExtraBtn})
  }
  , {deep: true})

  watch(() => settings,
  () => {
    chrome.storage.local.set({ [STORE_SETTING_KEY]: settings})
  }, {deep: true})

  watch(() => settingsPopup,
  () => {
    chrome.storage.local.set({ [STORE_SETTING_POPUP_KEY]: settingsPopup})
  }, {deep: true})
})



export { settings, settingExtraBtn, settingsPopup, onResetSetting }
