<template>
<div class="ipb-bookmark ipb-bookmark--static" :class="ipbBookmarkClass()" :style="{top: `${pos}px`}">
  <div class="ipb-bookmark-content" @click="onMoveClick">
  
    <div class="ipb-bookmark__btn">
      <button @click="removeBookmark" title="Remove this bookmark">Remove</button>
    </div>

    <div class="ipb-bookmark__icon">
      <IpbIcon type="location"></IpbIcon>
    </div>

    <span class="ipb-bookmark__info">Chapter {{parseInt(mainBM.chI) + 1}} | {{ (mainBM.perc * 100).toFixed(2) }}%</span>  
  </div>
</div>
</template>

<script>
import { computed } from 'vue'
import {mainBM, bmFocusCountDown, bmInProgress, removeBookmark, startBookmarkEdit} from '../js/bookmark'
import IpbIcon from '@/common/IpbIcon.vue'

export default {
  props: ['chapters'],
  components: { IpbIcon },
  setup (p) {
    const pos = computed(() => p.chapters[mainBM.chI].top + p.chapters[mainBM.chI].height * mainBM.perc)

    const ipbBookmarkClass = () => {
      return {
        highlight: bmFocusCountDown.value,
        bmInProgress: bmInProgress.value
      }
    }

    const onMoveClick = e => {
      startBookmarkEdit(e)
    }
    return {mainBM, pos, onMoveClick, removeBookmark, ipbBookmarkClass }
  }
}
</script>

<style lang="scss">
.ipb-bookmark.ipb-bookmark--static {
  position: absolute;
  pointer-events: none;

  & > * { pointer-events: all; }

  &.bmInProgress.ipb-bookmark > * {
    pointer-events: none;
  }

  &.highlight .ipb-bookmark-content .ipb-bookmark__icon {
    animation: bookmarkScale 0.3s 4 alternate;

    .ipb-icon { opacity: 0.8; }
  }

  .ipb-bookmark-content {
    .ipb-bookmark__icon {
      .ipb-icon {
        transition: transform 0.2s, opacity 0.2s;
        opacity: 0.2;

        &:hover {
          transform: scale(1.2); 
          opacity: 0.7;
        }
      }
    }

    &:hover {
      .ipb-bookmark__info { display: block; }

      .ipb-bookmark__btn {
        display: block;
      }
    }
  }

  .ipb-bookmark__btn { display: none; }

  .ipb-bookmark__info { display: none; }
  
} // ipb-bookmark


</style>