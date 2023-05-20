<template>
  <div class="ipb-navbar-content" ref="navbarElemRef">
  <!-- <div class="ipb-navbar" :style="navbarStyle"> -->
      <div :class="navbarBarClass(chI)" v-for="(chInfo, chI) in chapterInfos" :key="chI"
        @click="() => jumpToChapter(chI)" @mouseenter="hoveredChI = chI" @mouseleave="hoveredChI = null">
        <span class="ipb-navbar__bar__progress-bar" v-if="chI == curChI" :style="{width: `${chapters[chI].progress}%`}"></span>
        <template v-if="mainBM.chI != null && mainBM.chI == chI">
          <IpbIcon class="ipb-navbar__bar__bm" type="location" fill="#000" :style="{left: `${mainBM.perc * 100}%`}"></IpbIcon>
        </template>
      </div>
    <!-- </div> -->

    <!-- <div v-if="infoPos != null" class="ipb-navbar-info" :style="{top: `${infoPos.y}px`, left: `${infoPos.x}px`, opacity: hoveredChI != null ? 1 : 0.9 }"> -->
    <div v-if="hoveredChI != null" class="ipb-navbar-info" :style="{left: `${infoPosX}px`}">
      <span class="ipb-note" v-if="chapterInfos.length > 1">{{ (fullViewMode) ? 'Entire work' : 'Chapter by chapter' }}</span>
      <div class="ipb-heading">
        <IpbIcon v-if="mainBM.chI != null && mainBM.chI == approxChI"></IpbIcon>
        <b>Chapter {{ parseInt(approxChI) + 1 }}</b>
      </div>
      <!-- <b class="ipb-heading">Chapter {{ parseInt(approxChI) + 1 }}</b> -->
      <span v-if="approxChI != null" class="ipb-title">{{ navbarTitle(approxChI) }}</span>
      
      <!-- <div class="ipb-bm-note" v-if="mainBM.chI != null && mainBM.chI == approxChI">
        <IpbIcon @click="() => jumpToChapter(mainBM.chI)"></IpbIcon>
        <span>Bookmarked at {{ (mainBM.perc * 100).toFixed(2) }}%</span>
      </div> -->

      <template v-if="hoveredChI != null">
        <span class="ipb-desc" v-if="fullViewMode">Click to scroll to <b>Chapter {{ parseInt(hoveredChI) + 1 }}</b></span>
        <span class="ipb-desc" v-else-if="hoveredChI != curChI">Click to visit <b>Chapter {{ parseInt(hoveredChI) + 1 }}</b></span>
        <span class="ipb-desc" v-else>Click to scroll to the top</span>
      </template>
    </div>
    <div v-else-if="approxChI != null" class="ipb-navbar-info ipb-navbar-info--short" :style="{ left: `${infoPosX}px`}">
      <b class="ipb-heading">Chapter {{ parseInt(approxChI) + 1 }}</b>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, reactive } from 'vue'
import { mainBM, bmInProgress } from '../bookmark'
import { chapters, curChI, view, onScroll } from '../page'
import {chapterInfos, fullViewMode, workId} from '../static'
import {mousePos} from '../mousePos'
import IpbIcon from './IpbIcon.vue'

export default {
  name: 'IpbNavbar',
  components: { IpbIcon },
  setup() {
    const inView = ref(true)
    const hoveredChI = ref(null)

    const navbarElemRef = ref(null)
    const navbarElem = reactive({width: 0, x: 0, barWidth: 0})
    
    const stucked = ref(false)

    const approxChI = computed(() => {
      if (bmInProgress.value || !inView.value) return null
      
      if (hoveredChI.value != null) return hoveredChI.value

      if (stucked.value) {
        if (mousePos.y > 70) return null
      } else {
        const mousePosY = view.scrollY + mousePos.y
        if (mousePosY > navbarElem.top + 70 || mousePosY < navbarElem.top) return null
      }

      const mousePosX = Math.max(0, mousePos.x - navbarElem.left)
      return Math.min(chapterInfos.length - 1, Math.floor(mousePosX / navbarElem.barWidth))
    })

    const infoPosX = computed(() => {
      if (bmInProgress.value || approxChI.value == null) return null
      
      const xPos = approxChI.value * navbarElem.barWidth
      const infoWidthOffset = hoveredChI.value == null ? 70 : 200

      return xPos + infoWidthOffset > navbarElem.width ? navbarElem.width - infoWidthOffset : xPos
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

    document.addEventListener('mouseenter', () => { inView.value = true })
    document.addEventListener('mouseleave', () => { inView.value = false })

    onMounted(() => {
      const onNavResize = () => {
        const {x, y, width} = navbarElemRef.value.getBoundingClientRect()
        navbarElem.left = x
        navbarElem.top = window.scrollY + y
        navbarElem.width = width
        navbarElem.barWidth = width / chapterInfos.length
      }
      window.addEventListener('resize', onNavResize)
      onNavResize()

      const observer = new IntersectionObserver(([e]) => {
        stucked.value = e.intersectionRatio < 1
        onNavResize()
      })
      observer.observe(document.getElementById('ipb-navbar'))
    })

    return {
      chapters, chapterInfos, curChI, approxChI, hoveredChI,
      infoPosX, mainBM, fullViewMode, navbarElemRef,
      navbarBarClass, navbarTitle, jumpToChapter
    }
  }
}
</script>

<style lang="scss">
$bar_color: #999;
$bar_darken_color: #444;

$ao3_red: #900;

#ipb-navbar {
  position: sticky;
  top: -1px;
  z-index: 99;
  height: 0;
}

.ipb-navbar-content {
  display: flex;

  .ipb-navbar__bar {
    position: relative;
    bottom: 0;
    box-sizing: border-box;
    transition: height 0.2s, flex 0.2s;
    height: 5px;
    flex: 1;
    background-color: $bar_color;
    transition: flex 0.5s height 0.2s filter 0.2s;

    &.ipb-current:not(.ipb-one-chapter-only) {
      height: 8px;

      &.ipb-focus { height: 17px; }
    }

    &:not(:last-child) { border-right: 1px solid #FFF; }

    &.has-bm { background-color: #e84f4f; }

    &.ipb-focus {
      height: 17px;
      cursor: pointer;

      &:hover { flex: 200px; z-index: 999999; }
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
      pointer-events: none;
    }
  } // chapter-progress__bar

} // navbar

.ipb-navbar-info.ipb-navbar-info--short {
  opacity: 0.8;
  padding: 5px;

  .ipb-heading {
    padding: 0;
    font-size: 10px;
  }
} 

.ipb-navbar-info {
  position: absolute;
  top: 40px;
  z-index: 100;
  background-color: #eee;
  padding: 10px;
  font-size: 14px;
  transition: opacity 0.2s;
  max-width: 200px;
  pointer-events: none;
  
  & > * { 
    display: block; 
    
    &:not(:last-child) { padding-bottom: 7px; }
  }

  .ipb-heading {
    font-size: 12px;
    line-height: 1;
    padding-right: 100px;
    padding-bottom: 2px;

    & > * { display: inline-block; vertical-align: middle;}

    .ipb-icon { width: 20px; height: 20px; }
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
    font-size: 11px;

    & > * { display: inline-block; vertical-align: middle;}

    .ipb-icon {
      width: 17px; height: 17px;
      padding-right: 3px;

      &:hover {
        transform: scale(1.1);
      }
    }
  }

  .ipb-desc {
    font-size: 11px;
    font-style: italic;
    color: #555;

  }
} // ipb-navbar-info
</style>
