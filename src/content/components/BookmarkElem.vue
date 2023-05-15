<template>
<div class="perc-bm" :class="{tooClose: mainBM.tooClose}" :style="{top: `${pos}px`}">
  <div class="cross" @click="removeBookmark">&#10006;</div>
  <span class="info">Chapter {{parseInt(mainBM.chI) + 1}}<br />{{ (mainBM.perc * 100).toFixed(2) }}%</span>
</div>
</template>

<script>
import {mainBM, removeBookmark} from '../bookmark'
import { computed } from 'vue'
export default {
  props: ['chapters'],
  setup (p) {
    const pos = computed(() => p.chapters[mainBM.chI].top + p.chapters[mainBM.chI].height * mainBM.perc)

    return {mainBM, pos, removeBookmark}
  }
}
</script>

<style lang="scss">
$bm_blue: #3caaaa;

.perc-bm {
  position: absolute;
  width: 100%;
  max-width: 1130px;
  left: 50%;
  transform: translate(-50%, -50%);

  &.tooClose {
    &::before { display: block; border-bottom: 2px dashed red; }

    .cross { 
      background-color: red;
      font-size: 10px;
    }
  }

  &::before {
    content: '';
    position: absolute;
    right: 0;
    width: 100px;
    display: none;
    border-bottom: 2px dashed green;
    opacity: 0.5;
  }

  &.canBookmarkPerc .cross {
    opacity: 1;
  }

  .cross {
    position: absolute;
    right: 0;
    transform: translateY(-50%);
    z-index: 1;
    border-radius: 50%;
    width: 15px;
    height: 15px;
    background-color: $bm_blue;
    cursor: pointer;
    line-height: 15px;
    font-size: 0px;
    color: #ffffff;
    text-align: center;
    opacity: 0.3;

    &:hover {
      opacity: 1;
      font-size: 10px;
      background-color: red;

      & ~ .info {display: block;}
    } 
  }

  .info {
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