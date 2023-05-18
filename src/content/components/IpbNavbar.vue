<template>
  <div class="ipb-navbar" :style="navbarStyle">
      <div :class="navbarBarClass(chI)" v-for="(chInfo, chI) in chapterInfos" :key="chI"
        @click="() => jumpToChapter(chI)" @mouseenter="hoveredChI = chI" @mouseleave="hoveredChI = null; focusNavXPos = null">
        <span class="ipb-navbar__bar__progress-bar" v-if="chI == curChI" :style="{width: `${chapters[chI].progress}%`}"></span>
        <template v-if="mainBM.chI && mainBM.chI == chI">
          <IpbIcon class="ipb-navbar__bar__bm" type="location" fill="#000" :style="{left: `${mainBM.perc * 100}%`}"></IpbIcon>
        </template>
      </div>
  </div>

  <div v-if="approxChI != null" class="ipb-navbar-info" :style="{top: `${infoPos.y}px`, left: `${infoPos.x}px`, opacity: hoveredChI != null ? 1 : 0.9 }">
    <span class="ipb-note" v-if="chapterInfos.length > 1">{{ (fullViewMode) ? 'Entire work' : 'Chapter by chapter' }}</span>
    <b class="ipb-heading">Chapter {{ parseInt(approxChI) + 1 }}</b>
    <span v-if="navbarTitle(approxChI)" class="ipb-title">{{ navbarTitle(approxChI) }}</span>
    
    <div class="ipb-bm-note" v-if="mainBM.chI != null && mainBM.chI == approxChI">
      <IpbIcon></IpbIcon>
      <span>Bookmarked at {{ (mainBM.perc * 100).toFixed(2) }}%</span>
    </div>

    <template v-if="hoveredChI != null">
      <span class="ipb-desc" v-if="fullViewMode">Click to scroll to the beginning of <b>Chapter {{ parseInt(hoveredChI) + 1 }}</b></span>
      <span class="ipb-desc" v-else-if="hoveredChI != curChI">Click to visit <b>Chapter {{ parseInt(hoveredChI) + 1 }}</b></span>
      <span class="ipb-desc" v-else>This page is Chapter {{ parseInt(hoveredChI) + 1 }}, click to scroll to the beginning of this chapter.</span>
    </template>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { mainBM } from '../bookmark'
import { chapters, curChI, navbarStyle, windowSize, onScroll } from '../page'
import {chapterInfos, fullViewMode, workId} from '../static'
import {mousePos} from '../mousePos'
import IpbIcon from './IpbIcon.vue'

export default {
  name: 'IpbNavbar',
  props: ['bmInProgress'],
  components: { IpbIcon },
  setup(p) {
    const inView = ref(true)
    const hoveredChI = ref(null)
    const focusNavXPos = ref(0)
    
    const approxChI = computed(() => {
      if (navbarStyle.position == 'absolute') return hoveredChI.value

      if (p.bmInProgress || !inView.value || mousePos.y > 50 || mousePos.y <= 0) return null
      
      if (hoveredChI.value) return hoveredChI.value

      const navWidth = windowSize.width / chapterInfos.length
      return Math.min(chapterInfos.length - 1, Math.floor(mousePos.x / navWidth))
    })

    const infoPos = computed(() => {
      if (p.bmInProgress || approxChI.value == null) return null
      const x = mousePos.x + 200 > windowSize.width ? windowSize.width - 200 : mousePos.x
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
      infoPos, mainBM, fullViewMode, navbarStyle, focusNavXPos,
      navbarBarClass, navbarTitle, jumpToChapter
    }
  }
}
</script>

<style lang="scss">
$bar_color: #999;
$bar_darken_color: #444;

$ao3_red: #900;

.ipb-navbar {
  position: sticky;
  z-index: 99;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  display: flex;

  .ipb-navbar__bar {
    position: relative;
    bottom: 0;
    box-sizing: border-box;
    transition: height 0.2s, flex 0.2s;
    height: 8px;
    flex: 1;
    background-color: $bar_color;
    transition: flex 0.5s height 0.2s filter 0.2s;

    &.ipb-current:not(.ipb-one-chapter-only) {
      height: 12px;

      &.ipb-focus { height: 20px; }
    }

    &:not(:last-child) { border-right: 1px solid #FFF; }

    &.has-bm { background-color: #e84f4f; }

    &.ipb-focus {
      height: 20px;
      cursor: pointer;

      &:hover { flex: 200px; }
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
      height: 100%;
      box-sizing: border-box;
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
    
    &:not(:last-child) { padding-bottom: 7px; }
  }

  .ipb-heading {
    padding-right: 96px;
    padding-bottom: 2px;
  }

  .ipb-note {
    position: absolute;
    font-size: 10px;
    top: 0;
    right: 0;
    padding: 2px 5px;
    background-color: #666;
    color: #FFF;
  }

  .ipb-title {
    font-size: 13px;
    color: #444;
  }

  .ipb-bm-note {
    font-size: 12px;

    & > * { display: inline-block; vertical-align: middle;}

    .ipb-icon {
      width: 17px; height: 17px;
      padding-right: 3px;
    }
  }

  .ipb-desc {
    font-size: 11px;
    font-style: italic;
    color: #555;

  }
} // ipb-navbar-info
</style>
