<template>
  <div class="ipb-editor" :class="percBookmarkIndicatorClass()" :style="{top: `${editBM.y}px`}">
    <div class="ipb-editor__window">
      <template v-if="editBM.invalid">
        <span class="ipb-editor__window__header">Out of bookmark region</span>
        <div class="ipb-editor__window__button-group">
            <span class="done" @click="onPercBMDoneClick">Done</span>
        </div>
        <span class="ipb-editor__window__remark">-</span>
      </template>
      
      <template v-else-if="mainBM.chI != null">

        <template v-if="mainBM.tooClose">
          <span class="ipb-editor__window__header">Remove bookmark</span>
          <div class="ipb-editor__window__button-group">
            <span class="add" @click="onPercBookmarkRemoveClick">Remove</span>
            <span class="done" @click="onPercBMDoneClick">Done</span>
          </div>
          <div class="ipb-editor__window__remark">
            <span :style="{opacity: 0.6}">Old location: Chapter {{parseInt(mainBM.chI) + 1}} | {{ (mainBM.perc * 100).toFixed(2) }}%</span>
          </div>
        </template>

        <template v-else>
          <span class="ipb-editor__window__header">Change bookmark location</span>
          <div class="ipb-editor__window__button-group">
            <span class="add" @click="onPercBMAddClick">Change</span>
            <span class="done" @click="onPercBMDoneClick">Done</span>
          </div>
          <div class="ipb-editor__window__remark">
            <span :style="{opacity: 0.6}">Old location: Chapter {{parseInt(mainBM.chI) + 1}} | {{ (mainBM.perc * 100).toFixed(2) }}%</span>
            <span>New location: Chapter {{parseInt(editBM.chI) + 1}} | {{ (editBM.perc * 100).toFixed(2) }}%</span>
          </div>
        </template>
      </template>
      
      <template v-else>
        <span class="ipb-editor__window__header">Add a new bookmark</span>
        <div class="ipb-editor__window__button-group">
            <span class="add" @click="onPercBMAddClick">Add</span>
            <span class="done" @click="onPercBMDoneClick">Done</span>
        </div>
        <span class="ipb-editor__window__remark">New location: Chapter {{parseInt(editBM.chI) + 1}} | {{ (editBM.perc * 100).toFixed(2) }}%</span>
      </template>
    </div>
    
    <div class="ipb-editor__mark"><IpbIcon type="location"></IpbIcon></div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, watch, reactive } from 'vue'
import { updateBookmark, removeBookmark, mainBM } from '../bookmark'
import { mousePos } from '../mousePos'
import IpbIcon from './IpbIcon.vue'

export default {
  props: ['chapters'],
  emits: ['finish'],
  components: { IpbIcon },
  setup (p, {emit}) {
    const editBM = reactive({ y: 100, perc: 0, invalid: 0 })

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
        // check if cursor is too close to one of the existing perc bm
        mainBM.tooClose = mainBM.chI && mainBM.chI == hoverCH && Math.abs(mainBM.perc - newPerc) < 0.003
        editBM.chI = hoverCH
        editBM.perc = newPerc

      } else { // exceed bookmark area
        mainBM.tooClose = false
        editBM.invalid = 1
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
      updateBookmark(editBM.chI, editBM.perc)
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

.ipb-editor {
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
    .ipb-editor__mark { display: none;}
  }

  .ipb-editor__window {
    pointer-events: all;
    position: relative;
    box-sizing: border-box;
    float: right;
    width: 220px;
    height: 105px;
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

  .ipb-editor__mark {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: 25px;
    height: 25px;
    
    .ipb-icon {
      position: absolute;
      top: 0;
      left: 0;
      animation: bookmarkFade 0.5s infinite alternate;
    }
  }

  .ipb-editor__window__header {
    display: block;
    font-size: 14px;
    font-weight: 700;
  }

  .ipb-editor__window__remark {
    font-size: 13px;
    white-space: nowrap;

    span {
      display: block;
      white-space: nowrap;
    }
  }

  .ipb-editor__window__button-group {
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
      color:#FFF;
      padding: 8px 0;
      text-align: center;

      &:not(.disable):hover {
        transform: scale(1);
      }

      &.add { background-color: $ao3_red; }
      // &.remove { background-color: $red; }
      &.done { width: 55px; color: #333; }
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