<template v-if="ready">
  <div :class="{'ao3pb-left': !settings.alignRight}">
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
import { isEntireWork, jumpToBMOnLoad } from './js/static'
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
      if (isEntireWork) return true

      return mainBM.chI == curChI.value
    })

    const ready = computed(() => windowLoaded.value && storeReady.value && pageReady.value)

    watch(() => ready.value,
    () => {
      if (jumpToBMOnLoad) jumpToBookmark(chapters, curChI)
    })

    return {
      chapters, ready, settings,
      bmInProgress, canShowBookmark
    }
  }
}
</script>

<style lang="scss">
#workskin {
  &.bmInProgress #chapters > .chapter, //multi-chapter page structure
  &.bmInProgress #chapters:not(:has(.chapter)) // one-shot page structure
  {
    background-color: rgba(#aaa, 0.3);
  }
}

.ao3pb-bookmark {
  position: absolute;
  width: 100%;
  max-width: 1160px;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: brightness(1.5);

  .ao3pb-bookmark-content {
    position: absolute;
    top: -17px;
    right: 15px;

    .ao3pb-bookmark__icon {
      position: relative;
      width: 40px;
      height: 40px;
      padding: 5px;
      box-sizing: border-box;
      opacity: 0.3;

      .ao3pb-icon {
        position: absolute;
        width: 30px;
        height: 30px;
      }
    }

    &:hover {
      .ao3pb-bookmark__btn { display: flex; }
    }
  } // ao3pb-bookmark-content

  .ao3pb-bookmark__btn {
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
      
      .ao3pb-icon {
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

  .ao3pb-bookmark__info {
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
} // ao3pb-bookmark

.ao3pb-left .ao3pb-bookmark {
  .ao3pb-bookmark-content {
    right: auto;
    left: 15px;

    .ao3pb-bookmark__btn {
      right: auto;
      left: 5px;
      flex-direction: row-reverse;
    }

    .ao3pb-bookmark__info {
      right: auto;
      left: 0;
    }
  }
}
</style>
