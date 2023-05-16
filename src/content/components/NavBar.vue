<template>
  <div class="navbar" :class="navBarClass()">
    <div class="chapter-progress">
      <template v-if="fullViewMode && Object.keys(chapters).length > 1">
        <div class="chapter-progress__bar" v-for="({progress}, chI) in chapters" :key="chI"
          @click="() => jumpToChapter(chI)"
          :class="chapterProgressBarClass(chI)" :title="`Chapter ${parseInt(chI) + 1} : ${chapters[chI].title}`">
          <div class="progress" v-if="chI == curChI" :style="{width: `${progress}%`}"></div>
          <span v-if="chI == curChI && mainBM.chI && mainBM.chI == curChI && progress > 0 && progress < 100"
            :style="{left: `${mainBM.perc * 100}%`}"
            :title="`Bookmarked at Chapter ${parseInt(chI) + 1} | progress: ${(mainBM.perc * 100).toFixed(2)}%`"></span>
          <!-- <div class="chapter-info">
            Chapter {{parseInt(chI) + 1}}: {{chapters[chI].title}}
          </div> -->
        </div>
      </template>
      <div v-else class="chapter-progress__bar isCurrent">
        <div class="progress" :style="{width: `${chapters[curChI].progress}%`}"></div>
        <span v-if="mainBM.chI == curChI" :style="{left: `${mainBM.perc * 100}%`}"
          :title="`Bookmarked at Chapter ${parseInt(mainBM.chI) + 1} | progress: ${(mainBM.perc * 100).toFixed(2)}%`"></span>
          <!-- <div class="chapter-info">
            Chapter {{parseInt(chI) + 1}}: {{chapters[chI].title}}
          </div> -->
        </div>
    </div>
  </div>
</template>

<script>
import { mainBM } from '../bookmark'
import { chapters, curChI, onScroll } from '../page'
import {fullViewMode} from '../static'
import {mousePos} from '../cursor'

export default {
  setup () {
    const navBarClass = () => {
      const chIs = Object.keys(chapters)
      const enterView = chIs[0] < curChI.value || chapters[curChI.value].progress > 0
      const exitView = chapters[chIs[chIs.length - 1]].progress == 100
      return {
        show: enterView && !exitView,
        fullViewMode: fullViewMode
      }
    }

    const chapterProgressBarClass = chI => {
      const {progress} = chapters[chI]
      return {
        'isCurrent': !fullViewMode || (chI == curChI.value && progress > 0 && progress < 100),
        'hasBM': mainBM.chI && mainBM.chI === chI,
        'empty': chI >= curChI.value && progress < 100
      }
    }

    const jumpToChapter = chI => {
      if (curChI.value == chI) return
      const targetScroll = chapters[chI].top
      window.scrollTo({top: targetScroll})
      onScroll(null, targetScroll)
    }

    return {
      chapters, curChI,
      mainBM, fullViewMode, navBarClass, chapterProgressBarClass,
      jumpToChapter
    }
  }
}
</script>

<style lang="scss">
$bar_color: #777777;
$bar_darken_color: #333333;

$ao3_red: #900;
$ao3_grey: #a7a7a7;

.navbar {
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  width: 100%;

  &:not(.show) .chapter-progress .chapter-progress__bar.isCurrent {
    flex: 1;
    height: 3px;
  }

  &:not(.fullViewMode) .chapter-progress .chapter-progress__bar,
  &:not(.fullViewMode) .chapter-progress .chapter-progress__bar.hasBM,
  &.fullViewMode .chapter-progress .chapter-progress__bar.isCurrent.hasBM {
    border-bottom: none;
  }

  &.fullViewMode .chapter-progress__bar {
    cursor: pointer;

    &:hover {
      height: 100%;
      .chapter-info { display: inline-block;}
    }
  }

  .chapter-progress {
    display: flex;
    background-color: #FFFFFF;
    height: 7px;

    .chapter-progress__bar {
      position: relative;
      bottom: 0;
      box-sizing: border-box;
      transition: height 0.2s, flex 0.2s;
      height: 3px;
      flex: 1;
      background-color: $bar_darken_color;

      &:not(:last-child) { margin-right: 1px;}

      // &:hover {
      //   height: 100%;
      //   .chapter-info { display: inline-block;}
      // }
      
      &.empty { background-color: $bar_color; }

      &.isCurrent {
        flex: 200px;
        height: 100%;
        background-color: $ao3_grey;
        cursor: default;

        .progress {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background-color: $bar_darken_color;
        }
      }

      &.hasBM { border-bottom: 3px solid $ao3_red; }

      & > span {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 4px;
        height: 100%;
        background-color: red;
      }
      
      .chapter-info {
        position: absolute;
        left: 0;
        top: 6px;
        display: none;
        font-size: 12px;
        line-height: 1;
        padding: 4px 10px;
        box-sizing: border-box;
        background-color: rgba(#FFFFFF, 0.5);
        pointer-events: none;
      }
    } // chapter-progress__bar
  }
} // navbar
</style>