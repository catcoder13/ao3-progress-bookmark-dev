<template>
  <div class="navbar" :class="navBarClass()">
    <div class="chapter-progress">
      <div class="chapter-progress__bar" v-for="({progress, percBM}, chI) in chapters" :key="chI"
        :class="chapterProgressBarClass(chI)">
        <div class="progress" v-if="chI == curChI" :style="{width: `${progress}%`}"></div>
        <template v-if="chI == curChI && percBM.length > 0 && progress > 0 && progress < 100">
          <span v-for="(pos, i) in currentChBMPos" :key="i" :style="{left: `${pos}%`}"></span>
        </template>
        <div class="chapter-info">
          Chapter {{chI + 1}}: {{chapters[chI].title}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import {fullViewMode} from '../static'
export default {
  props: ['chapters', 'curChI'],
  setup (props) {
    const navBarClass = () => {
      const chIs = Object.keys(props.chapters)
      const enterView = chIs[0] < props.curChI || props.chapters[props.curChI].progress > 0
      const exitView = props.chapters[chIs[chIs.length - 1]].progress == 100
      return {
        show: enterView && !exitView,
        fullViewMode: fullViewMode
      }
    }

    const chapterProgressBarClass = chI => {
      return {
        'isCurrent': chI == props.curChI && props.chapters[chI].progress < 100,
        'hasBM': props.chapters[chI].percBM.length > 0,
        'empty': chI >= props.curChI && props.chapters[chI].progress < 100
      }
    }

    const currentChBMPos = computed(() => props.chapters[props.curChI].percBM.map(({perc}) => perc * 100))

    return {navBarClass, chapterProgressBarClass, currentChBMPos}

  }
}
</script>

<style lang="scss">
$bm_color: #9cdddd;
$bm_darken_color: #22a5a5;
$bar_color: #777777;
$bar_darken_color: #333333;

.navbar {
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  width: 100%;

  &:not(.show) .chapter-progress .chapter-progress__bar.isCurrent {
    flex: 1;
    height: 5px;
  }

  &:not(.fullViewMode) .chapter-progress .chapter-progress__bar,
  &:not(.fullViewMode) .chapter-progress .chapter-progress__bar.hasBM,
  &.fullViewMode .chapter-progress .chapter-progress__bar.isCurrent.hasBM {
    border-bottom: none;
  }

  .chapter-progress {
    display: flex;
    background-color: #FFFFFF;
    height: 7px;

    .chapter-progress__bar {
      position: relative;
      bottom: 0;
      background-color: $bar_darken_color;
      box-sizing: border-box;
      transition: height 0.2s, flex 0.2s;
      height: 5px;
      flex: 1;

      &:not(:last-child) {
        margin-right: 1px;
      }
      
      &.isCurrent {
        flex: 200px;
        height: 100%;
        background-color: $bar_color;

        .progress {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background-color: $bar_darken_color;
        }
      }

      &.hasBM { border-bottom: 3px solid $bm_color; }

      &.empty { background-color: $bar_color; }

      & > span {
        position: absolute;
        bottom: 0;
        transform: translateX(-50%);
        width: 3px;
        height: 3px;
        background-color: $bm_color;
        font-size: 10px;
      }

      &:hover .chapter-info { display: inline-block;}
      
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