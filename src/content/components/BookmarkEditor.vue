<template>
  <div class="perc-bookmark-indicator" :class="percBookmarkIndicatorClass()" :style="{top: `${editBM.y}px`}">
    <div class="perc-bookmark-indicator__content">
      <span v-if="editBM.invalid" class="perc-bookmark-indicator__info">Out of bookmark region</span>
      <span v-else-if="mainBM.tooClose" class="perc-bookmark-indicator__info">Update bookmark</span>
      <span v-else class="perc-bookmark-indicator__info">Update bookmark</span>

      <div class="perc-bookmark-indicator__button">
        <template v-if="!editBM.invalid">
          <span v-if="!mainBM.tooClose" class="add" @click="onPercBMAddClick">Bookmark</span>
          <span v-else class="remove" @click="onPercBookmarkRemoveClick">Remove</span>
        </template>
        <span class="done" @click="onPercBMDoneClick">Done</span>
      </div>
      
      <span v-if="editBM.invalid" class="remark">-</span>
      <span v-else-if="mainBM.tooClose" class="remark">Chapter {{parseInt(mainBM.chI) + 1}} | progress: {{ (mainBM.perc * 100).toFixed(2) }}%</span>
      <span v-else class="remark">Chapter {{parseInt(editBM.chI) + 1}} | progress: {{ (editBM.precise * 100).toFixed(2) }}%</span>
    </div>
    
    <div class="icon"><BookmarkIcon :mode="0"></BookmarkIcon></div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, watch, reactive } from 'vue'
import { updateBookmark, removeBookmark, mainBM } from '../bookmark'
import BookmarkIcon from './BookmarkIcon.vue'
import { mousePos } from '../cursor'

export default {
  props: ['chapters'],
  emits: ['finish'],
  components: {BookmarkIcon},
  setup (p, {emit}) {
    const editBM = reactive({ y: window.innerHeight / 2, precise: 0, invalid: 0 })

    const onMouseMove = (e, posY = editBM.y) => {
      const clickedY = window.scrollY + posY

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
      editBM.y = posY
      

      if (newPerc > 0 && newPerc < 1) {
        editBM.invalid = 0
        // if cursor is too close to one of the existing perc bm
        mainBM.tooClose = mainBM.chI && mainBM.chI == hoverCH && Math.abs(mainBM.perc - newPerc) < 0.001

        editBM.chI = hoverCH
        editBM.precise = newPerc

        if (mainBM.tooClose) console.log('too close to existing bm')

      } else {
        mainBM.tooClose = false
        editBM.invalid = 1
        console.log('exceed perc bookmark area')
      }
    } // onMouseMove
    
    watch(() => mousePos.y, newPosY => onMouseMove(null, newPosY))

    onMounted(() => {
      console.log('on mounted')
      document.addEventListener('scroll', onMouseMove)
      onMouseMove()
    }) // on mounted

    onUnmounted(() => {
      console.log('on unmounted')
      mainBM.tooClose = false
      document.removeEventListener('scroll', onMouseMove)
    })

    const onPercBMAddClick = () => {
      if (editBM.invalid || mainBM.tooClose) return
      updateBookmark(editBM.chI, editBM.precise, p.chapters[editBM.chI].chID)
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
$ao3_red: #900;

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
  color: #FFF;
  user-select: none;
  text-align: center;
  pointer-events: none;

  &.outOfRange > div { background-color: rgba(grey, 0.5);}
  &.outOfRange,
  &.tooCloseToBM {
    &::before,
    .icon { display: none;}
  }

  .perc-bookmark-indicator__content {
    pointer-events: all;
    position: relative;
    box-sizing: border-box;
    float: right;
    width: 210px;
    height: 96px;
    margin-right: 50px;
    padding: 10px;
    background-color: grey;
    transition: background-color 0.2s;

    & > *:not(:last-child) {
      padding-bottom: 5px;
    }
  }

  &::before {
    content: '';
    position: absolute;
    width: 70px;
    top: 50%;
    transform: translateY(-50%);
    right: 20px;
    display: block;
    border-bottom: 2px dashed $ao3_red;
    pointer-events: none;
    
  }

  .icon {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    
    svg {
      position: absolute;
      top: 0;
      left: 0;
      animation: bookmarkFade 0.5s infinite alternate;
    }
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
      background-color: #eeeeee;
      box-shadow: 0px 0px 5px #777;
      border-radius: 3px;
      transform: scale(0.95);
      transition: transform 0.2s;
      width: 115px;
      font-size: 14px;
      font-weight: 800;
      color:#333333;
      padding: 8px 0;
      text-align: center;

      &:not(.disable):hover {
        transform: scale(1);
      }

      &.add { background-color: $green; }
      &.remove { background-color: $red; }
      &.done { width: 55px;}
    }
  }
}

@keyframes bookmarkFade {
  0% {
    opacity: 1;
    transform: scale(1);
  }

  100% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}
</style>