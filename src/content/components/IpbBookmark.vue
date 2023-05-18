<template>
<div class="ipb-bookmark" :class="{tooClose: mainBM.tooClose}" :style="{top: `${pos}px`}">
  <div title="Click to remove bookmark" class="ipb-bookmark__icon" @click="removeBookmark">
    <IpbIcon type="location"></IpbIcon>
  </div>
  <span class="ipb-bookmark__info">Chapter {{parseInt(mainBM.chI) + 1}}<br />{{ (mainBM.perc * 100).toFixed(2) }}%</span>
</div>
</template>

<script>
import {mainBM, removeBookmark} from '../bookmark'
import { computed } from 'vue'
import IpbIcon from './IpbIcon.vue'

export default {
  props: ['chapters'],
  components: { IpbIcon },
  setup (p) {
    const pos = computed(() => p.chapters[mainBM.chI].top + p.chapters[mainBM.chI].height * mainBM.perc)

    return {mainBM, pos, removeBookmark}
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

  &.tooClose {
    &::before { display: block; }

    .ipb-bookmark__icon::before { opacity: 1; }
    &.bmInProgress .ipb-bookmark__icon .ipb-icon { opacity: 0.3; }
  }

  &::before {
    content: '';
    position: absolute;
    right: 15px;
    width: 70px;
    display: none;
    border-bottom: 2px dashed $ao3_red;
    opacity: 0.5;
  }

  &.bmInProgress .ipb-bookmark__icon .ipb-icon { opacity: 1; }

  .ipb-bookmark__icon {
    position: absolute;
    right: 0;
    transform: translateY(-50%);
    z-index: 1;
    width: 25px;
    height: 25px;
    cursor: pointer;
    overflow: hidden;
    
    .ipb-icon {
      width: 100%;
      height: 100%;
      opacity: 0.3; 
      transition: opacity 0.2s;
    }
    
    &::before {
      content: '\2613';
      position: absolute;
      top: 0;
      left: 4px;
      color: $ao3_red;
      text-shadow: 0px 0px 3px #FFF;
      font-size: 25px;
      font-weight: 700;
      line-height: 1;
      opacity: 0;
    }
    
    &:hover {
      // .ipb-icon { opacity: 1; }

      &::before {  opacity: 1; }
      
      & ~ .ipb-bookmark__info {display: block;}
    }
  }

  .ipb-bookmark__info {
    display: none;
    right: 0;
    position: absolute;
    font-size: 12px;
    background-color: #cccccc;
    padding: 2px 4px;
    top: 23px;
    text-align: right;

    &::before {
      content: '';
      position: absolute;
      right: 6px;
      top: -5px;
      width: 0; 
      height: 0; 
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 6px solid #cccccc;
    }
  }
}

</style>