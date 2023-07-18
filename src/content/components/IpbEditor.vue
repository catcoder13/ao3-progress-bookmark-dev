<template>
  <div class="ao3pb-bookmark ao3pb-bookmark--editor" :style="{top: `${editBM.y}px`}">
    <span class="ao3pb-bookmark__remark" v-if="editBM.invalid">Out of bookmark region</span>
    <div class="ao3pb-bookmark-content">
      <div class="ao3pb-bookmark__btn">
        <div class="ao3pb-cancel" title="Cancel" @click="stopBookmarkEdit">&#10006;</div>
        <div v-if="!editBM.invalid" class="ao3pb-confirm" title="Confirm" @click="onUpdateBookmark">&#10003;</div>
      </div>

      <div class="ao3pb-bookmark__icon">
        <IpbIcon type="location"></IpbIcon>
      </div>

      <div class="ao3pb-bookmark__info" v-if="!editBM.invalid">
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
import { updateBookmark, stopBookmarkEdit, mainBM } from '../js/bookmark'
import { mousePos } from '../js/mousePos'

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

    const onUpdateBookmark = () => {
      if (editBM.invalid) return

      updateBookmark(editBM.chI, editBM.perc.toFixed(5))
      
      stopBookmarkEdit()
    }

    return { 
      editBM, mainBM,
      onUpdateBookmark, stopBookmarkEdit
    }
  }
}
</script>

<style lang="scss">
.ao3pb-bookmark.ao3pb-bookmark--editor {
  position: fixed;
  z-index: 100;
  pointer-events: none;

  .ao3pb-bookmark__remark {
    position: absolute;
    z-index: -1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: block;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    background-color: rgba(red, 0.3);
    text-align: center;
    pointer-events: none;
  }

  .ao3pb-bookmark-content {
    pointer-events: all;

    .ao3pb-bookmark__btn {
      & > div {
        line-height: 25px;
        font-size: 22px;
        font-weight: bold;
        color: grey;

        &:hover {
          transition: font-size 0.2s;
          font-size: 26px; 
          color: #333;
        }
      }
      
    }

    .ao3pb-bookmark__icon { opacity: 0.5; }

    .ao3pb-bookmark__info {
      text-align: right;
      
      span {
        display: block;
        white-space: nowrap;

        &:first-child:not(:only-child) { padding-bottom: 2px; }
      }
    }
  } // ao3pb-bookmark-content

  
} // ao3pb-bookmark
</style>