<template>
  <div class="ipb-sidebar-group">
    <div class="ipb-sidebar">
      <button @click="startBookmark">
        <div class="ipb-bubble">{{ mainBM.chI != null ? 'Change bookmark location' : 'Add a new bookmark' }}</div>
        <div class="ipb-btn-child"><IpbIcon fill="#FFF" type="edit" /></div>
      </button>

      <button v-if="mainBM.chI != null" @click="jumpToBookmark" :class="{bmOnOtherCh: !fullViewMode && mainBM.chI != curChI}">
        <div class="ipb-bubble">
          <b>Jump to bookmark</b>
          <span v-if="!fullViewMode && mainBM.chI != curChI" class="ipb-warning">
            Bookmark located at Chapter {{ parseInt(mainBM.chI) + 1 }}.<br/>
            Click to visit Chapter {{ parseInt(mainBM.chI) + 1 }}
            <IpbIcon type="visit" fill="#999" />
          </span>
        </div>
        <div class="ipb-btn-child"><IpbIcon fill="#FFF" type="location" /></div>
      </button>
    </div>
    <div v-if="settings.extraSideBtn" class="ipb-sidebar ipb-sidebar--extra">
      <button @click="eventRef[eventKey]" v-for="({iconProps, eventKey, btnKey, checkIfExternal}, i) in buttons" :key="i">
        <div class="ipb-bubble">
          {{ btnLabel(btnKey) }}
          <IpbIcon v-if="checkIfExternal && !fullViewMode && isExternal[btnKey]" type="visit" fill="#999" />
        </div>
        <div class="ipb-btn-child"><IpbIcon v-bind="iconProps" fill="#FFF" /></div>
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import {
  chapters, curChI, onScroll,
  jumpToChapter, jumpToCurrentChapter,
  jumpToFirstChapter, jumpToLastChapter, jumpToPreviousChapter, jumpToNextChapter
} from '../js/page'
import { mainBM, bmInProgress, bmFocusCountDown, startBookmarkEdit } from '../js/bookmark'
import { chapterInfos, fullViewMode } from '../js/static'
import { settings, settingExtraBtn } from '../js/setting'
import { EXTRA_BUTTON_INFOS } from '@/common/variables'

import IpbIcon from '@/common/IpbIcon.vue'

export default {
  components: { IpbIcon },
  setup () {

    const startBookmark = e => startBookmarkEdit(e, chapters)

    const isExternal = computed(() => {
      return {
        firstCh: curChI.value > 0,
        prevCh: curChI.value > 0,
        nextCh: curChI.value < chapterInfos.length - 1,
        latestCh: curChI.value < chapterInfos.length - 1 
      }
    })
    let countDownInt = null
    const jumpToBookmark = () => {
      if (!fullViewMode && mainBM.chI != curChI.value) {
        console.log('bookmark is located at another chapter')
        jumpToChapter(mainBM.chI)
        return
      }
      const {top, height} = chapters[mainBM.chI]
      const bmPos = top + height * mainBM.perc
      const targetScroll = bmPos - window.innerHeight / 2

      window.scrollTo({top: targetScroll })
      onScroll(null, targetScroll)

      bmFocusCountDown.value = true
      if (!countDownInt) clearTimeout(countDownInt)
      countDownInt = setTimeout(() => {
        bmFocusCountDown.value = false
      }, 1200)
    }
    const eventRef = {
      backToTop: () => document.getElementById('main').scrollIntoView(),
      jumpToFirstChapter,
      jumpToPreviousChapter,
      jumpToCurrentChapter,
      jumpToNextChapter,
      jumpToLastChapter,
      onJumpToComment (e) {
        const commentBtnElem = document.getElementById('show_comments_link').querySelector('a')
      
        if (commentBtnElem.innerText.indexOf('Hide') === -1) {
          commentBtnElem.click()
          commentBtnElem.scrollIntoView()
        } else {
          document.getElementById('comments_placeholder').scrollIntoView()
        }
      }
    }

    const buttons = computed(() => {
      return Object.keys(EXTRA_BUTTON_INFOS)
        .filter(btnKey => settingExtraBtn[btnKey])
        .map(btnKey => ({btnKey, ...EXTRA_BUTTON_INFOS[btnKey]}))
    })

    const btnLabel = btnKey => {
      const curChIStr = parseInt(curChI.value) + 1
      return {
        prevCh: curChIStr === 1 ? 'Previous (already at chapter 1)' : 'Previous: Chapter ' + Math.max(1, curChIStr - 1),
        curCh: 'Current: Chapter ' + curChIStr,
        nextCh: curChIStr === chapterInfos.length ? 'Next (already at the latest chapter)' : 'Next: Chapter ' + Math.min(chapterInfos.length, curChIStr + 1),
        latestCh: 'Latest: Chapter ' + chapterInfos.length
      }[btnKey] || EXTRA_BUTTON_INFOS[btnKey].label
    }
    return {
      mainBM, curChI, startBookmark, jumpToBookmark,
      bmInProgress, fullViewMode, settings,
      buttons, eventRef, btnLabel, isExternal
    }
  }
}
</script>

<style lang="scss">
.ipb-sidebar-group {
  position: fixed;
  z-index: 99;
  top: 100px;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  pointer-events: none;
}

.ipb-sidebar {
  display: flex;
  gap: 2px;
  flex-direction: column;
  align-items: flex-end;

  & > button {
    position: relative;
    line-height: 1;
    cursor: pointer;
    opacity: 0.5;
    pointer-events: all;

    &:hover {
      opacity: 1;
      z-index: 1;
      transition: transform 0.2s, opacity 0.2s;

      .ipb-bubble { display: block; }
    }

    .ipb-bubble {
      position: absolute;
      padding: 3px 8px;
      background-color: #ddd;
      bottom: 0;
      transform: translateY(calc(100% + 5px));
      right: 22px;
      pointer-events: none;
      font-size: 11px;
      line-height: 1;
      display: none;
      text-align: left;
      
      b {
        display: block;
        padding-bottom: 5px;

        &:only-child {
          font-weight: normal;
          padding-bottom: 0;
        }
      }

      .ipb-warning {
        display: block;
        color: #397ce1;
      }
    }

    &.bmOnOtherCh {
      .ipb-bubble { padding: 7px; }
    }

    & > .ipb-btn-child {
      background-color: $ao3_red;
      width: 20px;
      height: 20px;
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;

      .ipb-icon {
        width: 100%;
        height: 100%;
        padding: 3px;
        box-sizing: border-box;
      }

    }
  }
} // .ipb-sidebar

.ipb-left .ipb-sidebar-group {
  right: auto;
  left: 0;

  .ipb-sidebar {
    align-items: flex-start;

    & > button {
      .ipb-bubble {
        right: auto;
        left: 22px;
      }
      
      & > .ipb-btn-child {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
      }
    }
  }
}

.ipb-sidebar.ipb-sidebar--extra {
  & > button {
    & > .ipb-btn-child { background-color: $btn_blue; }
  }
} 
  
</style>