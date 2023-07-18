<template>
  <div class="ao3pb-setting" :class="{open: toggle}" @click="onClickedAreaCheck">
    <button class="ao3pb-setting__entry" @click="onToggle" :tabindex="getTabIndex([0,1])">
      <IpbIcon v-if="!toggle" type="menu" fill="#FFF" :open="false"/>
      <span v-else>&#10006;</span>
    </button>
    
    <div ref="scrollDom" class="ao3pb-style-scrollbar">
      <h1>Settings</h1>
      <div class="ao3pb-setting__option-group">
        <h2>AO3 work page layout</h2>
        <div class="ao3pb-setting__option-group__item">
          <div class="ao3pb-tab--custom">
            <button :class="{checked: !settings.alignRight}" @click="settings.alignRight = false" :tabindex="getTabIndex([1])">Left</button>
            <button :class="{checked: settings.alignRight}" @click="settings.alignRight = true" :tabindex="getTabIndex([1])">Right</button>
          </div>
          <h3>Alignment</h3>
        </div>
        
        <div class="ao3pb-setting__option-group__item">
          <IpbToggle v-model="settings.progressBar" :tabindex="getTabIndex([1])" />
          <h3>Chapter progress bars</h3>
        </div>
        
        <div class="ao3pb-setting__option-group__item">
          <IpbToggle v-model="settings.extraSideBtn" :tabindex="getTabIndex([1])"/>
          <h3>Extra navigation buttons</h3>
        </div>
        
        <div class="ao3pb-setting__extra-btn" :class="{enabled: settings.extraSideBtn}">
          <button v-for="(val, btnKey) in settingExtraBtn" :key="btnKey" :tabindex="getTabIndex([1], settings.extraSideBtn)"
            :class="{checked: val}"
            @click="() => onExtraBtnClick(btnKey, !val)">
              <IpbIcon v-bind="EXTRA_BUTTON_INFOS[btnKey].iconProps" :fill="val ? '#1c73b5' : '#777'"/>
              <span>{{ EXTRA_BUTTON_INFOS[btnKey].label }}</span>
          </button>
        </div>

        <button class="ao3pb-setting__reset" @click="onResetSetting" :tabindex="getTabIndex([1])">Reset to default settings</button>
      </div>
     
      <div class="ao3pb-setting__option-group">
        <h2>Bookmark data</h2>
        <div class="ao3pb-setting__option-group__item">
          <input id="importBMInput" ref="inputFile" type="file" accept=".json" @change="e => curFile = e.target.files[0]" required :tabindex="getTabIndex([1])"/>
          <label for="importBMInput">&#x1F5C1; Upload</label>
          <h3>Import bookmark data</h3>
        </div>

        <div class="ao3pb-setting__option-group__item">
          <button @click="downloadData" :tabindex="getTabIndex([1])">&#x1F5AB; Download</button>
          <h3>Download bookmark data</h3>
        </div>

        <div class="ao3pb-setting__option-group__item ao3pb-delete">
          <button @click="deleteMsgOn = true" :tabindex="getTabIndex([1])">&#x1F5D1; Remove</button>
          <h3>Remove all bookmarks</h3>
        </div>
      </div>

      <div class="ao3pb-setting__option-group">
        <h2>Q & A</h2>
        <IpbQA :reset="toggle" v-for="([q, ans, extra], i) in Q_A" :key="i" :q="q" :ans="ans" :extra="extra" />
      </div>
    </div>

    <div v-if="curFile" class="ao3pb-setting__overlay-msg">
      <IpbFileSummary :file="curFile" @complete="importComplete" @cancel="onClearImport"/>
    </div>

    <div v-if="deleteMsgOn" class="ao3pb-setting__overlay-msg">
      <div class="ao3pb-text">
        <span>
          <b>Are you sure you want to remove all bookmark data?</b>
          <br />
          Before proceeding, it is advised to download your bookmark data using the "Download" button under the "Download bookmark data" setting section for potential recovery.</span>
      </div>
      <div class="ao3pb-button">
        <button class="ao3pb-delete" @click="onDeleteAllBookmarkData" :tabindex="getTabIndex([2])">Confirm remove</button>
        <button @click="deleteMsgOn = false" :tabindex="getTabIndex([2])">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, watch} from 'vue'
import { getTabIndex, visibility } from '../js/visibility'
import { settings, settingExtraBtn, onResetSetting } from '../js/setting'
import { downloadData } from '../js/data'
import { EXTRA_BUTTON_INFOS, BOOKMARK_LIMIT } from '@/common/variables'
import { removeAllWorks } from '../js/works'

