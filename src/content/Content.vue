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
      if (jumpToBMOnLoad) {
        jumpToBookmark(chapters, curChI)
        console.log('jump to bm on load')
      }
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
  max-width: 1140px;
  left: 50%;
  transform: translate(-50%, -50%);

  .ipb-bookmark-content {
    position: absolute;
    top: -17px;
    right: 15px;
    cursor: pointer;

    .ipb-bookmark__icon {
      position: relative;
      width: 25px;
      height: 25px;
      margin: 5px;

      .ipb-icon {
        position: absolute;
        width: 100%;
        height: 100%;
      }
    }
  }

  .ipb-bookmark__btn {
    position: absolute;
    z-index: -1;
    top: 0;
    right: 0;
    overflow: hidden;
    white-space: nowrap;
    padding: 5px 35px 5px 5px;
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;

    &:hover {
      button { filter: brightness(0.95);}
    }

    button {
      cursor: pointer;
      font-size: 12px;
      line-height: 1;
      margin-right: 5px;
      text-decoration: none;
      padding: 3px 8px;
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
    right: 20px;
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
      left: 0;
      padding: 5px 5px 5px 35px;
    }

    .ipb-bookmark__info {
      right: auto;
      left: 20px;
    }
  }
}
</style>
