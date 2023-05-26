import { reactive } from 'vue'

const DEFAULT_SETTINGS = {
  compact: false,
  showNav: true,
  extraSideNav: false,
  sideNavVPos: 100,
  bmAtRight: true
}
const settings = reactive(DEFAULT_SETTINGS)

const updateSetting = settingObj => {
  Object.keys(settingObj).forEach(settingProp => {
    settings[settingProp] = settingObj[settingProp]
  })
}

export { settings, updateSetting }
