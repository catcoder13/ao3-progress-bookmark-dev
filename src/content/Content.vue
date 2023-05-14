<template v-if="chapters">
  <NavBar :chapters="chapters" :curChI="curChI"></NavBar>

  <div class="toolbar" :class="{'inView': showToolbar}" @mouseenter="showToolbar = true" @mouseleave="showToolbar = false">
    <span class="bm-pos" @click="togglePercBookmark">{{canBookmarkPerc ? 'Stop' : 'Add'}} bookmark</span>
    <span class="prev-bm-button">Prev</span>
    <span class="next-bm-button">Next</span>
    <button @click="clearLocalStorage">Clear local storage</button>
  </div>

  <BookmarkEditor v-if="canBookmarkPerc" :chapters="chapters" @finish="onBookmarkEnd"></BookmarkEditor>
  
  <BookmarkElems :chapters="chapters" :curChI="curChI" :canBookmarkPerc="canBookmarkPerc"></BookmarkElems>
</template>

<script>
import {ref} from 'vue'
import {clearLocalStorage} from './store'
import {chapters, curChI} from './page'

import NavBar from './components/NavBar.vue'
import BookmarkElems from './components/BookmarkElems.vue'
import BookmarkEditor from './components/BookmarkEditor.vue'

import { mainContent } from './static'

export default {
  name: 'App',
  components: {NavBar, BookmarkElems, BookmarkEditor},
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

    return {chapters, curChI, showToolbar, canBookmarkPerc, 
            togglePercBookmark,onBookmarkEnd,
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

@keyframes bookmarkFade {
  0% {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }

  100% {
    opacity: 0.5;
    transform: translateY(-50%) scale(1.2);
  }
}
</style>
