<template v-if="percBMElems.length">
  <div class="perc-bm" v-for="({id, chI, perc, pos}, i) in percBMElems" :key="i" :style="{top: `${pos}px`}">
    <span class='perc-bm__desc'>Chapter {{parseInt(chI) + 1}} | {{perc}}%</span>
    <span class='remove' @click="() => removePercBookmark(chapters, chI, id)">&#10006;</span>`
  </div>
</template>

<script>
import { fullViewMode } from '../static'
import {removePercBookmark} from '../bookmark'
import { computed } from 'vue'
export default {
  props: ['chapters', 'curChI'],
  setup (props) {
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

    return {percBMElems, removePercBookmark}
  }
}
</script>

<style lang="scss">
.perc-bm {
  position: absolute;
  left: 0;
  z-index: 1;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    display: block;
    border-bottom: 2px dotted green;
    opacity: 0.5;
  }

  span.perc-bm__desc {
    position: absolute;
    right: 0;
    font-size: 10px;
    background-color: green;
    color: #FFFFFF;
    padding: 1px 3px;
  }

  span.remove {
    cursor: pointer;
  }
}
</style>