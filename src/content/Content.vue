<template v-if="ready">
  <div :class="{'ipb-left': !settings.alignRight}">
    <IpbSidebar v-if="!bmInProgress"></IpbSidebar>
    <IpbEditor v-else :chapters="chapters"></IpbEditor>
    
    <IpbBookmark v-if="canShowBookmark" :chapters="chapters"></IpbBookmark>

    <IpbNavbar v-if="settings.progressBar"></IpbNavbar>
  </div>
</template>

<script>
import '@/common/__base.scss'

import { computed, watch } from 'vue'
import { storeReady } from './js/store'
import {chapters, curChI, pageReady, windowLoaded } from './js/page'
import { mainBM, bmInProgress, jumpToBookmark } from './js/bookmark'
import { fullViewMode, mainContent, jumpToBMOnLoad } from './js/static'
import { settings } from './js/setting'

import IpbBookmark from './components/IpbBookmark.vue'
import IpbEditor from './components/IpbEditor.vue'
import IpbNavbar from './components/IpbNavbar.vue'
import IpbSidebar from './components/IpbSidebar.vue'

export default {
  name: 'App',
  components: { IpbNavbar, IpbSidebar, IpbEditor, IpbBookmark },
  setup () {
    const canShowBookmark = computed(() => {
      if (!mainBM.chI) return false
      if (fullViewMode) return true

      return mainBM.chI == curChI.value
    })

    const ready = computed(() => windowLoaded.value && storeReady.value && pageReady.value)

    watch(() => ready.value,
    () => {
      if (jumpToBMOnLoad) jumpToBookmark(chapters, curChI)
    })

    return {
      chapters, ready,
      bmInProgress, canShowBookmark, mainContent,
      settings
    }
  }
}
</script>

<style lang="scss">
#workskin {
  &.bmInProgress #chapters > .chapter,
  &.bmInProgress.oneshot #chapters {
    background-color: rgba(#aaaaaa, 0.3);
  }
}

.ipb-bookmark {
  position: absolute;
  width: 100%;
  max-width: 1160px;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: brightness(1.5);

  .ipb-bookmark-content {
    position: absolute;
    top: -17px;
    right: 15px;

    .ipb-bookmark__icon {
      position: relative;
      width: 40px;
      height: 40px;
      padding: 5px;
      box-sizing: border-box;
      opacity: 0.3;

      .ipb-icon {
        position: absolute;
        width: 30px;
        height: 30px;
      }
    }

    &:hover {
      .ipb-bookmark__btn { display: flex; }
    }
  } // ipb-bookmark-content

  .ipb-bookmark__btn {
    display: flex;
    position: absolute;
    z-index: 1;
    top: 50%;
    transform: translateY(-50%);
    right: 5px;
    overflow: hidden;
    white-space: nowrap;
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
    cursor: pointer;

    & > div {
      position: relative;
      display: block;
      width: 28px;
      opacity: 0.75;
      padding: 5px;
      box-sizing: border-box;
      
      &:hover { opacity: 1; }
      
      .ipb-icon {
        width: 100%;
        height: 100%;
      }

      span {
        position: absolute;
        bottom: 0;
        transform: translateY(calc(100% + 10px));
        background-color: grey;
        padding: 5px 10px;
      }
    }
  }

  .ipb-bookmark__info {
    position: absolute;
    font-size: 11px;
    line-height: 1;
    background-color: #333;
    color: #ddd;
    bottom: 0;
    transform: translateY(calc(100% + 10px));
    right: 0;
    white-space: nowrap;
    padding: 5px 10px;
  }
} // ipb-bookmark

.ipb-left .ipb-bookmark {
  .ipb-bookmark-content {
    right: auto;
    left: 15px;

    .ipb-bookmark__btn {
      right: auto;
      left: 5px;
      // padding-right: 0;
      // padding-left: 25px;
      flex-direction: row-reverse;
    }

    .ipb-bookmark__info {
      right: auto;
      left: 0;
    }
  }
}
</style>
