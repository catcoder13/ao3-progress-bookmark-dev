<template>
<div class="ao3pb-bookmark ao3pb-bookmark--static" :class="ipbBookmarkClass()" :style="{top: `${pos}px`}">
  <div class="ao3pb-bookmark-content">
  
    <div class="ao3pb-bookmark__btn">
      <div @click="removeBookmark" title="Remove this bookmark">
        <IpbIcon fill="red" type="trash" />
        <span>Remove bookmark</span>
      </div>
      <div @click="startBookmarkEdit" title="Change bookmark location">
        <IpbIcon fill="#333" type="edit" />
        <span>Move bookmark to a new position</span>
      </div>
    </div>

    <div class="ao3pb-bookmark__icon">
      <IpbIcon type="location" fill=""></IpbIcon>
    </div>

    <span class="ao3pb-bookmark__info">Chapter {{parseInt(mainBM.chI) + 1}} | {{ (mainBM.perc * 100).toFixed(2) }}%</span>  
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
.ao3pb-bookmark.ao3pb-bookmark--static {
  position: absolute;
  pointer-events: none;

  & > * { pointer-events: all; }

  &.bmInProgress.ao3pb-bookmark > * {
    pointer-events: none;

    .ao3pb-icon path { fill: #333; }
  }

  &.highlight .ao3pb-bookmark-content {
    pointer-events: none;

    .ao3pb-bookmark__icon {
      animation: bookmarkScale 0.3s 4 alternate;

      .ao3pb-icon { opacity: 1; }
    }
  }  

  .ao3pb-bookmark-content {
    .ao3pb-bookmark__icon .ao3pb-icon { fill: $ao3_red; }
    .ao3pb-bookmark__btn { display: none; }

    &:hover {
      .ao3pb-bookmark__btn  > div:hover {
        transition: transform 0.2s;
        transform: scale(1.1);
      }

      .ao3pb-bookmark__info { display: block; }
    }
  }

  .ao3pb-bookmark__info { display: none; }
  
} // ao3pb-bookmark


</style>