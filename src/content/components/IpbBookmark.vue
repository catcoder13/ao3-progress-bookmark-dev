<template>
<div class="ipb-bookmark" :style="{top: `${pos}px`}">
  <div class="ipb-bookmark-content">
    <div class="ipb-bookmark__icon" @click="onMoveClick">
      <IpbIcon type="location" fill="" ></IpbIcon>
    </div>

    <div class="ipb-bookmark__btn">
      <button @click="removeBookmark">Remove</button>
    </div>

    <span class="ipb-bookmark__info">Chapter {{parseInt(mainBM.chI) + 1}} | {{ (mainBM.perc * 100).toFixed(2) }}%</span>  
  </div>
</div>
</template>

<script>
import { computed } from 'vue'
import {mainBM, removeBookmark, toggleBookmarkEdit} from '../bookmark'

import IpbIcon from './IpbIcon.vue'

export default {
  props: ['chapters'],
  components: { IpbIcon },
  setup (p) {
    const pos = computed(() => p.chapters[mainBM.chI].top + p.chapters[mainBM.chI].height * mainBM.perc)

    const onMoveClick = () => {
      toggleBookmarkEdit(p.chapters)
    }
    return {mainBM, pos, onMoveClick, removeBookmark}
  }
}
</script>

<style lang="scss">
$bm_blue: #3caaaa;
$ao3_red: #900;

.ipb-bookmark {
  position: absolute;
  width: 100%;
  max-width: 1130px;
  left: 50%;
  transform: translate(-50%, -50%);

  &.bmInProgress.ipb-bookmark { opacity: 0.3; pointer-events: none; }

  .ipb-bookmark-content {
    position: absolute;
    top: -17px;
    right: 0;

    .ipb-bookmark__icon {
      position: relative;
      cursor: pointer;
      width: 25px;
      height: 25px;
      margin: 5px;

      .ipb-icon {
        position: absolute;
        width: 100%;
        height: 100%;
        transition: transform 0.2s;
        
        path { 
          fill: $ao3_red;
          transition: fill 0.2s;
        }

        &:hover { transform: scale(1.2); }
      }
    }

    &:hover {
      .ipb-icon path { fill: #FFF; }

      .ipb-bookmark__info { display: block; }

      .ipb-bookmark__btn {
        max-width: 500px;
        opacity: 1;
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
    background-color: #900;
    padding: 5px 35px 5px 5px;
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
    opacity: 0;
    max-width: 0;
    transition: opacity 0.5s, max-width 0.5s;

    button {
      cursor: pointer;
      font-size: 12px;
      line-height: 1;
      margin-right: 5px;
    }
  }

  .ipb-bookmark__info {
    display: none;
    position: absolute;
    font-size: 12px;
    background-color: #ddd;
    top: 40px;
    right: 0;
    white-space: nowrap;
    padding: 4px 8px;

    &::before {
      content: '';
      position: absolute;
      right: 8px;
      top: -5px;
      width: 0; 
      height: 0; 
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 6px solid #ddd;
    }
  }

  
}

</style>