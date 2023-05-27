<template>
  <div class="ipb-sidebar-group">
    <div class="ipb-sidebar">
      <button @click="startBookmark">
        <span class="ipb-btn-child"><IpbIcon fill="#FFF" type="location"></IpbIcon></span>
        <div class="ipb-sidebar__item-desc"><b>{{ mainBM.chI != null ? 'Change bookmark location' : 'Add a new bookmark' }}</b></div>
      </button>

      <button v-if="mainBM.chI != null" @click="jumpToBookmark" :class="{bmOnOtherCh: !fullViewMode && mainBM.chI != curChI}">
      <span class="ipb-btn-child"><IpbIcon fill="#FFF" type="jump"></IpbIcon></span>
      <div class="ipb-sidebar__item-desc">
        <b>Jump to bookmark</b>
        <div v-if="!fullViewMode && mainBM.chI != curChI" class="ipb-desc">
          <span class="ipb-warning">
            Bookmark located at Chapter {{ parseInt(mainBM.chI) + 1 }}.<br/>
            Visit Chapter {{ parseInt(mainBM.chI) + 1 }} via:
          </span>
          <div class="ipb-btn">
            <a :href="mainBM.fwLink"><button>Entire Work</button></a>
            <a :href="mainBM.link"><button>Chapter by chapter</button></a>
          </div>
        </div>
      </div>
    </button>
  </div>
  <div v-if="settings.extraSideNav" class="ipb-sidebar ipb-sidebar--extra">
    <button class="ipb-extra" @click="eventRef[eventKey]" v-for="({label, iconProp, eventKey}, i) in buttons" :key="i">
      <span class="ipb-btn-child"><IpbIcon v-bind="iconProp"></IpbIcon></span>
      <div class="ipb-sidebar__item-desc"><b>{{ label }}</b></div>
    </button>
  </div>


</div>
</template>

<script>
import { computed } from 'vue'
import {chapters, curChI, onScroll} from '../js/page'
import { mainBM, bmInProgress, bmFocusCountDown, startBookmarkEdit } from '../js/bookmark'
import { fullViewMode } from '../js/static'
import { settings } from '../js/setting'
import IpbIcon from '@/common/IpbIcon.vue'

const extraButtons = [
  {label: 'Back to top', eventKey: 'onBackToTop', iconProp: {fill: '#FFF', type: 'top'}, extra: true},
  {label: 'First chapter', eventKey: 'onFirstChapter', iconProp: {fill: '#FFF', type: 'next-last', open: false}, extra: true},
  {label: 'Previous chapter', eventKey: 'onPreviousChapter', iconProp: {fill: '#FFF', type: 'next', open: false}, extra: true},
  {label: 'Next chapter', eventKey: 'onNextChapter', iconProp: {fill: '#FFF', type: 'next', open: true}, extra: true},
  {label: 'Latest chapter', eventKey: 'onLastestChapter', iconProp: {fill: '#FFF', type: 'next-last', open: true}, extra: true},
  {label: 'Jump to comment', eventKey: 'onJumpToComment', iconProp: {fill: '#FFF', type: 'speech'}, extra: true}
]

export default {
  components: { IpbIcon },
  setup () {

    const startBookmark = e => startBookmarkEdit(e, chapters)

    let countDownInt = null
    const jumpToBookmark = () => {
      if (!fullViewMode && mainBM.chI != curChI.value) {
        console.log('bookmark is located at another chapter')
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
      }, 2000)
    }
    const eventRef = {
      onBackToTop () {
        document.getElementById('main').scrollIntoView()
      },
      onFirstChapter () {

      },
      onPreviousChapter () {

      },
      onNextChapter () {

      },
      onLastestChapter () {

      },
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
      return extraButtons
    })

    return {
      mainBM, curChI, startBookmark, jumpToBookmark,
      bmInProgress, fullViewMode, settings,
      buttons, eventRef
    }
  }
}
</script>

<style lang="scss">
.ipb-sidebar-group {
  position: fixed;
  z-index: 99;
  top: 75px;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ipb-sidebar {
  display: flex;
  gap: 2px;
  flex-direction: column;
  align-items: flex-end;

  & > button {
    position: relative;
    transform: translateX(100%);
    line-height: 1;
    padding: 0 4px;
    background: $ao3_red;
    cursor: pointer;
    opacity: 0.5;

    &:hover { 
      transform: translateX(0);
      opacity: 1;
      z-index: 1;
      transition: transform 0.2s, opacity 0.2s;
    }

    &.bmOnOtherCh {
      background-color: grey;
      cursor: default;
      min-width: 240px;

      &:active::before,
      &:active .ipb-btn-child::before { opacity: 0; }

      & > .ipb-btn-child {
        background-color: grey;
      }

      & > .ipb-sidebar__item-desc .ipb-desc {
        background-color: grey;
      }
      
    }

    & > span.ipb-btn-child {
      background-color: $ao3_red;
      position: absolute;
      top: 0;
      left: 0;
      transform: translateX(calc(-100% + 1px));
      height: 100%;

      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;

      .ipb-icon {
        width: 100%;
        height: 100%;
        padding: 5px;
        box-sizing: border-box;
      }

    }

    & > div.ipb-sidebar__item-desc {
      position: relative;
      font-size: 11px;

      b {
        line-height: 1;
        color: #FFF;
      }

      .ipb-desc {
        position: absolute;
        top: calc(100% + 3px);
        right: 20px;
        width: calc(100% - 20px);
        white-space: break-spaces;
        padding: 10px;
        box-sizing: border-box;
        text-align: left;
        color: #FFF;

        .ipb-warning { color: #ffd0d0; }

        .ipb-btn {
          white-space: nowrap;
          padding-top: 5px;

          a button {
            cursor: pointer;
            padding: 3px 8px;
            border-radius: 2px;
            margin-right: 4px;

            &:hover {
              filter: brightness(0.9);
            }
          }
        }
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
      transform: translateX(-100%);

      &:hover { transform: translateX(0); }

      & > .ipb-btn-child {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;

        left: auto;
        right: 0;
        transform: translateX(calc(100% - 1px));
      }

      & > .ipb-sidebar__item-desc .ipb-desc {
        right: auto;
        left: 20px;
      }
    }
  }
}

.ipb-sidebar.ipb-sidebar--extra {
  & > button,
  & > button > .ipb-btn-child,
  & > button > .ipb-sidebar__item-desc,
  & > button > .ipb-sidebar__item-desc .ipb-desc {
    background-color: $btn_blue;
  }
}
</style>