import { reactive } from 'vue'

const DEFAULT_SETTINGS = {
  compact: false,
  showNav: true,
  extraSideNav: false,
  sideNavVPos: 100,
  bmAtRight: true
}
const settings = reactive(DEFAULT_SETTINGS)

// chrome.runtime.onMessage.addListener(
//   (res, sender, sendResponse) => {
//     if (res.type === 'setting') {
//       settings[res.prop] = res.val
//       console.log('receive new setting', res.prop, res.val)
//     }
//   }
// )

const updateSetting = settingObj => {
  Object.keys(settingObj).forEach(settingProp => {
    settings[settingProp] = settingObj[settingProp]
  })
}

export { settings, updateSetting }