import IpbToggle from './IpbToggle.vue'
import IpbIcon from '@/common/IpbIcon.vue'
import IpbFileSummary from './IpbFileSummary.vue'
import IpbQA from './IpbQA.vue'

const Q_A = [
  [
    "Where are the bookmark records stored?",
    "Bookmark recrods are stored locally in your computer, within the memory space allocated to your browser profile."
  ],
  [
    "Are the bookmark records tied to my AO3 account?",
    "No. The bookmark records are tied to your browser profile."
  ],
  [
    "What happen when I switch to a different browser profile?",
    "If you switch to a different browser profile (logging into the browser with a different browser account), you won't be able to access the bookmark records that are created by the old browser profile."
  ],
  [
    "How do I migrate my bookmark records to a different browser profile?",
    "To migrate your bookmark records to a new browser profile, follow these steps:",
    [
      "Download the bookmark records (it will be a .json file)",
      "Switch to the desired browser profile",
      "Import the downloaded .json file",
      "Bookmark records are now accessible for the new profile"
    ]
  ],
  [
    "What happen to existing bookmarks when importing bookmark records from a .json file?",
    "All existing bookmark records will be removed before importing new bookmark records."
  ],
  [
    `What is the reason for imposing a maximum limit of ${BOOKMARK_LIMIT} bookmarks?`,
    "The bookmark limit is tested to ensure compliance with extension storage criteria and to prevent excessive computing/memory resource usage."
  ],
  [
    `What happen when the maximum bookmark limit (${BOOKMARK_LIMIT} bookmark records) is reached?`,
    "you won't be able to add any new bookmarks. If you want to add more bookmarks, you'll need to remove some of the existing ones to free up space."
  ]
]
export default {
  components: { IpbToggle, IpbIcon, IpbFileSummary, IpbQA },
  setup() {
    const toggle = ref(false)
    const scrollDom = ref(null)
    
    const onToggle = e => {
      toggle.value = !toggle.value
      e.stopPropagation()
    }
    const onClickedAreaCheck = e => {
      if (e.target === e.currentTarget) toggle.value = false
    }

    const inputFile = ref(null)

    const deleteMsgOn = ref(false)

    const onDeleteAllBookmarkData = () => {
      removeAllWorks()
      deleteMsgOn.value = false
    }

    const curFile = ref(null)
    
    const onClearImport = () => {
      inputFile.value.value = null
      curFile.value = null
    }

    const importComplete = () => {
      onClearImport()
      toggle.value = false
    }

    

    const onExtraBtnClick = (btnKey, newVal) => {
      if (!settings.extraSideBtn) return

      settingExtraBtn[btnKey] = newVal
    }

    watch(() => toggle.value,
    newToggleVal => {
      visibility.value = newToggleVal ? 1 : 0

      if (newToggleVal) scrollDom.value.scrollTo(0,0)
    })

    watch([
      () => deleteMsgOn.value,
      () => curFile.value,
    ],
    ([newDeleteMsgOn, newCurFile]) => {
      visibility.value = (newDeleteMsgOn || newCurFile) ? 2 : 1 
    })

    return {
      scrollDom, inputFile,
      deleteMsgOn, onDeleteAllBookmarkData,
      curFile, importComplete, onClearImport, onExtraBtnClick,
      toggle, onToggle, onClickedAreaCheck, settings, settingExtraBtn, EXTRA_BUTTON_INFOS,
      downloadData, onResetSetting, Q_A, getTabIndex
    }
  }
}
</script>

