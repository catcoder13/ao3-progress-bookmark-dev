<template v-if="chapters">
  <div class="ipb-toolbar" v-if="!bmInProgress" :class="{'ipb-left': !settings.bmAtRight}">

    <div class="ipb-toolbar__item" @click="e => toggleBookmarkEdit(e, chapters)" :style="{top: 0}">
      <IpbIcon type="location" fill="#FFF"></IpbIcon>
      <b class="ipb-toolbar__item-desc">{{mainBM.chI ? 'Change bookmark location' : 'Add a new bookmark'}}</b>
    </div>

    <div v-if="mainBM.chI" class="ipb-toolbar__item" :class="{bmOnOtherCh: !fullViewMode && mainBM.chI != curChI}"
      @click="jumpToBookmark" :style="{top: 'calc(30px + 4px)'}">
      <IpbIcon type="jump" fill="#FFF"></IpbIcon>
      <b v-if="fullViewMode || mainBM.chI == curChI" class="ipb-toolbar__item-desc">Jump to bookmark</b>
      <div v-else class="ipb-toolbar__item-desc">
        <b>Jump to bookmark</b>
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
  </div>
  
  <IpbEditor v-if="bmInProgress" :chapters="chapters" :class="{'ipb-left': !settings.bmAtRight}"></IpbEditor>
  
  <IpbBookmark :class="{highlight: bmFocusCountDown, bmInProgress, 'ipb-left': !settings.bmAtRight}" v-if="canShowBookmark" :chapters="chapters"></IpbBookmark>

  <IpbNavbar v-if="settings.showNav"></IpbNavbar>
</template>

<script>
import {ref, computed} from 'vue'
import {chapters, curChI, onScroll} from './page'
import { mainBM, bmInProgress, toggleBookmarkEdit } from './bookmark'
import { fullViewMode, mainContent } from './static'
import { settings } from './setting'

import IpbBookmark from '@/content/components/IpbBookmark.vue'
import IpbEditor from '@/content/components/IpbEditor.vue'
import IpbIcon from '@/common/IpbIcon.vue'
import IpbNavbar from './components/IpbNavbar.vue'

export default {
  name: 'App',
  components: { IpbNavbar, IpbEditor, IpbBookmark, IpbIcon },
  setup () {
    const showToolbar = ref(false)
    const bmFocusCountDown = ref(0)

    const canShowBookmark = computed(() => {
      if (!mainBM.chI) return false
      if (fullViewMode) return true

      return mainBM.chI == curChI.value
    })

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
      // if (bmPos > window.scrollY && bmPos < window.scrollY + window.innerHeight) {
      //   window.scrollTo({top: targetScroll, behavior: 'smooth'})
      // } else window.scrollTo({top: targetScroll})
      onScroll(null, targetScroll)

      bmFocusCountDown.value = true
      if (!countDownInt) clearTimeout(countDownInt)
      countDownInt = setTimeout(() => {
        bmFocusCountDown.value = false
      }, 2000)
    }

    return {
      chapters, mainBM, curChI, bmFocusCountDown, fullViewMode,
      showToolbar, bmInProgress, canShowBookmark, mainContent,
      toggleBookmarkEdit, jumpToBookmark, settings
    }
  }
}
</script>

<style lang="scss">
.ao3-in-page-bookmark {
  font-family: sans-serif;
  font-size: 17px;
  user-select: none;

  .ipb-toolbar {
    position: fixed;
    z-index: 99;
    top: 100px;
    right: 0;
    text-align: right;

    .ipb-toolbar__item {
      position: absolute;
      right: 0;
      transform: translateX(100%);
      min-height: 30px;
      pointer-events: all;
      cursor: pointer;
      font-size: 12px;
      transition: transform 0.2s;
      opacity: 0.6;

      &:hover { transform: translateX(0); opacity: 1; z-index: 1;}
      &:active {background-color: green;}
      & > * { vertical-align: middle; }

      & > .ipb-icon {
        position: absolute;
        top: 0;
        left: -30px;
        height: 20px;
        width: 20px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        background-color: $ao3_red; 
        padding: 5px;
      }

      .ipb-toolbar__item-desc {
        display: inline-block;
        color: #FFF;
        font-size: 13px;
        vertical-align: top;
        white-space: nowrap;
        padding: 9px 5px 9px 0;
        line-height: 12px;
        background-color: $ao3_red; 
      }

      &.bmOnOtherCh {
        cursor: default;
        text-align: left;

        & > * { background-color: #555; }

        .ipb-toolbar__item-desc { 
          padding: 9px;
          white-space: normal;

          & > * {
            display: inline-block;
            margin-bottom: 5px;
            font-size: 12px;

            &:first-child {
              white-space: nowrap;
              margin-bottom: 10px;
              font-size: 13px;
            }
          }

          span.ipb-warning { color: #ffcdcd; white-space: nowrap; }

          .ipb-btn {
            white-space: nowrap;

            a {
              font-size: 11px;
              text-decoration: none;
              border-bottom: none;
              cursor: pointer;
              margin-right: 5px;

              &:hover { filter: brightness(0.95); }

              button {
                cursor: pointer;
              } 
            }
          }
        }
      }
    } // .ipb-toolbar__item
  } // .ipb-toolbar

  .ipb-toolbar.ipb-left {
    position: fixed;
    right: auto;
    left: 0;

    .ipb-toolbar__item {
      right: auto;
      left: 0;
      transform: translateX(-100%);

      &:hover { transform: translateX(0); }

      b { 
        padding-left: 5px;
      }
      
      & > .ipb-icon {
        left: auto;
        right: -30px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
      }
    }
    
  }

} // ao3-in-page-bookmark

#workskin {
  // .chapter {
  //   position: relative;
  // }

  &.bmInProgress #chapters > .chapter,
  &.bmInProgress.oneshot #chapters {
    background-color: rgba(#aaaaaa, 0.3);
  }
}
</style>
