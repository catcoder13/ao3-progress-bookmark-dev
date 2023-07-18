<template>
  <div class="ao3pb-sidebar-group">
    <div class="ao3pb-sidebar">
      <div class="ao3pb-sidebar__button--bookmark">
        <template v-if="mainBM.chI == null">
          <a class="ao3pb-a-button" @click="onBookmarkEntryClick" :class="{exceed: !withinBookmarkLimit}">
            <IpbIcon fill="#FFF" type="add" />
              <div class="ao3pb-bubble">
                <template  v-if="!withinBookmarkLimit">
                  <b>You had reached bookmark limit ({{ BOOKMARK_LIMIT }}).</b>
                  <span>Try to remove some existing bookmarks to create more space for new bookmarks.</span>
                </template>
                <template v-else>Add a new bookmark</template>
              </div>
          </a>
        </template>
        <template v-else>
          <a class="ao3pb-a-button ao3pb-a-button--entry" :href="jumpToBookmarkHref" :class="{bmInOtherPage}" @click="jumpToBM">
            <IpbIcon fill="#FFF" type="location" />
            <div class="ao3pb-bubble">
              <b>Jump to bookmark</b>
              <span v-if="bmInOtherPage" class="ao3pb-warning">
                Bookmark located at Chapter {{ parseInt(mainBM.chI) + 1 }}.<br/>
                Click to redirect to Chapter {{ parseInt(mainBM.chI) + 1 }}
                <IpbIcon type="visit" fill="#999" />
              </span>
            </div>
          </a>
          <a class="ao3pb-a-button ao3pb-a-button--extra" @click="onBookmarkEntryClick">
            <IpbIcon fill="#FFF" type="edit" />
            <div class="ao3pb-bubble">Change bookmark location</div>
          </a>
          <a class="ao3pb-a-button ao3pb-a-button--extra" @click="removeBookmark">
            <IpbIcon fill="#FFF" type="trash" />
            <div class="ao3pb-bubble">Remove bookmark</div>
          </a>
        </template>
      </div>

    </div>
    <div v-if="settings.extraSideBtn" class="ao3pb-sidebar ao3pb-sidebar--extra">
      <a class="ao3pb-a-button" :href="sidebarHref(chICode)" @click="onClick" v-for="({chICode, iconProps, onClick, btnKey, checkIfExternal}, i) in buttons" :key="i">
        <div class="ao3pb-bubble">
          {{ btnLabel(btnKey) }}
          <IpbIcon v-if="checkIfExternal && isExternal[btnKey]" type="visit" fill="#999" />
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
import { chapterInfos, isEntireWork, oneShot, workID } from '../js/static'
import { settings, settingExtraBtn } from '../js/setting'
import { BOOKMARK_LIMIT, EXTRA_BUTTON_INFOS, AO3_DOMAIN } from '@/common/variables'

import IpbIcon from '@/common/IpbIcon.vue'

export default {
  components: { IpbIcon },
  setup () {
    const onBookmarkEntryClick = e => startBookmarkEdit(e, chapters)

    const isExternal = computed(() => {
      if (isEntireWork) return false

      return {
        firstCh: curChI.value > 0,
        prevCh: curChI.value > 0,
        nextCh: curChI.value < chapterInfos.length - 1,
        latestCh: curChI.value < chapterInfos.length - 1 
      }
    })

    const bmInOtherPage = computed(() => !isEntireWork && mainBM.chI != curChI.value)

    const jumpToBM = () => {
      jumpToBookmark(chapters, curChI)
    }

    const jumpToBookmarkHref = computed(() => {
      if (!isEntireWork && mainBM.chI != null &&  mainBM.chI != curChI.value) {
        return `${AO3_DOMAIN}/works/${workID}/chapters/${chapterInfos[mainBM.chI].chID}?ao3pbjump`
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
      
      if (isEntireWork || targetChHash === curChI.value) return `#chapter-${targetChHash + 1}`
      
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
      bmInProgress, settings, bmInOtherPage,
      buttons, btnLabel, isExternal
    }
  }
}
</script>

<style lang="scss">
.ao3pb-sidebar-group {
  position: fixed;
  z-index: 99;
  top: 100px;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ao3pb-sidebar {
  display: flex;
  gap: 3px;
  flex-direction: column;
  align-items: flex-end;

  a.ao3pb-a-button {
    position: relative;
    background-color: $ao3_red;
    width: 23px;
    height: 23px;
    box-sizing: border-box;
    opacity: 0.5;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;

    &:hover {
      opacity: 1;
      transition: opacity 0.2s;

      .ao3pb-bubble {
        display: block;
      }
    }

    &.exceed {
      background-color: #bfbfbf;
      cursor: not-allowed;

      &:active::before { opacity: 0; }

      .ao3pb-bubble {
        white-space: normal;
        width: 250px;

        & > * { display: inline-block; }
        
        b { color: red; padding-bottom: 5px; }
      }
    }
    

    & > .ao3pb-icon {
      transition: transform 0.2s;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: calc(100% - 6px);
      height: calc(100% - 6px);
    }
    

    .ao3pb-bubble {
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

  .ao3pb-sidebar__button--bookmark {
    display: flex;
    flex-direction: row-reverse;

    &:hover {
      a.ao3pb-a-button.ao3pb-a-button--entry { border-radius: 0; }
      a.ao3pb-a-button.ao3pb-a-button--extra {
        display: block;

        &:not(:last-of-type) { border-radius: 0; }
      }
    }

    a.ao3pb-a-button {
      &:hover ~ .ao3pb-a-button { opacity: 0.75; }

      &.ao3pb-a-button--extra {
        display: none;
        color: #FFF;
        text-align: center;

        .ao3pb-bubble { right: 4px; }
      }

      &.bmInOtherPage { background-color: grey; }

      .ao3pb-bubble {
        b {
          display: block;
          padding-bottom: 5px;

          &:only-child {
            font-weight: normal;
            padding-bottom: 0;
          }
        }

        .ao3pb-warning {
          display: block;
          color: #397ce1;
        }
      }
    }
  } //.ao3pb-sidebar__button--bookmark
} // .ao3pb-sidebar

.ao3pb-left .ao3pb-sidebar-group {
  right: auto;
  left: 0;

  .ao3pb-sidebar {
    align-items: flex-start;

    a.ao3pb-a-button {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;

      .ao3pb-bubble {
        right: auto;
        left: 24px;
      }
    }

    .ao3pb-sidebar__button--bookmark {
      flex-direction: row;
      
      & > a.ao3pb-a-button {
        .ao3pb-bubble {
          right: auto;
          left: 24px;
        }

        &.ao3pb-a-button--extra .ao3pb-bubble { right: auto; left: 4px; }
      }
    }
  }
}

.ao3pb-sidebar.ao3pb-sidebar--extra > a { background-color: $btn_blue; }

</style>