<template v-if="percBMElems.length">
<div :class="percBMWrapperClass(chI, id)" v-for="({id, chI, perc, pos}, i) in percBMElems" :key="i" :style="{top: `${pos}px`}">
  <div class="perc-bm" @click="() => removePercBookmark(chapters, chI, id)">&#10006;</div>
  <span class="info">Chapter {{parseInt(chI) + 1}}<br />{{ perc }}%</span>
</div>
</template>

<script>
import { fullViewMode } from '../static'
import {removePercBookmark, tooCloseBM} from '../bookmark'
import { computed } from 'vue'
export default {
  props: ['chapters', 'curChI', 'canBookmarkPerc'],
  setup (props) {

    const percBMWrapperClass = (chI, id) => {
      const isTargetBM = tooCloseBM.value && (chI == tooCloseBM.value.chI && id == tooCloseBM.value.id)
      return {
        'perc-bm__wrapper': true,
        tooClose: isTargetBM,
        canBookmarkPerc: props.canBookmarkPerc
      }
    }
    const percBMElems = computed(() => {
      if (fullViewMode) {
        return Object.keys(props.chapters).reduce((acc, chI) => {
          props.chapters[chI].percBM.forEach(({id, perc}) => {
            acc.push({
              id: id,
              chI: chI,
              perc: (perc * 100).toFixed(2),
              pos: props.chapters[chI].top + props.chapters[chI].height * perc
            })
          })
          return acc
        }, [])
      }

      return props.chapters[props.curChI].percBM.map(({id, perc}) => {
        return {
          id: id,
          chI: props.curChI,
          perc: (perc * 100).toFixed(2),
          pos: props.chapters[props.curChI].top + props.chapters[props.curChI].height * perc
        }
      })
      
    })

    return {percBMWrapperClass, percBMElems, removePercBookmark, tooCloseBM}
  }
}
</script>

<style lang="scss">
$bm_blue: #3caaaa;

.perc-bm__wrapper {
  position: absolute;
  width: 100%;
  max-width: 1130px;
  left: 50%;
  transform: translate(-50%, -50%);

  &.tooClose {
    &::before { display: block; border-bottom: 3px dashed red; }

    .perc-bm { 
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

  &.canBookmarkPerc .perc-bm {
    opacity: 1;
  }

  .perc-bm {
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