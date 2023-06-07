import { reactive, watch } from "vue"
import {
  STORE_SETTING_KEY, STORE_SETTING_POPUP_KEY, STORE_SETTING_EXTRA_BTN_KEY,
  DEFAULT_SETTINGS, DEFAULT_POPUP_SETTINGS, DEFAULT_SETTING_EXTRA_BUTTONS
} from "@/common/variables"

const settings = reactive({...DEFAULT_SETTINGS})
const settingPopup = reactive({...DEFAULT_POPUP_SETTINGS})
const settingExtraBtn = reactive({...DEFAULT_SETTING_EXTRA_BUTTONS})

const onResetSetting = () => {
  // below will trigger chrome.storage.sync.set of settings
  Object.keys(DEFAULT_SETTINGS).forEach(setKey => settings[setKey] = DEFAULT_SETTINGS[setKey])
  Object.keys(DEFAULT_POPUP_SETTINGS).forEach(setKey => settingPopup[setKey] = DEFAULT_POPUP_SETTINGS[setKey])
  Object.keys(DEFAULT_SETTING_EXTRA_BUTTONS).forEach(setKey => settingExtraBtn[setKey] = DEFAULT_SETTING_EXTRA_BUTTONS[setKey])
}

Promise.all([
  chrome.storage.sync.get(STORE_SETTING_KEY).then(obj => obj[STORE_SETTING_KEY]),
  chrome.storage.sync.get(STORE_SETTING_POPUP_KEY).then(obj => obj[STORE_SETTING_POPUP_KEY]),
  chrome.storage.sync.get(STORE_SETTING_EXTRA_BTN_KEY).then(obj => obj[STORE_SETTING_EXTRA_BTN_KEY])
]).then(([settingObj, settingPopupObj, extraBtnObj]) => {
  if (settingObj) {
    Object.keys(settingObj).forEach(setKey => settings[setKey] = settingObj[setKey])
  }

  if (settingPopupObj) {
    Object.keys(settingPopupObj).forEach(setKey => settingPopup[setKey] = settingPopupObj[setKey])
  }

  if (extraBtnObj) {
    Object.keys(extraBtnObj).forEach(setKey => settingExtraBtn[setKey] = extraBtnObj[setKey])
  }

  // initialise setting watch only after setting values are initialised
  watch(() => settingExtraBtn,
  () => {
    chrome.storage.sync.set({ [STORE_SETTING_EXTRA_BTN_KEY]: settingExtraBtn})
    // console.log('new setting extra button', settingExtraBtn)
  }
  , {deep: true})

  watch(() => settings,
  () => {
    chrome.storage.sync.set({ [STORE_SETTING_KEY]: settings})
    // console.log('new setting', settings)
  }, {deep: true})

  watch(() => settingPopup,
  () => {
    chrome.storage.sync.set({ [STORE_SETTING_POPUP_KEY]: settingPopup})
    // console.log('new setting', settingPopup)
  }, {deep: true})
})



export { settings, settingPopup, settingExtraBtn, onResetSetting }
