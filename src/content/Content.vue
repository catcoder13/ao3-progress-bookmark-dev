<template>
  <div class="ao3-in-page-bookmark-content">
    <div v-if="chapters" :class="navbarClass()">
      <div class="chapter-progress">
        <div :class="chapterProgressBarClass(progress)" v-for="({ch, progress}) in chapterProgress" :key="ch">
          <div :style="chapterProgressBarSpanStyle(progress)">
            <!-- <span>{{progress}}%</span> -->
          </div>
        </div>
      </div>
      <div class="nav-info">
        Chapter {{curChI + 1}}: {{chapters[curChI.toString()].title}}
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
import { computed } from 'vue'
import {toggleBookmark, bookmarkInProgress} from './bookmark'
import {clearLocalStorage} from './store'
import { chapters, curChI } from './page'

export default {
  name: 'App',
  setup () {
    const chapterProgress = computed(() => {
      return Object.keys(chapters).map(chI => ({ch: chI + 1, progress: chapters[chI].progress, title: chapters[chI].title}))
    })

    const navbarClass = () => {
      return {
        navbar: true,
        show: chapterProgress.value[0].progress > 0
      }
    }

    const chapterProgressBarClass = progress => {
      return {
        'chapter-progress__bar': true,
        'isCurrent': progress > 0 && progress < 100
      }
    }

    const chapterProgressBarSpanStyle = progress => {
      return {
        width: `${progress}%`,
        backgroundColor: progress === 100 ? '#444444' : '#444444',
        
      }
    }
    return {chapters, chapterProgress, curChI,
            toggleBookmark, bookmarkInProgress, navbarClass, chapterProgressBarClass, chapterProgressBarSpanStyle,
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
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition: max-height 0.2s, opacity 0.2s;

    &.show {max-height: 100px; opacity: 1;}
    
    .nav-info {
      float: right;
      padding: 4px 10px;
      box-sizing: border-box;
      background-color: #FFFFFF;
    }

    .chapter-progress {
      display: flex;
      height: 8px;
      overflow: hidden;
      background-color: #FFFFFF;

      .chapter-progress__bar {
        position: relative;
        bottom: 0;
        background-color: #999999;
        border-right: 1px solid #FFFFFF;
        box-sizing: border-box;
        transition: height 0.2s, flex 0.2s;
        height: 4px;
        flex: 1;
        
        &.isCurrent {
          flex: 200px;
          height: 8px;
        }

        & > div {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;

          span {
            position: absolute;
            right: 0;
            font-size: 10px;
          }
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

#workskin.bookmarkInProgress .chapter [role=article] > p:hover {
  background-color: #F5F5F5;
  cursor: pointer;
}

#workskin {
  [role=article] > p {
    position: relative;

    span.bookmarkIcon {
      display: inline-block;
      width: 50px;
      height: 50px;
      background-color: aqua;
    }
  }
}
</style>
