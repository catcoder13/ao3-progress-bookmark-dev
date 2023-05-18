<template>
  <div class="ipb-navbar">
      <div :class="navbarBarClass(chI)" v-for="(chInfo, chI) in chapterInfos" :key="chI"
        @click="() => jumpToChapter(chI)" @mouseenter="hoveredChI = chI" @mouseleave="hoveredChI = null">
        <span class="ipb-navbar__bar__progress-bar" v-if="chI == curChI" :style="{width: `${chapters[chI].progress}%`}"></span>
        <template v-if="mainBM.chI && mainBM.chI == chI">
          <span class="ipb-navbar__bar__bm" :style="{left: `${mainBM.perc * 100}%`}"
            :title="`Bookmarked at Chapter ${parseInt(chI) + 1} | progress: ${(mainBM.perc * 100).toFixed(2)}%`"></span>
        </template>
      </div>
  </div>

  <div v-if="approxChI != null" class="ipb-navbar-info" :style="{top: `${infoPos.y}px`, left: `${infoPos.x}px`, opacity: hoveredChI != null ? 1 : 0.9 }">
    <b class="ipb-heading">Chapter {{ parseInt(approxChI) + 1 }}</b>
    <span v-if="navbarTitle(approxChI)" class="ipb-title">{{ navbarTitle(approxChI) }}</span>
    <div class="ipb-bm-note" v-if="mainBM.chI != null && mainBM.chI == approxChI">
      <IpbIcon></IpbIcon>
      <span>Bookmarked at {{ (mainBM.perc * 100).toFixed(2) }}%</span>
    </div>
    <template v-if="hoveredChI != null">
      <span class="ipb-desc" v-if="fullViewMode">Click to scroll to <b>Chapter {{ parseInt(hoveredChI) + 1 }}</b></span>
      <span class="ipb-desc" v-else-if="hoveredChI != curChI">Click to visit <b>Chapter {{ parseInt(hoveredChI) + 1 }}</b></span>
      <span class="ipb-desc" v-else>This page is Chapter {{ parseInt(hoveredChI) + 1 }}, click to scroll back to top.</span>
    </template>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { mainBM } from '../bookmark'
import { chapters, curChI, onScroll } from '../page'
import {chapterInfos, fullViewMode, workId} from '../static'
import {mousePos} from '../mousePos'
import IpbIcon from './IpbIcon.vue'

export default {
  props: ['bmInProgress'],
  components: { IpbIcon },
  setup(p) {
    const inView = ref(true)
    const hoveredChI = ref(null)

    const approxChI = computed(() => {
      if (p.bmInProgress || !inView.value || chapterInfos.length === 1 || mousePos.y > 50 || mousePos.y <= 0) return null
      
      if (hoveredChI.value) return hoveredChI.value

      const navWidth = window.innerWidth / chapterInfos.length
      return Math.floor(mousePos.x / navWidth)
    })

    const infoPos = computed(() => {
      if (p.bmInProgress || approxChI.value == null) return null
      const x = mousePos.x + 200 > window.innerWidth ? window.innerWidth - 200 : mousePos.x
      return { x, y: mousePos.y + 10 }
    })

    const navbarBarClass = chI => {
      return {
        "ipb-navbar__bar": true,
        "has-bm": mainBM.chI && mainBM.chI == chI,
        "ipb-focus": approxChI.value == chI,
        'ipb-one-chapter-only': chapterInfos.length === 1,
        'ipb-current': curChI.value == chI && chapters[curChI.value].progress > 0 && chapters[curChI.value].progress < 100
      }
    }

    const navbarTitle = chI => {
      const chString = `Chapter ${parseInt(chI) + 1}`
      const chTitle = chapterInfos[chI].title;
      if (chString == chTitle) return ''

      return chTitle
    }

    const jumpToChapter = chI => {
      if (fullViewMode || approxChI.value == curChI.value) {
        const targetScroll = chapters[chI].top;
        window.scrollTo({ top: targetScroll, behavior: "smooth" })
        // if (chapters[chI].top > window.scrollY && chapters[chI].top < window.scrollY + window.innerHeight) {
        //   window.scrollTo({top: targetScroll, behavior: 'smooth'})
        // } else window.scrollTo({top: targetScroll})
        onScroll(null, targetScroll)
      }
      else {
        window.location.href = `/works/${workId}/chapters/${chapterInfos[chI].chID}#chapter-${parseInt(chI) + 1}`
      }
    }

    document.addEventListener('mouseenter', () => {
      inView.value = true
    })
    document.addEventListener('mouseleave', () => {
      inView.value = false
    })

    return {
      chapters, chapterInfos, curChI, approxChI, hoveredChI,
      infoPos, mainBM, fullViewMode,
      navbarBarClass, navbarTitle, jumpToChapter
    }
  }
}
</script>

<style lang="scss">
$bar_color: #777777;
$bar_darken_color: #333333;

$ao3_red: #900;
$ao3_grey: #a7a7a7;

.ipb-navbar {
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  // background-color: #FFF;
  display: flex;

  .ipb-navbar__bar {
    position: relative;
    bottom: 0;
    box-sizing: border-box;
    transition: height 0.2s, flex 0.2s;
    height: 3px;
    flex: 1;
    background-color: $bar_color;
    transition: flex 0.5s height 0.2s filter 0.2s;
    opacity: 0.6;

    &.ipb-current { opacity: 1; height: 6px; }

    &:not(:last-child) { border-right: 1px solid #FFF; }

    &.has-bm { background-color: #e84f4f; }

    &.ipb-one-chapter-only { height: 8px; }

    &.ipb-focus {
      height: 20px;
      flex: 200px;
      cursor: pointer;
      opacity: 1;

      &:hover { filter:brightness(50%); }
    }

    .ipb-navbar__bar__progress-bar {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background-color: $bar_darken_color;
    }

    &.has-bm .ipb-navbar__bar__progress-bar { background-color: $ao3_red; }

    .ipb-navbar__bar__bm {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 0;
      height: 100%;
      box-sizing: border-box;
      background-color: $ao3_red;
      border-left: 3px solid $ao3_red;
      border-right: 3px solid #e84f4f;
    }
  } // chapter-progress__bar

} // navbar

.ipb-navbar-info {
  position: fixed;
  z-index: 100;
  background-color: #eee;
  padding: 10px;
  font-size: 14px;
  transition: opacity 0.2s;
  max-width: 200px;
  
  & > * { 
    display: block; 
    
    &:not(:last-child) { padding-bottom: 10px; }
  }
  
  .ipb-heading { padding-bottom: 0; }

  .ipb-title {
    font-size: 13px;
    color: #444;
  }

  .ipb-bm-note {
    font-size: 12px;

    & > * { display: inline-block; vertical-align: middle;}

    .ipb-icon {
      width: 17px; height: 17px;
      padding-right: 5px;
    }
  }

  .ipb-desc {
    font-size: 11px;
    font-style: italic;
    color: #555;

  }
} // ipb-navbar-info
</style>
