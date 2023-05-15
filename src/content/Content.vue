<template v-if="chapters">
  <NavBar :chapters="chapters" :curChI="curChI"></NavBar>

  <div class="toolbar" :class="{'inView': showToolbar}" @mouseenter="showToolbar = true" @mouseleave="showToolbar = false">
    <span class="bm-pos" @click="togglePercBookmark">{{canBookmarkPerc ? 'Stop' : 'Add'}} bookmark</span>
    <button @click="clearLocalStorage">Clear local storage</button>
  </div>

  <BookmarkEditor v-if="canBookmarkPerc" :chapters="chapters" @finish="onBookmarkEnd"></BookmarkEditor>
  
  <BookmarkElem v-if="canShowBookmark" :chapters="chapters" :class={canBookmarkPerc}></BookmarkElem>
</template>

<script>
import {ref, computed} from 'vue'
import {clearLocalStorage} from './store'
import {chapters, curChI} from './page'
import { mainBM } from './bookmark'

import NavBar from './components/NavBar.vue'
import BookmarkElem from './components/BookmarkElem.vue'
import BookmarkEditor from './components/BookmarkEditor.vue'

import { fullViewMode, mainContent } from './static'

export default {
  name: 'App',
  components: {NavBar, BookmarkElem, BookmarkEditor},
  setup () {
    const showToolbar = ref(false)
    const canBookmarkPerc = ref(false)

    const togglePercBookmark = e => {
      canBookmarkPerc.value = !canBookmarkPerc.value
      mainContent.classList.toggle('bmInProgress', canBookmarkPerc.value)
    } // togglePercBookmark

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

    const scrollToPrevBM = () => {

    }

    const scrollToNextBM = () => {

    }

    return {chapters, curChI, showToolbar, canBookmarkPerc, canShowBookmark,
            togglePercBookmark,onBookmarkEnd,
            scrollToPrevBM, scrollToNextBM,
            clearLocalStorage}
  }
}
</script>

<style lang="scss">
.ao3-in-page-bookmark {
  font-family: sans-serif;
  font-size: 17px;

  .toolbar {
    position: fixed;
    z-index: 99;
    right: 0;
    top: 100px;
    padding: 10px;
    transform: translateX(100%);
    background-color: red;
    font-size: 10px;
    transition: transform 0.2s;

    &::before {
      content: '';
      position: absolute;
      top: 5px;
      left: -20px;
      width: 20px;
      height: 20px;
      background-color: red;

    }

    &.inView {
      transform: translateX(0);
    }

    & > span {
      display: block;
      padding: 3px 7px;
      margin-bottom: 5px;
      background-color: whitesmoke;
      border-radius: 20px;
      cursor: pointer;
    }

    .bm-nav {
      margin-bottom: 5px;

      span {
        display: inline-block;
        background-color: whitesmoke;
        border-radius: 20px;
        padding: 3px 10px;
        cursor: pointer;
        transform: scale(0.9);
        transition: transform 0.2s;

        &:hover {
          transform: scale(1);
        }
      }
    }
  }
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
</style>
