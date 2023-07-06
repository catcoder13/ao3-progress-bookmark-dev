import { reactive, watch } from "vue"
import {
  STORE_SETTING_KEY, STORE_SETTING_EXTRA_BTN_KEY,
  DEFAULT_SETTINGS, DEFAULT_SETTING_EXTRA_BUTTONS
} from "@/common/variables"

const settings = reactive({...DEFAULT_SETTINGS})
const settingExtraBtn = reactive({...DEFAULT_SETTING_EXTRA_BUTTONS})

const onResetSetting = () => {
  // below will trigger chrome.storage.local.set of settings
  Object.keys(DEFAULT_SETTINGS).forEach(setKey => settings[setKey] = DEFAULT_SETTINGS[setKey])
  Object.keys(DEFAULT_SETTING_EXTRA_BUTTONS).forEach(setKey => settingExtraBtn[setKey] = DEFAULT_SETTING_EXTRA_BUTTONS[setKey])
}

Promise.all([
  chrome.storage.local.get(STORE_SETTING_KEY).then(obj => obj[STORE_SETTING_KEY]),
  chrome.storage.local.get(STORE_SETTING_EXTRA_BTN_KEY).then(obj => obj[STORE_SETTING_EXTRA_BTN_KEY])
]).then(([settingObj, extraBtnObj]) => {
  if (settingObj) {
    Object.keys(settingObj).forEach(setKey => settings[setKey] = settingObj[setKey])
  }

  if (extraBtnObj) {
    Object.keys(extraBtnObj).forEach(setKey => settingExtraBtn[setKey] = extraBtnObj[setKey])
  }

  // initialise setting watch only after setting values are initialised
  watch(() => settingExtraBtn,
  () => {
    chrome.storage.local.set({ [STORE_SETTING_EXTRA_BTN_KEY]: settingExtraBtn})
    // console.log('new setting extra button', settingExtraBtn)
  }
  , {deep: true})

  watch(() => settings,
  () => {
    chrome.storage.local.set({ [STORE_SETTING_KEY]: settings})
    // console.log('new setting', settings)
  }, {deep: true})
})



export { settings, settingExtraBtn, onResetSetting }
