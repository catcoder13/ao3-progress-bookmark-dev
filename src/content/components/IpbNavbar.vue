<template>
  <div class="ao3pb-navbar" :class="{stucked}" :style="{top: `${navbarElem.top}px`, width: `${navbarElem.width}px`}">
    <a :href="navbarHref(chI)" :class="navbarBarClass(chI)" v-for="(chInfo, chI) in chapterInfos" :key="chI"
      @mouseenter="hoveredChI = chI" @mouseleave="hoveredChI = null">
      <span class="ao3pb-navbar__bar__progress-bar" v-if="chI == curChI" :style="{width: `${curChProgress}%`}"></span>
      <template v-if="mainBM.chI != null && mainBM.chI == chI">
        <IpbIcon class="ao3pb-navbar__bar__bm" type="location" fill="#000" :style="{left: `${mainBM.perc * 100}%`}" />
      </template>
    </a>
  </div>
      
  <div v-if="hoveredChI != null" class="ao3pb-navbar-info" :style="infoPos">
    <span class="ao3pb-note" v-if="chapterInfos.length > 1">{{ (isEntireWork) ? 'Entire work' : 'Chapter by chapter' }}</span>
    <div class="ao3pb-heading">
      <IpbIcon v-if="mainBM.chI != null && mainBM.chI == approxChI" />
      <b v-if="oneShot">{{name}}</b>
      <b v-else>Chapter {{ parseInt(approxChI) + 1 }}</b>
    </div>
    
    <span v-if="approxChI != null && chapterInfos[approxChI].title" class="ao3pb-title">{{ chapterInfos[approxChI].title }}</span>

    <template v-if="hoveredChI != null && !bmInProgress">
      <span class="ao3pb-desc" v-if="isEntireWork">
        <IpbIcon type="mouse" fill="#999"/>
        Jump to <b>Chapter {{ parseInt(hoveredChI) + 1 }}</b>
      </span>
      <span class="ao3pb-desc" v-else-if="hoveredChI != curChI">
        <IpbIcon type="visit" fill="#999"/>
        Visit <b>Chapter {{ parseInt(hoveredChI) + 1 }}</b>
      </span>
      <span class="ao3pb-desc" v-else>
        <IpbIcon type="mouse" fill="#999"/>
        Back to the beginning of this {{oneShot ? 'one-shot' : 'chapter'}}
      </span>
    </template>
  </div>

  <div v-else-if="approxChI != null" class="ao3pb-navbar-info ao3pb-navbar-info--short" :style="infoPos">
    <b v-if="oneShot" class="ao3pb-heading">One-shot</b>
    <b v-else class="ao3pb-heading">Chapter {{ parseInt(approxChI) + 1 }}</b>
  </div>

  
</template>

<script>
import { computed, onMounted, ref, reactive, onUnmounted } from 'vue'
import { AO3_DOMAIN } from '@/common/variables'
import { mainBM, bmInProgress } from '../js/bookmark'
import { chapters, curChI, view } from '../js/page'
import { chapterInfos, isEntireWork, workID, oneShot, name} from '../js/static'
import {mousePos, activateMouseMove, deactivateMouseMove} from '../js/mousePos'
import { scrollY, activateScroll, deactivateScroll } from '../js/scroll'

import IpbIcon from '@/common/IpbIcon.vue'

