<template>
  <div class="ipb-sidebar-group">
    <div class="ipb-sidebar">
      <div class="ipb-sidebar__button--bookmark">
        <template v-if="mainBM.chI == null">
          <a class="ipb-a-button" @click="onBookmarkEntryClick" :class="{exceed: !withinBookmarkLimit}">
            <IpbIcon fill="#FFF" type="add" />
              <div class="ipb-bubble">
                <template  v-if="!withinBookmarkLimit">
                  <b>You had reached bookmark limit ({{ BOOKMARK_LIMIT }}).</b>
                  <span>Try to remove some existing bookmarks to create more space for new bookmarks.</span>
                </template>
                <template v-else>Add a new bookmark</template>
              </div>
          </a>
        </template>
        <template v-else>
          <a class="ipb-a-button ipb-a-button--entry" :href="jumpToBookmarkHref" :class="{bmInOtherPage}" @click="jumpToBM">
            <IpbIcon fill="#FFF" type="location" />
            <div class="ipb-bubble">
              <b>Jump to bookmark</b>
              <span v-if="bmInOtherPage" class="ipb-warning">
                Bookmark located at Chapter {{ parseInt(mainBM.chI) + 1 }}.<br/>
                Click to redirect to Chapter {{ parseInt(mainBM.chI) + 1 }}
                <IpbIcon type="visit" fill="#999" />
              </span>
            </div>
          </a>
          <a class="ipb-a-button ipb-a-button--extra" @click="onBookmarkEntryClick">
            <IpbIcon fill="#FFF" type="edit" />
            <div class="ipb-bubble">Change bookmark location</div>
          </a>
          <a class="ipb-a-button ipb-a-button--extra" @click="removeBookmark">
            <IpbIcon fill="#FFF" type="trash" />
            <div class="ipb-bubble">Remove bookmark</div>
          </a>
        </template>
      </div>

    </div>
    <div v-if="settings.extraSideBtn" class="ipb-sidebar ipb-sidebar--extra">
      <a class="ipb-a-button" :href="sidebarHref(chICode)" @click="onClick" v-for="({chICode, iconProps, onClick, btnKey, checkIfExternal}, i) in buttons" :key="i">
        <div class="ipb-bubble">
          {{ btnLabel(btnKey) }}
          <IpbIcon v-if="checkIfExternal && !fullViewMode && isExternal[btnKey]" type="visit" fill="#999" />
        </div>
        <IpbIcon v-bind="iconProps" fill="#FFF" />
      </a>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { chapters, curChI } from '../js/page'
import { mainBM, bmInProgress, startBookmarkEdit, withinBookmarkLimit, jumpToBookmark, removeBookmark } from '../js/bookmark'
import { chapterInfos, fullViewMode, oneShot, workID } from '../js/static'
import { settings, settingExtraBtn } from '../js/setting'
import { BOOKMARK_LIMIT, EXTRA_BUTTON_INFOS, AO3_DOMAIN } from '@/common/variables'

import IpbIcon from '@/common/IpbIcon.vue'

