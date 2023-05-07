<template>
  <div class="ao3-in-page-bookmark-content">
    <div v-if="chapters" class="navbar">
      <div class="chapter-progress">
        <template v-if="Object.keys(chapters).length > 1">
          <div  class="chapter-progress__bar" v-for="i in curChI" :key="i"></div>
        </template>

        <div class="chapter-progress__bar empty" :class="chapterProgressBarClass(chapters[curChI].progress)">
          <div :style="chapterProgressBarSpanStyle(chapters[curChI].progress)"></div>
          <span v-for="(pos, i) in currentChBMPos" :key="i" :style="{left: `${pos}%`}"></span>
        </div>

        <template v-if="Object.keys(chapters).length > 1">
          <div class="chapter-progress__bar empty" v-for="i in (Object.keys(chapters).length - curChI - 1)" :key="i"></div>
        </template>
      </div>
      <div class="nav-info">
        Chapter {{curChI + 1}}: {{chapters[curChI].title}}
      </div>
    </div>
    <div class="toolbar">
      <span class="bm-para" @click="toggleBookmark">Bookmark by paragraph <span class="bm-icon"></span></span>
      <span class="bm-pos">Bookmark by position <span class="bm-icon"></span></span>
      <button @click="clearLocalStorage">Clear local storage</button>
    </div>
  </div>
    
</template>

<script>
import {ref, computed} from 'vue'
import {onBookmark} from './bookmark'
import {clearLocalStorage} from './store'
import { chapters, curChI , mainContent} from './page'

export default {
  name: 'App',
  setup () {
    const chapterProgressBarClass = progress => {
      return {
        'isCurrent': progress > 0 && progress < 100
      }
    }

    const currentChBMPos = computed(() => {
      const paras = chapters[curChI.value].dom.querySelectorAll(':scope > p')
      const chHeight = chapters[curChI.value].dom.getBoundingClientRect().height
      
      return Object.keys(chapters[curChI.value].paraBM).map(i => {
        return (paras[i].offsetTop + paras[i].offsetHeight) / chHeight * 100
      })
    })

    const chapterProgressBarSpanStyle = progress => {
      return {
        width: `${progress}%`,
        backgroundColor: progress === 100 ? '#444444' : '#444444',
      }
    }

    const bookmarkInProgress = ref(false)
    const toggleBookmark = () => {
      bookmarkInProgress.value = !bookmarkInProgress.value
      mainContent.classList.toggle('bookmarkInProgress', bookmarkInProgress.value)
      onBookmark(bookmarkInProgress.value, chapters)
    }
    return {chapters, curChI, currentChBMPos,
            toggleBookmark, chapterProgressBarClass, chapterProgressBarSpanStyle,
            clearLocalStorage}
  }
}
</script>

<style lang="scss">
.ao3-in-page-bookmark {
  font-family: sans-serif;
  font-size: 17px;

  .navbar {
    position: fixed;
    z-index: 99;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    // max-height: 0;
    // opacity: 0;
    overflow: hidden;
    transition: max-height 0.2s, opacity 0.2s;

    // &.show {max-height: 100px; opacity: 1;}
    
    .nav-info {
      float: right;
      padding: 4px 10px;
      box-sizing: border-box;
      background-color: #FFFFFF;
    }

    .chapter-progress {
      display: flex;
      overflow: hidden;
      background-color: #FFFFFF;

      .chapter-progress__bar {
        position: relative;
        bottom: 0;
        background-color: #444444;
        border-right: 1px solid #FFFFFF;
        box-sizing: border-box;
        transition: height 0.2s, flex 0.2s;
        height: 3px;
        flex: 1;
        
        &.isCurrent {
          flex: 200px;
          height: 6px;
          background-color: #999999;
        }

        &.empty {
          background-color: #999999;
        }

        & > div {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
        }

        & > span {
          position: absolute;
          top: 0;
          width: 0px;
          border-left: 1px solid aqua;
          height: 100%;
          font-size: 10px;
        }
      }
    }
  }

  .toolbar {
    position: fixed;
    z-index: 99;
    right: 0;
    top: 50%;
    padding: 10px;
    transform: translateY(-50%);
    background-color: red;

    & > span {
      display: block;
      padding: 3px 7px;
      margin-bottom: 5px;
      background-color: whitesmoke;
      border-radius: 20px;
      cursor: pointer;
    }
  }
}

#workskin.bookmarkInProgress .userstuff > p:hover {
  background-color: #F5F5F5;
  cursor: pointer;

  &::before {
    content: 'bookmark';
    position: absolute;
    bottom: 0;
    right: 0;
    transform: translateY(100%);
    font-size: 10px;
    background-color: rgb(193, 193, 193);
  }
}

#workskin {
  .userstuff > p {
    position: relative;

    &.bookmarked {
      background-color: whitesmoke;

      &::before {
        content: 'bookmarked';
        position: absolute;
        bottom: 0;
        right: 0;
        transform: translateY(100%);
        font-size: 10px;
        background-color: aqua;
      }

      &:hover {
        background-color: rgb(255, 203, 203);

        &::before {
          content: 'remove bookmark';
          background-color: rgb(253, 158, 158);
        }
      }
    }
  }
}
</style>
