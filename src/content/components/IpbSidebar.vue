<template>
  <div class="ipb-sidebar-group">
    <div class="ipb-sidebar">
      <a class="ipb-sidebar__button--bookmark ipb-a-button" @click="startBookmark" :class="{exceed: mainBM.chI === null && !withinBookmarkLimit}">
        <template v-if="mainBM.chI === null && !withinBookmarkLimit">
          <div class="ipb-bubble">
            You had reached bookmark limit {{ BOOKMARK_LIMIT }}.<br />
            Try to delete some of the existing bookmark to free out more space for new bookmark.
          </div>
        </template>
        <template v-else>
          <div class="ipb-bubble">{{ mainBM.chI != null ? 'Change bookmark location' : 'Add a new bookmark' }}</div>
        </template>
        
        <div class="ipb-btn-child"><IpbIcon fill="#FFF" :type="mainBM.chI == null ? 'add' : 'edit'" /></div>
      </a>

      <a :href="jumpToBookmarkHref" v-if="mainBM.chI != null" @click="jumpToBookmark" class="ipb-a-button" :class="{bmOnOtherCh: !fullViewMode && mainBM.chI != curChI}">
        <div class="ipb-bubble">
          <b>Jump to bookmark</b>
          <span v-if="!fullViewMode && mainBM.chI != curChI" class="ipb-warning">
            Bookmark located at Chapter {{ parseInt(mainBM.chI) + 1 }}.<br/>
            Click to visit Chapter {{ parseInt(mainBM.chI) + 1 }}
            <IpbIcon type="visit" fill="#999" />
          </span>
        </div>
        <div class="ipb-btn-child"><IpbIcon fill="#FFF" type="location" /></div>
      </a>
    </div>
    <div v-if="settings.extraSideBtn" class="ipb-sidebar ipb-sidebar--extra">
      <a class="ipb-a-button" :href="sidebarHref(chICode)" @click="onClick" v-for="({chICode, iconProps, onClick, btnKey, checkIfExternal}, i) in buttons" :key="i">
      <!-- <a :href="sidebarHref(targetChI)" @click="eventRef[eventKey]" v-for="({targetChI, iconProps, eventKey, btnKey, checkIfExternal}, i) in buttons" :key="i"> -->
        <div class="ipb-bubble">
          {{ btnLabel(btnKey) }}
          <IpbIcon v-if="checkIfExternal && !fullViewMode && isExternal[btnKey]" type="visit" fill="#999" />
        </div>
        <div class="ipb-btn-child"><IpbIcon v-bind="iconProps" fill="#FFF" /></div>
      </a>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { chapters, curChI } from '../js/page'
import {onScroll} from '../js/scroll'
import { mainBM, bmInProgress, bmFocusCountDown, startBookmarkEdit, withinBookmarkLimit } from '../js/bookmark'
import { chapterInfos, fullViewMode, oneShot, workID } from '../js/static'
import { settings, settingExtraBtn } from '../js/setting'
import { BOOKMARK_LIMIT, EXTRA_BUTTON_INFOS, AO3_DOMAIN } from '@/common/variables'

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
        // jumpToChapter(mainBM.chI)
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

    const jumpToBookmarkHref = computed(() => {
      if (!fullViewMode && mainBM.chI != curChI.value) {
        return `${AO3_DOMAIN}/works/${workID}/chapters/${chapterInfos[mainBM.chI].chID}#chapter-${parseInt(mainBM.chI) + 1}`
      }

      return null
    })

    const sidebarHref = chICode => {
      if (chICode === -3) return '#main'
      if (chICode === 3) return '#show_comments_link'
      if (oneShot) return '#workskin'

      let targetChHash = curChI.value // chICode === 0
      if (chICode === -2) targetChHash = 0
      if (chICode === -1) targetChHash = Math.max(0, curChI.value - 1)
      if (chICode === 1) targetChHash = Math.min(curChI.value + 1, chapterInfos.length - 1)
      if (chICode === 2) targetChHash = chapterInfos.length - 1
      
      if (fullViewMode || chICode === 0) return `#chapter-${targetChHash + 1}`
      
      return `${AO3_DOMAIN}/works/${workID}/chapters/${chapterInfos[targetChHash].chID}#chapter-${targetChHash + 1}`
      
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
      sidebarHref,
      mainBM, curChI, startBookmark, jumpToBookmark, jumpToBookmarkHref, withinBookmarkLimit, BOOKMARK_LIMIT,
      bmInProgress, fullViewMode, settings,
      buttons, btnLabel, isExternal
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
  gap: 5px;
  pointer-events: none;
}

.ipb-sidebar {
  display: flex;
  gap: 5px;
  flex-direction: column;
  align-items: flex-end;

  & > a {
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

    &.ipb-sidebar__button--bookmark.exceed {
      cursor: not-allowed;

      &:hover {
        opacity: inherit;
        z-index: inherit;
      }

      .ipb-btn-child {
        background-color: #333;
      }
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
      white-space: nowrap;
      
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
      width: 24px;
      height: 24px;
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

    & > a {
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
  & > a {
    & > .ipb-btn-child { background-color: $btn_blue; }
  }
} 
  
</style>