export default {
  components: { IpbIcon },
  setup () {
    const onBookmarkEntryClick = e => startBookmarkEdit(e, chapters)

    const isExternal = computed(() => {
      return {
        firstCh: curChI.value > 0,
        prevCh: curChI.value > 0,
        nextCh: curChI.value < chapterInfos.length - 1,
        latestCh: curChI.value < chapterInfos.length - 1 
      }
    })

    const bmInOtherPage = computed(() => !fullViewMode && mainBM.chI != curChI.value)

    const jumpToBM = () => {
      jumpToBookmark(chapters, curChI)
    }

    const jumpToBookmarkHref = computed(() => {
      if (!fullViewMode && mainBM.chI != null &&  mainBM.chI != curChI.value) {
        // return `${AO3_DOMAIN}/works/${workID}/chapters/${chapterInfos[mainBM.chI].chID}#chapter-${parseInt(mainBM.chI) + 1}?jumptobm`
        return `${AO3_DOMAIN}/works/${workID}/chapters/${chapterInfos[mainBM.chI].chID}?jumptobm`
      }

      return null
    })

    const sidebarHref = chICode => {
      if (chICode === -3) return '#main'
      if (chICode === 3) {
        const commentSection = document.getElementById('show_comments_link')
        return (commentSection && '#show_comments_link') || '#add_comment'
      }
      if (oneShot) return '#workskin'

      let targetChHash = curChI.value // chICode === 0
      if (chICode === -2) targetChHash = 0
      if (chICode === -1) targetChHash = Math.max(0, curChI.value - 1)
      if (chICode === 1) targetChHash = Math.min(curChI.value + 1, chapterInfos.length - 1)
      if (chICode === 2) targetChHash = chapterInfos.length - 1
      
      if (fullViewMode || targetChHash === curChI.value) return `#chapter-${targetChHash + 1}`
      
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
        prevCh: 'Previous: Chapter ' + Math.max(1, curChIStr - 1),
        curCh: 'Current: Chapter ' + curChIStr,
        nextCh: 'Next: Chapter ' + Math.min(chapterInfos.length, curChIStr + 1),
        latestCh: 'Latest: Chapter ' + chapterInfos.length
      }[btnKey] || EXTRA_BUTTON_INFOS[btnKey].label
    }


    return {
      sidebarHref,
      mainBM, curChI, removeBookmark, onBookmarkEntryClick, jumpToBM, jumpToBookmarkHref, withinBookmarkLimit, BOOKMARK_LIMIT,
      bmInProgress, fullViewMode, settings, bmInOtherPage,
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
}

.ipb-sidebar {
  display: flex;
  gap: 5px;
  flex-direction: column;
  align-items: flex-end;

  a.ipb-a-button {
    position: relative;
    background-color: $ao3_red;
    width: 24px;
    height: 24px;
    padding: 3px;
    box-sizing: border-box;
    opacity: 0.5;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;

    &:hover {
      opacity: 1;
      transition: opacity 0.2s;

      .ipb-bubble {
        display: block;
      }
    }

    &.exceed {
      background-color: #bfbfbf;
      cursor: not-allowed;

      &:active::before { opacity: 0; }

      .ipb-bubble {
        white-space: normal;
        width: 250px;

        & > * { display: inline-block; }
        
        b { color: red; padding-bottom: 5px; }
      }
    }
    

    & > .ipb-icon {
      transition: transform 0.2s;
      width: 100%;
      height: 100%;
    }
    

    .ipb-bubble {
      display: none;
      position: absolute;
      z-index: 1;
      padding: 5px;
      background-color: #ddd;
      bottom: 0;
      transform: translateY(calc(100% + 5px));
      right: 24px;
      pointer-events: none;
      font-size: 11px;
      color: #333;
      line-height: 1;
      text-align: left;
      white-space: nowrap;
      box-shadow: 1px 1px 2px #999;
    }
  }

  .ipb-sidebar__button--bookmark {
    display: flex;
    flex-direction: row-reverse;

    &:hover {
      a.ipb-a-button.ipb-a-button--entry { border-radius: 0; }
      a.ipb-a-button.ipb-a-button--extra {
        display: block;

        &:not(:last-of-type) { border-radius: 0; }
      }
    }

    a.ipb-a-button {
      &:hover ~ .ipb-a-button { opacity: 0.75; }

      &.ipb-a-button--extra {
        display: none;
        color: #FFFFFF;
        text-align: center;

        .ipb-bubble { right: 4px; }
      }

      &.bmInOtherPage { background-color: grey; }

      .ipb-bubble {
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
    }
  } //.ipb-sidebar__button--bookmark
} // .ipb-sidebar

.ipb-left .ipb-sidebar-group {
  right: auto;
  left: 0;

  .ipb-sidebar {
    align-items: flex-start;

    a.ipb-a-button {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;

      .ipb-bubble {
        right: auto;
        left: 24px;
      }
    }

    .ipb-sidebar__button--bookmark {
      flex-direction: row;
      
      & > a.ipb-a-button {
        .ipb-bubble {
          right: auto;
          left: 24px;
        }

        &.ipb-a-button--extra .ipb-bubble { right: auto; left: 4px; }
      }
    }
  }
}

.ipb-sidebar.ipb-sidebar--extra > a { background-color: $btn_blue; }

</style>