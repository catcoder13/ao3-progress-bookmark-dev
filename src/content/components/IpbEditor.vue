<template>
  <div class="ipb-editor" :class="percBookmarkIndicatorClass()" :style="{top: `${editBM.y}px`}">
    <div class="ipb-editor__button-group">
        <span class="done" @click="onPercBMDoneClick">Cancel</span>
    </div>

    <div class="ipb-editor__remark">
      <span v-if="editBM.invalid">Out of bookmark region</span>
      <template v-else-if="mainBM.chI != null">
        <span :style="{opacity: 0.6}">Old location: Chapter {{parseInt(mainBM.chI) + 1}} | {{ (mainBM.perc * 100).toFixed(2) }}%</span>
        <span>New location: Chapter {{parseInt(editBM.chI) + 1}} | {{ (editBM.perc * 100).toFixed(2) }}%</span>
      </template>
      <span v-else :style="{opacity: 0.6}">Chapter {{parseInt(mainBM.chI) + 1}} | {{ (mainBM.perc * 100).toFixed(2) }}%</span>
    </div>

    <div class="ipb-editor__mark" @click="onPercBMAddClick"><IpbIcon type="location"></IpbIcon></div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, watch, reactive } from 'vue'
import { updateBookmark, onBookmarkEnd, mainBM } from '../bookmark'
import { mousePos } from '../mousePos'
import IpbIcon from './IpbIcon.vue'

export default {
  props: ['chapters'],
  components: { IpbIcon },
  setup (p, {emit}) {
    const editBM = reactive({ y: mousePos.y, perc: 0, invalid: 0 })

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
        // mainBM.tooClose = mainBM.chI && mainBM.chI == hoverCH && Math.abs(mainBM.perc - newPerc) < 0.003
        editBM.chI = hoverCH
        editBM.perc = newPerc

      } else { // exceed bookmark area
        editBM.invalid = 1
      }
    } // onMouseMove
    
    watch(() => mousePos.y, newPosY => onMouseMove(null, newPosY))

    onMounted(() => {
      document.addEventListener('scroll', onMouseMove)
      onMouseMove()
    }) // on mounted

    onUnmounted(() => {
      document.removeEventListener('scroll', onMouseMove)
    })

    const onPercBMAddClick = () => {
      if (editBM.invalid) return
      updateBookmark(editBM.chI, editBM.perc.toFixed(5))
      onPercBMDoneClick()
    }


    const onPercBMDoneClick = () => {
      document.removeEventListener('scroll', onMouseMove)
      onBookmarkEnd()
    }

    const percBookmarkIndicatorClass = () => {
      return {
        'outOfRange': editBM.invalid === 1
      }
    }

    return { 
      editBM, mainBM,
      onPercBMAddClick, onPercBMDoneClick, percBookmarkIndicatorClass
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
  z-index: 100;
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
  &.outOfRange {
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

  .ipb-editor__mark {
    position: absolute;
    top: 50%;
    right: -8px;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    pointer-events: all;
    cursor: pointer;
    
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