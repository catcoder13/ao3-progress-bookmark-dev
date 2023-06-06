<template>
  <div class="ipb-navbar" :class="{stucked}" :style="{top: `${navbarElem.top}px`, width: `${navbarElem.width}px`}">
    <a :href="navbarHref(chI)" :class="navbarBarClass(chI)" v-for="(chInfo, chI) in chapterInfos" :key="chI"
      @mouseenter="hoveredChI = chI" @mouseleave="hoveredChI = null">
      <span class="ipb-navbar__bar__progress-bar" v-if="chI == curChI" :style="{width: `${curChProgress}%`}"></span>
      <template v-if="mainBM.chI != null && mainBM.chI == chI">
        <IpbIcon class="ipb-navbar__bar__bm" type="location" fill="#000" :style="{left: `${mainBM.perc * 100}%`}" />
      </template>
    </a>
  </div>
      
  <div v-if="hoveredChI != null" class="ipb-navbar-info" :style="infoPos">
    <span class="ipb-note" v-if="chapterInfos.length > 1">{{ (fullViewMode) ? 'Entire work' : 'Chapter by chapter' }}</span>
    <div class="ipb-heading">
      <IpbIcon v-if="mainBM.chI != null && mainBM.chI == approxChI" />
      <b v-if="oneShot">{{name}}</b>
      <b v-else>Chapter {{ parseInt(approxChI) + 1 }}</b>
    </div>
    
    <span v-if="approxChI != null && chapterInfos[approxChI].title" class="ipb-title">{{ chapterInfos[approxChI].title }}</span>

    <template v-if="hoveredChI != null && !bmInProgress">
      <span class="ipb-desc" v-if="fullViewMode">
        <IpbIcon type="mouse" fill="#999"/>
        Jump to <b>Chapter {{ parseInt(hoveredChI) + 1 }}</b>
      </span>
      <span class="ipb-desc" v-else-if="hoveredChI != curChI">
        <IpbIcon type="visit" fill="#999"/>
        Visit <b>Chapter {{ parseInt(hoveredChI) + 1 }}</b>
      </span>
      <span class="ipb-desc" v-else>Back to the top</span>
    </template>
  </div>

  <div v-else-if="approxChI != null" class="ipb-navbar-info ipb-navbar-info--short" :style="infoPos">
    <b class="ipb-heading">Chapter {{ parseInt(approxChI) + 1 }}</b>
  </div>

  
</template>

<script>
import { computed, onMounted, ref, reactive, onUnmounted } from 'vue'
import { AO3_DOMAIN } from '@/common/variables'
import { mainBM, bmInProgress } from '../js/bookmark'
import { chapters, curChI, curChProgress, view } from '../js/page'
import { outer, chapterInfos, fullViewMode, workID, oneShot, name} from '../js/static'
import {mousePos, activateMouseMove, deactivateMouseMove} from '../js/mousePos'
import { scrollY, activateScroll, deactivateScroll } from '../js/scroll'

import IpbIcon from '@/common/IpbIcon.vue'

export default {
  name: 'IpbNavbar',
  components: { IpbIcon },
  setup() {
    activateMouseMove()
    activateScroll()

    const navbarElem = reactive({width: 0, x: 0, barWidth: 0})

    const stucked = ref(false)
    let mainContentTop = 0
    let wrapperWidth = 0
    let wrapperLeft = 0
    const innerDivWorkWrapper = document.querySelector('#inner #main .wrapper')

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
    resizeObserver.observe(outer)

    const inView = ref(true)

    const onMouseEnterDoc = () => inView.value = true
    const onMouseLeaveDoc = () => inView.value = false


    const hoveredChI = ref(null)
    
    const approxChI = computed(() => {
      if (bmInProgress.value || !inView.value) return null
      
      if (hoveredChI.value != null) return hoveredChI.value
      
      if (stucked.value) {
        if (mousePos.y > 70 || mousePos.y < 0) return null
      } else {
        if (mousePos.x < navbarElem.left || mousePos.x > navbarElem.left + navbarElem.width) return null
        
        const mousePosY = scrollY.value + mousePos.y
        if (mousePosY > navbarElem.top + 70 || mousePosY < navbarElem.top) return null
      }

      const mousePosX = Math.max(0, mousePos.x - navbarElem.left)
      return Math.min(chapterInfos.length - 1, Math.floor(mousePosX / navbarElem.barWidth))
    })

    const infoPos = computed(() => {
      if (bmInProgress.value || approxChI.value == null) return null
      
      const infoWidthOffset = hoveredChI.value == null ? 70 : 200
      const xPosCorrect = mousePos.x + infoWidthOffset > navbarElem.width ? navbarElem.width - infoWidthOffset : mousePos.x
      return {top: `${mousePos.y + 22}px`, left: `${xPosCorrect}px`}
    })

    const navbarBarClass = chI => {
      return {
        "ipb-navbar__bar ipb-a-button": true,
        "has-bm": mainBM.chI && mainBM.chI == chI,
        "ipb-focus": approxChI.value == chI,
        'ipb-current': curChI.value == chI
      }
    }

    const navbarHref = chI => {
      if (oneShot) return '#workskin'
      if (fullViewMode) return `#chapter-${parseInt(chI) + 1}`
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
      infoPos, mainBM, fullViewMode, navbarElem, stucked, oneShot,
      navbarBarClass, navbarHref
    }
  }
}
</script>

<style lang="scss">
.ipb-navbar {
  position: absolute;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  background: linear-gradient(to bottom, rgba(#FFF, 1) 20%, rgba(#FFF, 0) 100%);
  transition: width 0.2s;

  &.stucked {
    position: fixed;

    .ipb-navbar__bar {
      opacity: 1;

      &:not(:only-child).ipb-current {
      // &:not(.ipb-one-chapter-only).ipb-current {
        height: 8px;

        &.ipb-focus { height: 17px; }
      }
    }
  }

  .ipb-navbar__bar {
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

    &.ipb-focus {
      height: 17px;
      cursor: pointer;
      opacity: 1;

      &:hover {
        flex: 200px;
        z-index: 999999;
      }
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
      top: 1px;
      transform: translateX(-50%);
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
  position: fixed;
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
    color: #85aec2;
  }
} // ipb-navbar-info
</style>
