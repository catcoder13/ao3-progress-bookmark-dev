import { reactive } from 'vue'
import { DEFAULT_SETTINGS } from '@/common/variables'

const settings = reactive(DEFAULT_SETTINGS)

const updateSetting = settingObj => {
  Object.keys(settingObj).forEach(settingProp => {
    settings[settingProp] = settingObj[settingProp]
  })
}

export { settings, updateSetting }
