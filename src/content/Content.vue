<template v-if="chapters">
  <NavBar :chapters="chapters" :curChI="curChI"></NavBar>

  <div class="toolbar" :class="{'inView': showToolbar}" @mouseenter="showToolbar = true" @mouseleave="showToolbar = false">
    <span class="bm-pos" @click="togglePercBookmark">{{canBookmarkPerc ? 'Stop' : 'Start'}} bookmark</span>
    <span class="prev-bm-button">Prev</span>
    <span class="next-bm-button">Next</span>
    <button @click="clearLocalStorage">Clear local storage</button>
  </div>

  <div v-if="percBM.show" class="perc-bookmark-indicator" :class="percBookmarkIndicatorClass(percBM.invalid)" :style="{top: `${percBM.y}px`}">
    <div class="perc-bookmark-indicator__button">
      <span class="add" @click="onPercBMAddClick" :class="{disable: percBM.invalid}">Add</span>
      <span class="done" @click="onPercBMDoneClick">Done</span>
    </div>
    <span v-if="percBM.invalid === 0" class="perc-bookmark-indicator__info">Chapter {{parseInt(percBM.chI) + 1}} | progress: {{ (percBM.precise * 100).toFixed(2) }}%</span>
    <span v-else-if="percBM.invalid === 1" class="perc-bookmark-indicator__info">Too close to existing bookmark!</span>
    <span v-else class="perc-bookmark-indicator__info">Out of chapter range!</span>
  </div>
  
  <BookmarkElems :chapters="chapters" :curChI="curChI"></BookmarkElems>
</template>

<script>
import {ref, reactive} from 'vue'
import {addPercBookmark, removePercBookmark} from './bookmark'
import {clearLocalStorage} from './store'
import {chapters, curChI} from './page'

import NavBar from './components/NavBar.vue'
import BookmarkElems from './components/BookmarkElems.vue'
import { mainContent } from './static'

let onMouseMove = null
export default {
  name: 'App',
  components: {NavBar, BookmarkElems},
  setup () {
    const showToolbar = ref(false)

    const canBookmarkPerc = ref(false)
    const percBM = reactive({ y: window.innerHeight / 2, precise: 0, show: false, invalid: 0 }) 

    const togglePercBookmark = e => {
      canBookmarkPerc.value = !canBookmarkPerc.value
      mainContent.classList.toggle('bmInProgress', canBookmarkPerc.value)
      let clientY = 0
      if (!onMouseMove) onMouseMove = e => {
        clientY = e.clientY || clientY
        const clickedY = window.scrollY + clientY

        let newPerc = 0
        let hoverCH = Object.keys(chapters)[0]
        let lastTop = chapters[hoverCH].top
        Object.keys(chapters).some(chI => {
          if (chapters[chI].top < clickedY) {
            lastTop = chapters[chI].top
            hoverCH = chI
            return false
          }
          return true
        })

        newPerc = (clickedY - lastTop) / chapters[hoverCH].height
        percBM.y = e.clientY
        

        if (newPerc > 0 && newPerc < 1) {
          // if cursor is too close to one of the existing perc bm
          if (chapters[hoverCH].percBM.some(({perc}) => Math.abs(perc - newPerc) < 0.01)) {
            percBM.invalid = 1
            console.log('too close to existing bm')
          } else {
            percBM.invalid = 0
            percBM.chI = hoverCH
            percBM.precise = newPerc
            // console.log('ch: ', parseInt(hoverCH) + 1, 'perc: ', newPerc)
          }
        } else {
          percBM.invalid = 2
          console.log('exceed perc bookmark area')
        }
      }

      percBM.show = canBookmarkPerc.value
      if (canBookmarkPerc.value) {
        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('scroll', onMouseMove)
      } else {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('scroll', onMouseMove)
      }
    } // togglePercBookmark

    const onPercBMAddClick = () => {
      if (percBM.invalid) return
      addPercBookmark(chapters, percBM.chI, percBM.precise)
    }

    const onPercBMDoneClick = () => {
      canBookmarkPerc.value = false
      percBM.show = false
      mainContent.classList.toggle('bmInProgress', false)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('scroll', onMouseMove)
    }

    const percBookmarkIndicatorClass = invalidMode => {
      return {
        'outOfRange': invalidMode === 2,
        'tooCloseToBM': invalidMode === 1
      }
    }

    return {chapters, curChI,
            removePercBookmark, showToolbar, canBookmarkPerc,
            togglePercBookmark, onPercBMAddClick, onPercBMDoneClick, percBookmarkIndicatorClass, percBM,
            clearLocalStorage}
  }
}
</script>

<style lang="scss">
.ao3-in-page-bookmark {
  font-family: sans-serif;
  font-size: 17px;

  .toolbar {
    position: fixed;
    z-index: 99;
    right: 0;
    top: 50%;
    padding: 10px;
    transform: translate(100%, -50%);
    background-color: red;
    font-size: 10px;
    transition: transform 0.2s;

    &::before {
      content: '';
      position: absolute;
      top: 5px;
      left: -20px;
      width: 20px;
      height: 20px;
      background-color: red;

    }

    &.inView {
      transform: translate(0, -50%);
    }

    & > span {
      display: block;
      padding: 3px 7px;
      margin-bottom: 5px;
      background-color: whitesmoke;
      border-radius: 20px;
      cursor: pointer;
    }
  }

  .perc-bookmark-indicator {
    position: fixed;
    z-index: 2;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    top: 200px;
    width: 100%;
    max-width: 1100px;
    padding: 20px;
    background-color: rgba(#444444, 0.6);
    box-sizing: border-box;
    transform: translate(-50%, -50%);
    color: white;
    user-select: none;
    
    &.outOfRange { background-color: rgba(red, 0.3); }
    &.tooCloseToBM { background-color: rgba(red, 0.3); }

    // &::before {
    //   content: '';
    //   position: absolute;
    //   width: 100%;
    //   display: block;
    //   border-bottom: 2px dotted #444444;
    //   pointer-events: none;
    //   top: 50%;
    //   left: 0;
    //   transform: translateY(-50%);
    // }

    .perc-bookmark-indicator__info {
      font-size: 18px;
    }

    .perc-bookmark-indicator__button {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      span {
        display: inline-block;
        cursor: pointer;
        pointer-events: all;
        margin-right: 2px;
        background-color: #dddddd;
        border-radius: 3px;
        transform: scale(0.9);
        transition: scale 0.2s;
        font-size: 20px;
        padding: 5px 15px;

        &:hover {
          transform: scale(1);
        }

        &.disable {
          pointer-events: none;
          opacity: 0.5;
        }
      }
    }
  }
} // ao3-in-page-bookmark

#workskin {
  .chapter {
    position: relative;
  }

  &.bmInProgress #chapters > .chapter {
    background-color: rgba(#444444, 0.3);
  }
}
</style>