const TOOLTIP_RANGE_Y = 40
export default {
  name: 'IpbNavbar',
  components: { IpbIcon },
  setup() {
    const innerDivWorkWrapper = document.querySelector('#inner #main .wrapper')

    if (!innerDivWorkWrapper) {
      console.warn('[AO3 IPB] Navbar failed to initialised due to (#inner #main .wrapper) not exists.')
      return
    }

    activateMouseMove()
    activateScroll()

    const curChProgress = computed(() => {
      const scrollBottom = scrollY.value + view.height
      return (Math.min(1, Math.max(0, (scrollBottom - chapters[curChI.value].top) / chapters[curChI.value].height)) * 100).toFixed(0)
    })

    const navbarElem = reactive({width: 0, x: 0, barWidth: 0})

    const stucked = ref(false)
    let mainContentTop = 0
    let wrapperWidth = 0
    let wrapperLeft = 0

    const onLocalScroll = () => {
      stucked.value = window.scrollY > mainContentTop

      navbarElem.left = stucked.value ? 0 : wrapperLeft
      navbarElem.top = stucked.value ? 0 : mainContentTop
      navbarElem.width = stucked.value ? view.width : wrapperWidth
      navbarElem.barWidth = navbarElem.width / chapterInfos.length
    }

    const onLocalResize = () => {
      const {x, y, width, height} = innerDivWorkWrapper.getBoundingClientRect()
      mainContentTop = window.scrollY + y + height
      wrapperWidth = width
      wrapperLeft = x

      onLocalScroll()
    }

    const resizeObserver = new ResizeObserver(onLocalResize)
    const outer = document.getElementById('outer')
    resizeObserver.observe(outer)

    const inView = ref(true)

    const onMouseEnterDoc = () => inView.value = true
    const onMouseLeaveDoc = () => inView.value = false


    const hoveredChI = ref(null)
    
    const approxChI = computed(() => {
      if (bmInProgress.value || !inView.value) return null
      
      if (hoveredChI.value != null) return hoveredChI.value
      
      if (stucked.value) {
        if (mousePos.y > TOOLTIP_RANGE_Y || mousePos.y < 0) return null
      } else {
        if (mousePos.x < navbarElem.left || mousePos.x > navbarElem.left + navbarElem.width) return null
        
        const mousePosY = scrollY.value + mousePos.y
        if (mousePosY > navbarElem.top + TOOLTIP_RANGE_Y || mousePosY < navbarElem.top) return null
      }

      const mousePosX = Math.max(0, mousePos.x - navbarElem.left)
      return Math.min(chapterInfos.length - 1, Math.floor(mousePosX / navbarElem.barWidth))
    })

    const infoPos = computed(() => {
      if (bmInProgress.value || approxChI.value == null) return null
      
      const infoWidthOffset = hoveredChI.value == null ? 60 : 200
      const xPosCorrect = mousePos.x + infoWidthOffset > navbarElem.width ? navbarElem.width - infoWidthOffset : mousePos.x
      return {top: `${mousePos.y + 22}px`, left: `${xPosCorrect}px`}
    })

    const navbarBarClass = chI => {
      return {
        "ao3pb-navbar__bar ao3pb-a-button": true,
        "has-bm": mainBM.chI && mainBM.chI == chI,
        "ao3pb-focus": approxChI.value == chI,
        'ao3pb-current': curChI.value == chI
      }
    }

    const navbarHref = chI => {
      if (oneShot) return '#workskin'
      if (isEntireWork) return `#chapter-${parseInt(chI) + 1}`
      if (curChI.value == chI) return `#chapter-${parseInt(chI + 1)}`
      
      return `${AO3_DOMAIN}/works/${workID}/chapters/${chapterInfos[chI].chID}#chapter-${parseInt(chI) + 1}`
    }

    onMounted(() => {
      document.addEventListener('scroll', onLocalScroll)
      window.addEventListener('resize', onLocalResize)
      onLocalResize()

      document.addEventListener('mouseenter', onMouseEnterDoc)
      document.addEventListener('mouseleave', onMouseLeaveDoc)
    })

    onUnmounted(() => {
      document.removeEventListener('scroll', onLocalScroll)
      window.removeEventListener('resize', onLocalResize)
      document.removeEventListener('mouseenter', onMouseEnterDoc)
      document.removeEventListener('mouseleave', onMouseLeaveDoc)
      resizeObserver.unobserve(outer)
      deactivateMouseMove()
      deactivateScroll()
    })

    return {
      chapters, chapterInfos, curChI, curChProgress, approxChI, hoveredChI, name, bmInProgress,
      infoPos, mainBM, isEntireWork, navbarElem, stucked, oneShot,
      navbarBarClass, navbarHref
    }
  }
}
</script>

<style lang="scss">
.ao3pb-navbar {
  position: absolute;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  background: linear-gradient(to bottom, rgba(#FFF, 1) 20%, rgba(#FFF, 0) 100%);
  transition: width 0.2s;

  &.stucked {
    position: fixed;

    .ao3pb-navbar__bar {
      opacity: 1;

      &:not(:only-child).ao3pb-current {
        height: 8px;

        &.ao3pb-focus { height: 17px; }
      }
    }
  }

  .ao3pb-navbar__bar {
    position: relative;
    bottom: 0;
    box-sizing: border-box;
    transition: height 0.2s, flex 0.2s;
    height: 5px;
    flex: 1;
    background-color: $bar_color;
    transition: flex 0.5s height 0.2s filter 0.2s;
    opacity: 0.5;
    user-select: none;

    &:not(:last-child) { border-right: 1px solid #FFF; } // not oneshot or not one chapter available

    &.has-bm { background-color: #e84f4f; }

    &.ao3pb-focus {
      height: 17px;
      cursor: pointer;
      opacity: 1;

      &:hover {
        flex: 200px;
        z-index: 999999;
      }
    }

    .ao3pb-navbar__bar__progress-bar {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background-color: $bar_darken_color;
    }

    &.has-bm .ao3pb-navbar__bar__progress-bar { background-color: $ao3_red; }

    .ao3pb-navbar__bar__bm {
      position: absolute;
      top: 1px;
      transform: translateX(-50%);
      height: 100%;
      box-sizing: border-box;
      pointer-events: none;
    }
  } // chapter-progress__bar

} // navbar

.ao3pb-navbar-info.ao3pb-navbar-info--short {
  opacity: 0.8;
  padding: 5px;

  .ao3pb-heading {
    padding: 0;
    font-size: 10px;
    min-width: 0;
  }
} 

.ao3pb-navbar-info {
  position: fixed;
  z-index: 100;
  background-color: #eee;
  padding: 10px;
  font-size: 14px;
  transition: opacity 0.2s;
  max-width: 200px;
  box-sizing: border-box;
  pointer-events: none;
  
  & > * { 
    display: block; 
    
    &:not(:last-child) { padding-bottom: 7px; }
  }

  .ao3pb-heading {
    font-size: 12px;
    line-height: 1;
    min-width: 100px;
    padding: 5px 0;
    box-sizing: border-box;
    color: #333;
    

    b { display: inline; }

    & > * { vertical-align: middle;}

    .ao3pb-icon { display: inline-block; width: 20px; height: 20px; }
  }

  .ao3pb-note {
    position: absolute;
    font-size: 10px;
    top: 0;
    right: 0;
    padding: 2px 5px;
    background-color: #666;
    color: #FFF;
  }

  .ao3pb-title {
    font-size: 13px;
    color: #444;
    padding-bottom: 5px;
  }

  .ao3pb-bm-note {
    font-size: 11px;

    & > * { display: inline-block; vertical-align: middle;}

    .ao3pb-icon {
      width: 17px; height: 17px;
      padding-right: 3px;

      &:hover {
        transform: scale(1.1);
      }
    }
  }

  .ao3pb-desc {
    font-size: 11px;
    font-style: italic;
    color: #85aec2;
  }
} // ao3pb-navbar-info
</style>
