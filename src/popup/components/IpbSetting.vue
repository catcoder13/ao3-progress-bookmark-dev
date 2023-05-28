<template>
  <div class="ipb-setting" :class="{open: toggle}" @click="onClickedAreaCheck">
    <IpbIcon class="ipb-setting__entry" type="menu" fill="#FFF" :open="toggle" @click="onToggle" />
    <div class="ipb-style-scrollbar">
      <h2>Settings</h2>
      <div class="ipb-setting__option-group">
        <h3>In-page bookmark UI</h3>
        <div class="ipb-setting__option-group__item">
          <h4>Show chapter navigation bar</h4>
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
        <div class="ipb-setting__option-group__item">
          <h4>Side button/bookmark alignment</h4>
          <div class="ipb-tab--custom">
            <span :class="{checked: !settings.alignRight}" @click="settings.alignRight = false">Left</span>
            <span :class="{checked: settings.alignRight}" @click="settings.alignRight = true">Right</span>
          </div>
        </div>
      </div>
     
      <div class="ipb-setting__option-group">
        <h3>Bookmark data</h3>
        <div class="ipb-setting__option-group__item">
          <h4>Import bookmark data</h4>
          <button>Import</button>
        </div>
        <div class="ipb-setting__option-group__item">
          <h4>Download bookmark data</h4>
          <button>Download</button>
        </div>
        <div class="ipb-setting__option-group__item">
          <h4>Delete all bookmarks</h4>
          <button>Delete</button>
        </div>
      </div>
      
      <button>Reset all settings</button>
    </div>
  </div>
</template>

<script>
import {ref} from 'vue'
import { settings, settingExtraBtn } from '../js/setting'
import { EXTRA_BUTTON_INFOS } from '@/common/variables'

import IpbToggle from './IpbToggle.vue'
import IpbIcon from '@/common/IpbIcon.vue'



export default {
  components: { IpbToggle, IpbIcon },
  setup() {
    const toggle = ref(false)

    const onToggle = e => {
      toggle.value = !toggle.value
      e.stopPropagation()
    }
    const onClickedAreaCheck = e => {
      toggle.value = (e.target === e.currentTarget) ? false : true
    }
    return { toggle, onToggle, onClickedAreaCheck, settings, settingExtraBtn, EXTRA_BUTTON_INFOS }
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

      line { stroke: #333; }

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

    line { transition: stroke 0.2s; }

    &:hover { background-color: rgba(#FFF, 0.1); }
  }

  h2 {
    font-family: Georgia, serif;
    font-size: 22px;
    line-height: 1;
    margin-bottom: 15px;
  }

  .ipb-style-scrollbar {
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
      }

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
            border: 1px solid #1c73b5;
            color: #1c73b5;
            font-weight: bold;
          }

          
          
          & > * { display: inline-block; vertical-align: middle; }

          .ipb-icon { padding-right: 2px; }
        }
      }

    }
  }
}

.ipb-tab--custom {
  display: flex;

  span {
    background-color: #777;
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
      opacity: 0.9;
    }

  }
}
</style>