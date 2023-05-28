<template>
<div class="ipb-bookmark" :class="ipbBookmarkClass()" :style="{top: `${pos}px`}">
  <div class="ipb-bookmark-content" @click="onMoveClick" title="Change bookmark location">
  
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
.ipb-bookmark {
  position: absolute;
  width: 100%;
  max-width: 1140px;
  left: 50%;
  transform: translate(-50%, -50%);
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
    display: none;

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
    display: none;
    position: absolute;
    font-size: 11px;
    line-height: 1;
    background-color: #ddd;
    bottom: 0;
    transform: translateY(calc(100% + 10px));
    right: 10px;
    white-space: nowrap;
    padding: 3px 8px;
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
      left: 10px;
    }
  }
}

</style>