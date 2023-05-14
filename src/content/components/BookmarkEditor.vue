<template>
  <div class="perc-bookmark-indicator" :class="percBookmarkIndicatorClass()" :style="{top: `${percBM.y}px`}">
    <div>
      <span v-if="percBM.invalid" class="perc-bookmark-indicator__info">Out of bookmark region</span>
      <span v-else-if="tooCloseBM" class="perc-bookmark-indicator__info">Bookmarked</span>
      <span v-else class="perc-bookmark-indicator__info">Add bookmark</span>

      <div class="perc-bookmark-indicator__button">
        <span v-if="!tooCloseBM" class="add" @click="onPercBMAddClick" :class="{disable: percBM.invalid || !!tooCloseBM}">Add</span>
        <span v-else class="remove" @click="onPercBookmarkRemoveClick" :class="{disable: !tooCloseBM}">Remove</span>
        <span class="done" @click="onPercBMDoneClick">Done</span>
      </div>
      
      <span v-if="percBM.invalid" class="remark">-</span>
      <span v-else-if="tooCloseBM" class="remark">Chapter {{parseInt(tooCloseBM.chI) + 1}} | progress: {{ (tooCloseBM.perc * 100).toFixed(2) }}%</span>
      <span v-else class="remark">Chapter {{parseInt(percBM.chI) + 1}} | progress: {{ (percBM.precise * 100).toFixed(2) }}%</span>
    </div>
    
    <span class="perc-bm-dummy">&#10006;</span>
  </div>
</template>

<script>
import { onMounted, onUnmounted, reactive } from 'vue'
import { tooCloseBM, addPercBookmark, removePercBookmark } from '../bookmark'

export default {
  props: ['chapters'],
  emits: ['finish'],
  setup (p, {emit}) {
    const percBM = reactive({ y: window.innerHeight / 2, precise: 0, invalid: 0 }) 

    let clientY = 0
    const onMouseMove = e => {
      clientY = e.clientY || clientY
      const clickedY = window.scrollY + clientY

      let newPerc = 0
      let hoverCH = Object.keys(p.chapters)[0]
      let lastTop = p.chapters[hoverCH].top

      Object.keys(p.chapters).some(chI => {
        if (p.chapters[chI].top < clickedY) {
          lastTop = p.chapters[chI].top
          hoverCH = chI
          return false
        }
        return true
      })

      newPerc = (clickedY - lastTop) / p.chapters[hoverCH].height
      percBM.y = e.clientY
      

      if (newPerc > 0 && newPerc < 1) {
        percBM.invalid = 0
        // if cursor is too close to one of the existing perc bm
        const hasTooClose = p.chapters[hoverCH].percBM.some((bm) => {
          const tooClose = Math.abs(bm.perc - newPerc) < 0.005
          if (tooClose) tooCloseBM.value = {...bm, chI: hoverCH}
          return tooClose
        })
        if (hasTooClose) {
          console.log('too close to existing bm')
        } else {
          tooCloseBM.value = null
          percBM.chI = hoverCH
          percBM.precise = newPerc
        }
      } else {
        tooCloseBM.value = null
        percBM.invalid = 1
        console.log('exceed perc bookmark area')
      }
    } // onMouseMove
      
    onMounted(() => {
      console.log('on mounted')
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('scroll', onMouseMove)
    }) // on mounted

    onUnmounted(() => {
      console.log('on unmounted')
      tooCloseBM.value = null
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('scroll', onMouseMove)
    })

    const onPercBMAddClick = () => {
      if (percBM.invalid || !!tooCloseBM.value) return
      addPercBookmark(p.chapters, percBM.chI, percBM.precise)
    }

    const onPercBookmarkRemoveClick = () => {
      if (!tooCloseBM.value) return
      removePercBookmark(p.chapters, tooCloseBM.value.chI, tooCloseBM.value.id)
    }

    const onPercBMDoneClick = () => {
      tooCloseBM.value = null
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('scroll', onMouseMove)
      emit('finish')
    }

    const percBookmarkIndicatorClass = () => {
      return {
        'outOfRange': percBM.invalid === 1,
        'tooCloseToBM': !!tooCloseBM.value
      }
    }

    return { 
      percBM, tooCloseBM,
      onPercBMAddClick, onPercBookmarkRemoveClick, onPercBMDoneClick, percBookmarkIndicatorClass
    }
  }
}
</script>

<style lang="scss">
$bm_blue: #3caaaa;
$green: #67f751;
$red: #fe4141;

.perc-bookmark-indicator {
  position: fixed;
  z-index: 2;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 1130px;
  padding: 20px;
  box-sizing: border-box;
  color: #333333;
  user-select: none;
  text-align: center;
  pointer-events: none;

  &.outOfRange,
  &.tooCloseToBM {
    &::before,
    .perc-bm-dummy { display: none;}
  }

  & > div {
    pointer-events: all;
    position: relative;
    box-sizing: border-box;
    float: right;
    width: 210px;
    height: 96px;
    margin-right: 40px;
    padding: 10px;
    background-color: $bm_blue;
    transition: background-color 0.2s;

    & > *:not(:last-child) {
      padding-bottom: 5px;
    }
  }

  &::before {
    content: '';
    position: absolute;
    width: 100px;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    display: block;
    border-bottom: 2px dashed $bm_blue;
    pointer-events: none;
    
  }

  .perc-bm-dummy {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    line-height: 1;
    font-size: 20px;
    animation: bookmarkFade 0.5s infinite alternate;
  }

  .perc-bookmark-indicator__info {
    display: block;
    font-size: 14px;
    font-weight: 700;
  }

  .remark {
    font-size: 13px;
    font-weight: 700;
  }

  .perc-bookmark-indicator__button {
    span {
      display: inline-block;
      cursor: pointer;
      pointer-events: all;
      background-color: #dddddd;
      border-radius: 3px;
      transform: scale(0.95);
      transition: transform 0.2s;
      font-size: 14px;
      font-weight: 800;
      color:#333333;
      padding: 8px 0;
      text-align: center;
      width: 82px;

      &:not(.disable):hover {
        transform: scale(1);
      }

      &.add { background-color: $green; }
      &.remove { background-color: $red; }

      &.disable {
        // pointer-events: none;
        cursor: not-allowed;
        opacity: 0.5;
      }
    }
  }
}
</style>