<style lang="scss">
.ao3pb-setting {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;

  &.open {
    background-color: rgba(#000, 0.65);
    pointer-events: all;
    transition: background-color 0.2s 0.2s;
    
    .ao3pb-style-scrollbar {
      visibility:visible;
      transform: translateX(0);
      transition: transform 0.3s;
    }

    .ao3pb-setting__entry:hover,
    .ao3pb-setting__entry:focus-visible { background-color: rgba(#FFF, 0.8); }
  }

  .ao3pb-setting__entry {
    position: absolute;
    z-index: 1;
    right: 10px;
    top: 5px;
    width: 27px;
    height: 27px;
    border-radius: 50%;
    cursor: pointer;
    pointer-events: all;
    background-color: transparent;

    &::before { display: none; }

    & > * {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      line-height: 21px;
      font-size: 20px;
      color: #666;
    }

    .ao3pb-icon {
      width: 25px;
      height: 25px;
    }

    &:hover,
    &:focus-visible { background-color: rgba(#FFF, 0.1); }
  }

  h1 {
    font-family: Georgia, serif;
    font-size: 24px;
    line-height: 1;
    margin-bottom: 15px;
  }

  & > .ao3pb-style-scrollbar {
    visibility: hidden;
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    max-width: 340px;
    height: 100%;
    background-color: #eee;
    transform: translateX(100%);
    transition: transform 0.3s, visibility 0s 0.3s;
    padding: 15px;
    box-sizing: border-box;
    overflow-y: scroll;

    .ao3pb-setting__option-group {
      margin-bottom: 40px;

      h2 {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 10px;
        border-bottom: 1px solid #333;
      }

      p {
        margin-bottom: 10px;
        color: #666;
      }

      .ao3pb-setting__option-group__item {
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 5px;

        .ao3pb-toggle ~ h3 { opacity: 0.3; }
        .ao3pb-toggle.checked ~ h3 { opacity: 1; }

        h3 {
          font-size: 12px;
          line-height: 1;
        }

        & > button:not(.ao3pb-toggle) {
          border: 1px solid #777;
          cursor: pointer;
          padding: 5px 8px;
          font-size: 13px;
          line-height: 1;
          color: #FFF;
          background-color: #666;

          &:hover,
          &:focus-visible {
            background-color: #333;
            color: #FFF;
          }
        }

        input[type=file] {
          opacity: 0;
          width: 0;
          height: 0;
          position: absolute;

          & ~ label {
            border: 1px solid #777;
            cursor: pointer;
            padding: 5px 8px;
            font-size: 13px;
            line-height: 1;
            color: #FFF;
            background-color: #666;
          }
          
          &:focus-visible ~ label { box-shadow: 0 0 2px 2px #51a7e8; }

          &:focus-visible ~ label,
          & ~ label:hover {
            background-color: #333;
            color: #FFF;
          }
        }

        &.ao3pb-delete {
          button:hover,
          button:focus-visible {
            border-color: $red;
            background-color: $red;
          }
        }

        .ao3pb-tab--custom {
          display: flex;

          button {
            background-color: $ao3_red;
            color: #FFF;
            padding: 6px 12px;
            line-height: 1;
            cursor: pointer;
            opacity: 0.3;
            transition: opacity 0.2s;

            &:not(:last-child) { margin-right: 5px; }

            &.checked {
              pointer-events: none;
              opacity: 1;
            }

            &:hover,
            &:focus-visible {
              opacity: 1;
            }

          }
        }
      } // .ao3pb-setting__option-group__item

      .ao3pb-setting__extra-btn {
        opacity: 0.5;
        cursor: not-allowed;
        
        &.enabled {
          opacity: 1;
          cursor: default;

          & > * {
            cursor: pointer;
            &:hover,
            &:focus-visible { opacity: 1; }
          }
        }
        & > * {
          display: inline-block;
          cursor: not-allowed;
          padding: 3px 6px;
          line-height: 10px;
          font-size: 10px;
          opacity: 0.5;
          color: #777;
          border: 1px solid #777;
          border-radius: 12px;
          margin-bottom: 5px;
          margin-right: 5px;

          &.checked { 
            opacity: 1;
            border: 1px solid $btn_blue;
            color: $btn_blue;
            font-weight: bold;
            font-size: 9px;
          }

          & > * { display: inline-block; vertical-align: middle; }

          .ao3pb-icon {
            width: 12px;
            height: 12px;
            padding-right: 2px;
          }
        }
      }

      .ao3pb-setting__reset {
        background-color: #666;
        color: #FFF;
        line-height: 1;
        cursor: pointer;
        padding: 6px 10px;
        font-size: 14px;
        margin-top: 10px;

        &:hover,
        &:focus-visible { background-color: #333; }
      }
    } // ao3pb-setting__option-group
  }

  .ao3pb-setting__overlay-msg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-color: rgba(#000, 0.85);
    display: flex;
    flex-direction: column;
    font-size: 15px;

    .ao3pb-text {
      padding: 80px 20px 40px;

      span {
        font-size: 13px;
        display: block;
        color: #FFF;

        &:last-child { color: #aaa; }
      }
    }

    .ao3pb-button {
      text-align: center;

      button {
        padding: 5px 10px;
        cursor: pointer;
        background-color: #FFF;

        &:first-child { margin-right: 10px; }

        &:hover,
        &:focus-visible { filter: brightness(0.8); }

        &.ao3pb-delete:hover,
        &.ao3pb-delete:focus-visible {
          background-color: $red;
          color: #FFF;
        }
      }
    }
    
  }
} // .ao3pb-setting
</style>
