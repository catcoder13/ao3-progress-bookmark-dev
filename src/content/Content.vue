<template v-if="chapters">
  <IpbNavbar :bmInProgress="bmInProgress"></IpbNavbar>

  <div class="ipb-toolbar" v-if="!bmInProgress">
    <div class="ipb-toolbar__item" @click="toggleBookmarkEdit" :style="{top:0}">
      <IpbIcon type="bookmark" fill="#FFF"></IpbIcon>
      <b class="ipb-toolbar__item-desc">{{mainBM.chI ? 'Change bookmark location' : 'Add a new bookmark'}}</b>
    </div>
    <div v-if="mainBM.chI" class="ipb-toolbar__item" :class="{bmOnOtherCh: !fullViewMode && mainBM.chI != curChI}"
      @click="jumpToBookmark" :style="{top: 'calc(30px + 4px)'}">
      <IpbIcon type="jump" fill="#FFF"></IpbIcon>
      <b v-if="fullViewMode || mainBM.chI == curChI" class="ipb-toolbar__item-desc">Jump to bookmark</b>
      <div v-else class="ipb-toolbar__item-desc">
        <b>Jump to bookmark</b>
        <span>You are currently at Chapter {{ parseInt(curChI) + 1 }}'s <b>single chapter page.</b></span>
        <span class="ipb-warning">Bookmark is located at <b>Chapter {{ parseInt(mainBM.chI) + 1 }}.</b></span>
        <span>Visit Chapter {{ parseInt(mainBM.chI) + 1 }}:</span>
        <a :href="mainBM.link">Single chapter page</a>
        <a :href="mainBM.fwLink">Entire Work page</a>
      </div>
    </div>
  </div>
  
  <IpbEditor v-if="bmInProgress" :chapters="chapters" @finish="onBookmarkEnd"></IpbEditor>
  
  <IpbBookmark :class="{highlight: bmFocusCountDown, bmInProgress}" v-if="canShowBookmark" :chapters="chapters"></IpbBookmark>
</template>

<script>
import {ref, computed} from 'vue'
import {clearLocalStorage} from './store'
import {chapters, curChI, onScroll} from './page'
import { mainBM } from './bookmark'

import IpbNavbar from './components/IpbNavbar.vue'
import IpbBookmark from './components/IpbBookmark.vue'
import IpbEditor from './components/IpbEditor.vue'

import { fullViewMode, mainContent } from './static'
import IpbIcon from './components/IpbIcon.vue'

export default {
  name: 'App',
  components: { IpbNavbar, IpbEditor, IpbBookmark, IpbIcon },
  setup () {
    const showToolbar = ref(false)
    const bmInProgress = ref(false)

    const bmFocusCountDown = ref(0)

    const toggleBookmarkEdit = e => {
      bmInProgress.value = !bmInProgress.value
      mainContent.classList.toggle('bmInProgress', bmInProgress.value)
    } // toggleBookmarkEdit

    const onBookmarkEnd = () => {
      console.log('on bookmark end')
      mainContent.classList.toggle('bmInProgress', false)
      bmInProgress.value = false
    }

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
      const targetScroll = bmPos - window.innerHeight / 2 + 90

      window.scrollTo({top: targetScroll, behavior: 'smooth'})
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
      showToolbar, bmInProgress, canShowBookmark,
      toggleBookmarkEdit, onBookmarkEnd, jumpToBookmark,
      clearLocalStorage
    }
  }
}
</script>

<style lang="scss">
$ao3_red: #900;

.ao3-in-page-bookmark {
  font-family: sans-serif;
  font-size: 17px;

  .ipb-toolbar {
    position: fixed;
    z-index: 99;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    text-align: right;
    height: 60px;

    .ipb-toolbar__item {
      position: absolute;
      right: 0;
      transform: translateX(100%);
      height: 30px;
      pointer-events: all;
      cursor: pointer;
      font-size: 12px;
      transition: transform 0.2s;
      opacity: 0.6;

      &:hover { transform: translateX(0); opacity: 1;}
      &:active {background-color: green;}
      & > * { vertical-align: middle; background-color: $ao3_red; }

      .ipb-icon {
        position: absolute;
        top: 0;
        left: -30px;
        height: 20px;
        width: 20px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
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

          a {
            cursor: pointer;
            display: block;
            transform: scale(0.97);
            background-color: #eee;
            border-radius: 10px;
            color: #333;
            padding: 5px 10px;
            margin-bottom: 5px;
            transition: transform 0.2s;
            white-space: nowrap;
            font-weight: 700;

            &:hover { transform: scale(1); }
          }
        }
      }
    }
  } // .ipb-toolbar

  .ipb-bookmark.highlight:not(.tooClose) .ipb-icon { animation: bookmarkFade 0.5s 4 alternate; }
} // ao3-in-page-bookmark

#workskin {
  .chapter {
    position: relative;
  }

  &.bmInProgress #chapters > .chapter,
  &.bmInProgress.oneshot #chapters {
    background-color: rgba(#aaaaaa, 0.3);
  }
}

@keyframes bookmarkFade {
  0% {
    opacity: 0.3;
    transform: scale(1);
  }

  100% {
    opacity: 1;
    transform: scale(0.9);
  }
}
</style>
