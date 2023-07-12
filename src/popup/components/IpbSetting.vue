<template>
  <div class="ipb-setting" :class="{open: toggle}" @click="onClickedAreaCheck">
    <div class="ipb-setting__entry" @click="onToggle">
      <IpbIcon v-if="!toggle" type="menu" fill="#FFF" :open="false"/>
      <span v-else>&#10006;</span>
    </div>
    
    <div class="ipb-style-scrollbar">
      <h1>Settings</h1>
      <div class="ipb-setting__option-group">
        <h2>User Interface</h2>
        <div class="ipb-setting__option-group__item">
          <div class="ipb-tab--custom">
            <span :class="{checked: !settings.alignRight}" @click="settings.alignRight = false">Left</span>
            <span :class="{checked: settings.alignRight}" @click="settings.alignRight = true">Right</span>
          </div>
          <h3>Buttons/bookmark alignment</h3>
        </div>
        
        <div class="ipb-setting__option-group__item">
          <IpbToggle v-model="settings.progressBar" />
          <h3>Chapter progress bar</h3>
        </div>
        
        <div class="ipb-setting__option-group__item">
          <IpbToggle v-model="settings.extraSideBtn" />
          <h3>Extra navigation buttons</h3>
        </div>
        
        <div class="ipb-setting__extra-btn" :class="{enabled: settings.extraSideBtn}">
          <div v-for="(val, btnKey) in settingExtraBtn" :key="btnKey"
            :class="{checked: val}"
            @click="() => onExtraBtnClick(btnKey, !val)">
              <IpbIcon v-bind="EXTRA_BUTTON_INFOS[btnKey].iconProps" :fill="val ? '#1c73b5' : '#777'"/>
              <span>{{ EXTRA_BUTTON_INFOS[btnKey].label }}</span>
          </div>
        </div>
      </div>

      <button class="ipb-setting__reset" @click="onResetSetting">Reset to default settings</button>
     
      <div class="ipb-setting__option-group">
        <h2>Bookmark data</h2>
        <div class="ipb-setting__option-group__item">
          <input ref="inputFile" type="file" accept=".json" @change="e => curFile = e.target.files[0]" required />
          <h3>Import bookmark data</h3>
        </div>

        <div class="ipb-setting__option-group__item">
          <button @click="downloadData">Download</button>
          <h3>Download bookmark data</h3>
        </div>

        <div class="ipb-setting__option-group__item ipb-delete">
          <button @click="deleteMsgOn = true">Remove</button>
          <h3>Remove all bookmarks</h3>
        </div>
      </div>

      <div class="ipb-setting__option-group">
        <h2>Q & A</h2>
        <IpbQA v-for="([q, ans, extra], i) in Q_A" :key="i" :q="q" :ans="ans" :extra="extra" />
      </div>
    </div>

    <div v-if="curFile" class="ipb-setting__overlay-msg">
      <IpbFileSummary :file="curFile" @complete="importComplete" @cancel="onClearImport"/>
    </div>

    <div v-if="deleteMsgOn" class="ipb-setting__overlay-msg">
      <div class="ipb-text">
        <span>
          <b>Are you sure you want to remove all bookmark data?</b>
          <br />
          Before proceeding, it is advised to download your bookmark data using the "Download" button under the "Download bookmark data" setting section for potential recovery.</span>
      </div>
      <div class="ipb-button">
        <button class="ipb-delete" @click="onDeleteAllBookmarkData">Confirm remove</button>
        <button @click="deleteMsgOn = false">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import {ref} from 'vue'
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
    "Where are the bookmark data stored?",
    "Bookmark data is stored locally in your computer, within the memory space allocated to your browser profile."
  ],
  [
    "What happen when I switch to a different browser profile?",
    "If you switch to a different browser profile (logging into the browser with a different browser account), you won't be able to access the bookmark records that are created by the old browser profile."
  ],
  [
    "How do I migrate my bookmark data to a different browser profile?",
    "To migrate your bookmark data to a new browser profile, follow these steps:",
    [
      "Download the bookmark data (it will be a .json file)",
      "Switch to the desired browser profile",
      "Import the .json file",
      "Bookmark records are now accessible for the new profile"
    ]
  ],
  [
    "What happen to existing bookmarks when importing bookmark data from a .json file?",
    "All existing bookmark records will be removed before importing new bookmark records."
  ],
  [
    `What happen when I reach the maximum bookmark limit (${BOOKMARK_LIMIT} bookmark records)?`,
    "You will not be able to add any new bookmark. To add new bookmark, you will have to remove existing bookmarks to free out more space."
  ]
]
export default {
  components: { IpbToggle, IpbIcon, IpbFileSummary, IpbQA },
  setup() {
    const toggle = ref(false)

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

    return {
      inputFile,
      deleteMsgOn, onDeleteAllBookmarkData,
      curFile, importComplete, onClearImport, onExtraBtnClick,
      toggle, onToggle, onClickedAreaCheck, settings, settingExtraBtn, EXTRA_BUTTON_INFOS,
      downloadData, onResetSetting, Q_A
    }
  }
}
</script>

