<template>
  <div class="ipb-editor" :class="percBookmarkIndicatorClass()" :style="{top: `${editBM.y}px`}">
    <span class="ipb-editor__remark" v-if="editBM.invalid">Out of bookmark region</span>
    <div class="ipb-editor-content">
      <div class="ipb-editor__btn">
        <button @click="onPercBMDoneClick">Cancel</button>
      </div>

      <div class="ipb-editor__icon" @click="onPercBMAddClick">
        <IpbIcon type="location"></IpbIcon>
      </div>

      
      <div class="ipb-editor__info" v-if="!editBM.invalid">
        <template v-if="mainBM.chI != null">
          <span :style="{opacity: 0.6}">Old bookmark: Chapter {{parseInt(mainBM.chI) + 1}} | {{ (mainBM.perc * 100).toFixed(2) }}%</span>
          <span>New bookmark: Chapter {{parseInt(editBM.chI) + 1}} | {{ (editBM.perc * 100).toFixed(2) }}%</span>
        </template>
        <span v-else>Chapter {{parseInt(editBM.chI) + 1}} | {{ (editBM.perc * 100).toFixed(2) }}%</span>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, watch, reactive } from 'vue'
import { updateBookmark, onBookmarkEnd, mainBM } from '../bookmark'
import { mousePos } from '../mousePos'
import IpbIcon from '@/common/IpbIcon.vue'

export default {
  props: ['chapters'],
  components: { IpbIcon },
  setup (p) {
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
.ipb-editor {
  position: fixed;
  z-index: 100;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 1130px;
  height: 33px;
  pointer-events: none;

  &.outOfRange {
    background-color: rgba(red, 0.3);

    .ipb-editor__icon {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  .ipb-editor__remark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .ipb-editor-content {
    position: absolute;
    top: 0;
    right: 0;
    pointer-events: all;
  }

  .ipb-editor__icon {
    position: relative;
    width: 25px;
    height: 25px;
    margin: 5px;
    cursor: pointer;

    .ipb-icon {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      animation: bookmarkFade 0.5s infinite alternate;
    }
  }

  .ipb-editor__btn {
    position: absolute;
    z-index: -1;
    top: 0;
    right: 0;
    overflow: hidden;
    white-space: nowrap;
    padding: 5px 35px 5px 5px;
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;

    &:hover {
      button { filter: brightness(0.95); }

      & ~ .ipb-editor__icon .ipb-icon {
        opacity: 0.3;
        animation: none;
      }
    } 

    button {
      cursor: pointer;
      font-size: 12px;
      line-height: 1;
      margin-right: 5px;

      
    }
  }

  .ipb-editor__info {
    position: absolute;
    font-size: 12px;
    background-color: #ddd;
    text-align: right;
    top: 45px;
    right: 0;
    padding: 4px 8px;

    span {
      display: block;
      white-space: nowrap;
    }

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
} // ipb-editor

.ipb-editor.ipb-left {
  .ipb-editor-content {
    left: 0;
    right: auto;

    .ipb-editor__btn {
      right: auto;
      left: 0;
      padding: 5px 5px 5px 35px;
    }

    .ipb-editor__info {
      right: auto;
      left: 0;
      
      &::before {
        right: auto;
        left: 8px;
      }
    }
  }
}

@keyframes bookmarkFade {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.3);
  }
}
</style>