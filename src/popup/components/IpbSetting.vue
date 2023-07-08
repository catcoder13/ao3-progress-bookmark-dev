<template>
  <div class="ipb-setting" :class="{open: toggle}" @click="onClickedAreaCheck">
    <div class="ipb-setting__entry" @click="onToggle">
      <IpbIcon v-if="!toggle" type="menu" fill="#FFF" :open="false"/>
      <span v-else>&#10006;</span>
    </div>
    
    <div class="ipb-style-scrollbar">
      <h2>Settings</h2>
      <div class="ipb-setting__option-group">
        <h3>In-page bookmark UI</h3>
        <div class="ipb-setting__option-group__item">
          <h4>Side button/bookmark alignment</h4>
          <div class="ipb-tab--custom">
            <span :class="{checked: !settings.alignRight}" @click="settings.alignRight = false">Left</span>
            <span :class="{checked: settings.alignRight}" @click="settings.alignRight = true">Right</span>
          </div>
        </div>
        
        <div class="ipb-setting__option-group__item">
          <h4>Top chapter progress bar</h4>
          <IpbToggle v-model="settings.progressBar" />
        </div>
        
        <div class="ipb-setting__option-group__item">
          <h4>Extra navigation buttons</h4>
          <IpbToggle v-model="settings.extraSideBtn" />
        </div>
        
        <div class="ipb-setting__extra-btn" v-if="settings.extraSideBtn">
          <div v-for="(val, btnKey) in settingExtraBtn" :key="btnKey"
            :class="{checked: val}"
            @click="settingExtraBtn[btnKey] = !val">
              <IpbIcon v-bind="EXTRA_BUTTON_INFOS[btnKey].iconProps" :fill="val ? '#1c73b5' : '#777'"/>
              <span>{{ EXTRA_BUTTON_INFOS[btnKey].label }}</span>
          </div>
        </div>
      </div>
     
      <div class="ipb-setting__option-group">
        <h3>Bookmark data</h3>

        <div class="ipb-setting__option-group__item ipb-import">
          <h4>Import bookmark data</h4>
          <div>
            <!-- <input type="file" @change="e => curFile = e.target.files[0]" required /> -->
            <input ref="inputFile" type="file" @change="e => curFile = e.target.files[0]" required />
            <button @click="importMsgOn = true">Import</button>
          </div>
        </div>

        <div class="ipb-setting__option-group__item">
          <h4>Download bookmark data</h4>
          <button @click="downloadData">Download</button>
        </div>
        <div class="ipb-setting__option-group__item ipb-delete">
          <h4>Delete all bookmarks</h4>
          <button @click="deleteMsgOn = true">Delete</button>
        </div>
      </div>
      
      <button class="ipb-setting__reset" @click="onResetSetting">Reset to default settings</button>
    </div>

    <div v-if="importMsgOn" class="ipb-setting__overlay-msg">
      <IpbFileSummary :file="curFile" @complete="importComplete" @cancel="importMsgOn = false"/>
    </div>

    <div v-if="deleteMsgOn" class="ipb-setting__overlay-msg">
      <div class="ipb-text">
        <span>
          <b>Are you sure you want to delete all bookmark data?</b>
          <br />
          Before proceeding, it is advised to download your bookmark data using the "Download" button under the "Download bookmark data" setting section for potential recovery.</span>
      </div>
      <div class="ipb-button">
        <button class="ipb-delete" @click="onDeleteAllBookmarkData">Confirm delete</button>
        <button @click="deleteMsgOn = false">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import {ref} from 'vue'
import { settings, settingExtraBtn, onResetSetting } from '../js/setting'
import { downloadData } from '../js/data'
import { EXTRA_BUTTON_INFOS } from '@/common/variables'
import { removeAllWorks } from '../js/works'

import IpbToggle from './IpbToggle.vue'
import IpbIcon from '@/common/IpbIcon.vue'
import IpbFileSummary from './IpbFileSummary.vue'


export default {
  components: { IpbToggle, IpbIcon, IpbFileSummary },
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

    const importMsgOn = ref(false)
    const curFile = ref(null)

    const onImportBookmarkData = () => {
      importMsgOn.value = false
    }

    const importComplete = () => {
      curFile.value = null
      inputFile.value.value = null
      importMsgOn.value = false
      toggle.value = false
    }

    return {
      inputFile,
      deleteMsgOn, onDeleteAllBookmarkData,
      curFile, importMsgOn, onImportBookmarkData, importComplete,
      toggle, onToggle, onClickedAreaCheck, settings, settingExtraBtn, EXTRA_BUTTON_INFOS,
      downloadData, onResetSetting
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

    .ipb-setting__entry {
      // line { stroke: #333; }

      &:hover { background-color: rgba(#FFF, 0.8); }
    }
  }

  .ipb-setting__entry {
    position: absolute;
    z-index: 1;
    right: 10px;
    top: 10px;
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

      line-height: 1;
      font-size: 20px;
      color: #666;
    }

    .ipb-icon {
      width: 25px;
      height: 25px;
    }

    // line { transition: stroke 0.2s; }

    &:hover { background-color: rgba(#FFF, 0.1); }
  }

  h2 {
    font-family: Georgia, serif;
    font-size: 22px;
    line-height: 1;
    margin-bottom: 15px;
  }

  & > .ipb-style-scrollbar {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    max-width: 280px;
    height: 100%;
    background-color: #eee;
    transform: translateX(100%);
    transition: transform 0.3s;
    padding: 10px;
    box-sizing: border-box;
    overflow-y: scroll;

    .ipb-setting__option-group {
      margin-bottom: 15px;

      h3 {
        font-weight: bold;
        margin-bottom: 10px;
      }

      .ipb-setting__option-group__item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 6px;

        button {
          border: 1px solid #777;
          cursor: pointer;
          padding: 3px 5px;
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

        &.ipb-import {
          display: block;
          font-size: 12px;

          h4 { margin-bottom: 5px; }

          & > div {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;

            input[type=file] {
              font-size: 12px;
              width: 170px;
              cursor: pointer;
              
              &:invalid ~ button {
                opacity: 0.5;
                pointer-events: none;
                cursor: default;
                color: #333;
                background-color: transparent;
              }
            }
          }
          
        }
      } // .ipb-setting__option-group__item

      .ipb-setting__extra-btn {
        padding-bottom: 6px;

        & > * {
          display: inline-block;
          cursor: pointer;
          padding: 3px 6px;
          line-height: 1;
          font-size: 11px;
          opacity: 0.7;
          color: #777;
          border: 1px solid #777;
          border-radius: 12px;
          margin-bottom: 5px;
          margin-right: 5px;

          &:hover { opacity: 1; }

          &.checked { 
            opacity: 1;
            border: 1px solid $btn_blue;
            color: $btn_blue;
            font-weight: bold;
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
    padding: 3px 5px;

    &:hover { background-color: #333; }
  }
} // .ipb-setting

.ipb-tab--custom {
  display: flex;

  span {
    background-color: $btn_blue;
    color: #FFF;
    padding: 5px 10px;
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