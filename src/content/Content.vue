<template v-if="chapters">
  <NavBar></NavBar>

  <div class="toolbar" v-if="!canBookmarkPerc">
    <div class="item bookmark" :class="{selected: canBookmarkPerc}" @click="toggleBookmarkEdit" :style="{top:0}">
      <BookmarkIcon class="icon" :mode="1"></BookmarkIcon>
      <span class="item-desc">Update bookmark</span>
    </div>
    <div v-if="mainBM.chI" class="item skip" :class="{bmOnOtherCh: !fullViewMode && mainBM.chI != curChI}"
      @click="jumpToBookmark" :style="{top: 'calc(30px + 4px)'}">
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path fill="#FFF" d="M21.64136,73.76636,12.241,62.0769,27.25806,49.99976,12.241,37.9231l9.40039-11.68946L51.1936,49.99976ZM87.759,49.99976,58.20728,26.23413l-9.4004,11.68848L63.82349,49.99976,48.80688,62.0769l9.4004,11.68946Z" />
      </svg>

      <span v-if="fullViewMode || mainBM.chI == curChI" class="item-desc">Jump to bookmark</span>
      <div class="item-desc" v-else>
        <span>Jump to bookmark</span>
        <span class="warning">Bookmark is located in <b>Chapter {{ parseInt(mainBM.chI) + 1 }}</b></span>
        <a :href="mainBM.link" class="jumpBtn">Visit Chapter {{ parseInt(mainBM.chI) + 1 }}</a>
        <a :href="mainBM.fwLink" class="jumpBtn">Visit Entire Work</a>
      </div>
    </div>
  </div>
  
  <BookmarkEditor v-if="canBookmarkPerc" :chapters="chapters" @finish="onBookmarkEnd"></BookmarkEditor>
  
  <BookmarkElem :class="{highlight: bmFocusCountDown, canBookmarkPerc}" v-if="canShowBookmark" :chapters="chapters"></BookmarkElem>
</template>

<script>
import {ref, computed} from 'vue'
import {clearLocalStorage} from './store'
import {chapters, curChI, onScroll} from './page'
import { mainBM } from './bookmark'

import NavBar from './components/NavBar.vue'
import BookmarkElem from './components/BookmarkElem.vue'
import BookmarkEditor from './components/BookmarkEditor.vue'
import BookmarkIcon from './components/BookmarkIcon.vue'

import { fullViewMode, mainContent } from './static'

export default {
  name: 'App',
  components: {NavBar, BookmarkElem, BookmarkEditor, BookmarkIcon},
  setup () {
    const showToolbar = ref(false)
    const canBookmarkPerc = ref(false)

    const bmFocusCountDown = ref(0)

    const toggleBookmarkEdit = e => {
      canBookmarkPerc.value = !canBookmarkPerc.value
      mainContent.classList.toggle('bmInProgress', canBookmarkPerc.value)
    } // toggleBookmarkEdit

    const onBookmarkEnd = () => {
      console.log('on bookmark end')
      mainContent.classList.toggle('bmInProgress', false)
      canBookmarkPerc.value = false
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
      const targetScroll = top + height * mainBM.perc - window.innerHeight / 2 + 90
      window.scrollTo({top: targetScroll})
      onScroll(null, targetScroll)

      bmFocusCountDown.value = true
      if (!countDownInt) clearTimeout(countDownInt)
      countDownInt = setTimeout(() => {
        bmFocusCountDown.value = false
      }, 2000)
    }

    return {
      chapters, mainBM, curChI, bmFocusCountDown, fullViewMode,
      showToolbar, canBookmarkPerc, canShowBookmark,
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

  .toolbar {
    position: fixed;
    z-index: 99;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    text-align: right;
    height: 60px;

    .item {
      position: absolute;
      right: 0;
      transform: translateX(100%);
      height: 30px;
      cursor: pointer;
      font-size: 12px;
      transition: transform 0.2s;
      opacity: 0.6;

      &:hover { transform: translateX(0); opacity: 1;}

      & > * { vertical-align: middle; background-color: $ao3_red; }

      .icon {
        position: absolute;
        top: 0;
        left: -30px;
        height: 20px;
        width: 20px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        padding: 5px;
      }

      .item-desc {
        display: inline-block;
        color: #FFF;
        font-size: 13px;
        font-weight: 700;
        vertical-align: top;
        white-space: nowrap;
        padding: 9px 5px 9px 0;
        line-height: 12px;
      }

      &.bmOnOtherCh {
        cursor: default;
        text-align: left;

        & > * { background-color: #555; }

        .item-desc { 
          padding: 9px;
          white-space: normal;

          span:first-child {
            display: inline-block;
            white-space: nowrap;
          }

          span {
            display: inline-block;
            margin-bottom: 5px;
          }

          span.warning {
            color: #ffcdcd;
            font-weight: 100;
            font-size: 12px;
          }

          a.jumpBtn {
            cursor: pointer;
            display: block;
            transform: scale(0.95);
            background-color: #eee;
            border-radius: 10px;
            color: #333;
            padding: 5px 10px;
            margin-bottom: 5px;
            transition: transform 0.2s;
            white-space: nowrap;

            &:hover { transform: scale(1); }
          }
        }
      }
    }
  } // .toolbar

  .perc-bm.highlight:not(.tooClose) .cross svg { animation: bookmarkFade 0.5s 4 alternate; }
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