<style lang="scss">
.ipb-setting {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  user-select: none;

  &.open {
    background-color: rgba(#000, 0.65);
    pointer-events: all;
    transition: background-color 0.2s 0.2s;
    
    .ipb-style-scrollbar { transform: translateX(0); }

    .ipb-setting__entry:hover { background-color: rgba(#FFF, 0.8); }
  }

  .ipb-setting__entry {
    position: absolute;
    z-index: 1;
    right: 10px;
    top: 5px;
    width: 27px;
    height: 27px;
    border-radius: 50%;
    cursor: pointer;
    pointer-events: all;

    & > * {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      line-height: 21px;
      font-size: 20px;
      color: #666;
    }

    .ipb-icon {
      width: 25px;
      height: 25px;
    }

    &:hover { background-color: rgba(#FFF, 0.1); }
  }

  h1 {
    font-family: Georgia, serif;
    font-size: 24px;
    line-height: 1;
    margin-bottom: 15px;
  }

  & > .ipb-style-scrollbar {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    max-width: 350px;
    height: 100%;
    background-color: #eee;
    transform: translateX(100%);
    transition: transform 0.3s;
    padding: 15px;
    box-sizing: border-box;
    overflow-y: scroll;

    .ipb-setting__option-group {
      margin-bottom: 20px;

      h2 {
        font-weight: bold;
        margin-bottom: 10px;
        border-bottom: 1px solid #333;
      }

      p {
        margin-bottom: 10px;
        color: #666;
      }

      .ipb-setting__option-group__item {
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;

        .ipb-toggle ~ h3 { opacity: 0.3; }
        .ipb-toggle.checked ~ h3 { opacity: 1; }

        h3 {
          font-weight: bold;
          font-size: 13px;
          line-height: 1;
        }

        button {
          border: 1px solid #777;
          cursor: pointer;
          padding: 5px 8px;
          line-height: 1;
          color: #FFF;
          background-color: #666;

          &:hover {
            background-color: #333;
            color: #FFF;
          }
        }

        &.ipb-delete {
          button:hover {
            border-color: $red;
            background-color: $red;
          }
        }

        input[type=file] {
          font-size: 12px;
          width: 81px;
          cursor: pointer;
        }
      } // .ipb-setting__option-group__item

      .ipb-setting__extra-btn {
        opacity: 0.5;
        cursor: not-allowed;
        
        &.enabled {
          opacity: 1;
          cursor: default;

          & > * {
            cursor: pointer;
            &:hover { opacity: 1; }
          }
        }
        & > * {
          display: inline-block;
          cursor: not-allowed;
          padding: 3px 6px;
          line-height: 1;
          font-size: 11px;
          opacity: 0.6;
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
            font-size: 10px;
          }

          
          
          & > * { display: inline-block; vertical-align: middle; }

          .ipb-icon { padding-right: 2px; }
        }
      }

    }
  }

  .ipb-setting__overlay-msg {
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

    .ipb-text {
      padding: 80px 20px 40px;

      span {
        font-size: 13px;
        display: block;
        color: #FFF;

        &:last-child { color: #aaa; }
      }
    }

    .ipb-button {
      text-align: center;

      button {
        padding: 5px 10px;
        cursor: pointer;

        &:first-child { margin-right: 10px; }

        &:hover { filter: brightness(0.8); }

        &.ipb-delete:hover {
          background-color: $red;
          color: #FFF;
        }
      }
    }
    
  }

  .ipb-setting__reset {
    background-color: #666;
    color: #FFF;
    line-height: 1;
    cursor: pointer;
    padding: 6px 10px;
    margin-bottom: 20px;
    font-size: 14px;

    &:hover { background-color: #333; }
  }
} // .ipb-setting

.ipb-tab--custom {
  display: flex;

  span {
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

    &:hover {
      opacity: 1;
    }

  }
}
</style>