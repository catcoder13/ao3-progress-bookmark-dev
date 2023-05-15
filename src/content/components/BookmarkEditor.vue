<template>
  <div class="perc-bookmark-indicator" :class="percBookmarkIndicatorClass()" :style="{top: `${editBM.y}px`}">
    <div>
      <span v-if="editBM.invalid" class="perc-bookmark-indicator__info">Out of bookmark region</span>
      <span v-else-if="mainBM.tooClose" class="perc-bookmark-indicator__info">Bookmarked</span>
      <span v-else class="perc-bookmark-indicator__info">Add bookmark</span>

      <div class="perc-bookmark-indicator__button">
        <template v-if="!editBM.invalid">
          <span v-if="!mainBM.tooClose" class="add" @click="onPercBMAddClick" :class="{disable: editBM.invalid || mainBM.tooClose}">Add</span>
          <span v-else class="remove" @click="onPercBookmarkRemoveClick" :class="{disable: !mainBM.tooClose}">Remove</span>
        </template>
        <span class="done" @click="onPercBMDoneClick">Done</span>
      </div>
      
      <span v-if="editBM.invalid" class="remark">-</span>
      <span v-else-if="mainBM.tooClose" class="remark">Chapter {{parseInt(mainBM.chI) + 1}} | progress: {{ (mainBM.perc * 100).toFixed(2) }}%</span>
      <span v-else class="remark">Chapter {{parseInt(editBM.chI) + 1}} | progress: {{ (editBM.precise * 100).toFixed(2) }}%</span>
    </div>
    
    <span class="perc-bm-dummy"></span>
  </div>
</template>

<script>
import { onMounted, onUnmounted, reactive } from 'vue'
import { updateBookmark, removeBookmark, mainBM } from '../bookmark'

export default {
  props: ['chapters'],
  emits: ['finish'],
  setup (p, {emit}) {
    const editBM = reactive({ y: window.innerHeight / 2, precise: 0, invalid: 0 }) 

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
      editBM.y = e.clientY
      

      if (newPerc > 0 && newPerc < 1) {
        editBM.invalid = 0
        // if cursor is too close to one of the existing perc bm
        mainBM.tooClose = mainBM.chI && mainBM.chI == hoverCH && Math.abs(mainBM.perc - newPerc) < 0.005

        if (mainBM.tooClose) {
          console.log('too close to existing bm')
        } else {
          editBM.chI = hoverCH
          editBM.precise = newPerc
        }
      } else {
        mainBM.tooClose = false
        editBM.invalid = 1
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
      mainBM.tooClose = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('scroll', onMouseMove)
    })

    const onPercBMAddClick = () => {
      if (editBM.invalid || mainBM.tooClose) return
      updateBookmark(editBM.chI, editBM.precise)
    }

    const onPercBookmarkRemoveClick = () => {
      if (!mainBM.tooClose) return
      removeBookmark()
    }

    const onPercBMDoneClick = () => {
      mainBM.tooClose = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('scroll', onMouseMove)
      emit('finish')
    }

    const percBookmarkIndicatorClass = () => {
      return {
        'outOfRange': editBM.invalid === 1,
        'tooCloseToBM': mainBM.tooClose
      }
    }

    return { 
      editBM, mainBM,
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

  &.outOfRange > div { background-color: rgba($bm_blue, 0.2);}
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
    margin-right: 50px;
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
    width: 80px;
    top: 50%;
    transform: translateY(-50%);
    right: 15px;
    display: block;
    border-bottom: 2px dashed $bm_blue;
    pointer-events: none;
    
  }

  .perc-bm-dummy {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: $bm_blue;
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

@keyframes bookmarkFade {
  0% {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }

  100% {
    opacity: 0.5;
    transform: translateY(-50%) scale(1.2);
  }
}
</style>