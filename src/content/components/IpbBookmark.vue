<template>
<div class="ipb-bookmark ipb-bookmark--static" :class="ipbBookmarkClass()" :style="{top: `${pos}px`}">
  <div class="ipb-bookmark-content">
  
    <div class="ipb-bookmark__btn">
      <div @click="removeBookmark" title="Remove this bookmark">
        <IpbIcon fill="red" type="trash" />
        <span>Remove bookmark</span>
      </div>
      <div @click="startBookmarkEdit" title="Change bookmark location">
        <IpbIcon fill="#333" type="edit" />
        <span>Move bookmark to a new position</span>
      </div>
      <!-- <button @click="removeBookmark" title="Remove this bookmark">Remove</button> -->
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

    return {mainBM, pos, startBookmarkEdit, removeBookmark, ipbBookmarkClass }
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

  &.highlight .ipb-bookmark-content {
    pointer-events: none;

    .ipb-bookmark__icon {
      animation: bookmarkScale 0.3s 4 alternate;

      .ipb-icon { opacity: 1; }
    }
  }  

  .ipb-bookmark-content {
    .ipb-bookmark__btn { display: none; }

    &:hover {
      .ipb-bookmark__btn  > div:hover {
        transition: transform 0.2s;
        transform: scale(1.1);
      }

      .ipb-bookmark__info { display: block; }
    }
  }

  .ipb-bookmark__info { display: none; }
  
} // ipb-bookmark


</style>