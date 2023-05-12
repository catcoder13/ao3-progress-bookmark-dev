<template v-if="chapters">
  <div class="navbar" :class="navBarClass()">
    <div class="chapter-progress">
      <div class="chapter-progress__bar" v-for="({progress, percBM}, chI) in chapters" :key="chI"
        :class="chapterProgressBarClass(chI)">
        <div class="progress" v-if="chI == curChI" :style="{width: `${progress}%`}"></div>
        <template v-if="chI == curChI && percBM.length > 0 && progress > 0 && progress < 100">
          <span v-for="(pos, i) in currentChBMPos" :key="i" :style="{left: `${pos}%`}"></span>
        </template>
        <div class="chapter-info">
          Chapter {{chI + 1}}: {{chapters[chI].title}}
        </div>
      </div>
    </div>
  </div>
  <!-- <div class="chapter-info"></div> -->
  <div class="toolbar">
    <span class="bm-pos" @click="togglePercBookmark">Bookmark by position <span class="bm-icon"></span></span>
    <button @click="clearLocalStorage">Clear local storage</button>
  </div>

  <div class="perc-bookmark-indicator" :class="percBookmarkIndicatorClass(percBM.invalid)" :style="{top: `${percBM.y}px`, display: percBM.show ? 'block' : 'none'}">
    <div class="perc-bookmark-indicator__button">
      <span class="add" @click="onPercBMAddClick" v-if="percBM.invalid === 0">Add</span>
      <span class="done" @click="onPercBMDoneClick">Done</span>
    </div>
    <span class="perc-bookmark-indicator__info">Chapter {{parseInt(percBM.chI) + 1}} | progress: {{ (percBM.precise * 100).toFixed(2) }}%</span>
  </div>
  
  <template v-if="percBMElems.length">
    <div class="perc-bm" v-for="({id, chI, perc, pos}, i) in percBMElems" :key="i" :style="{top: `${pos}px`}">
      <span class='perc-bm__desc'>Chapter {{parseInt(chI) + 1}} | {{perc}}%</span>
      <span class='remove' @click="() => removePercBookmark(chapters, chI, id)">&#10006;</span>`
    </div>
  </template>
</template>

<script>
import {ref, computed, reactive} from 'vue'
import {addPercBookmark, removePercBookmark} from './bookmark'
import {clearLocalStorage} from './store'
import { chapters, curChI} from './page'
import { fullViewMode } from './static'

let onMouseMove = null
export default {
  name: 'App',
  setup () {
    const hoverChInfo = ref('')
    const chapterProgressBarClass = chI => {
      return {
        'isCurrent': chI == curChI.value && chapters[chI].progress < 100,
        'hasBM': chapters[chI].percBM.length > 0,
        'empty': chI >= curChI.value && chapters[chI].progress < 100
      }
    }

    const navBarClass = () => {
      const chIndices = Object.keys(chapters)
      const enterView = chIndices[0] < curChI.value || chapters[curChI.value].progress > 0
      const exitView = chapters[chIndices[chIndices.length - 1]].progress == 100
      return {
        show: enterView && !exitView
      }
    }

    const currentChBMPos = computed(() => chapters[curChI.value].percBM.map(({perc}) => perc * 100))

    const percBMElems = computed(() => {
      if (fullViewMode) {
        return Object.keys(chapters).reduce((acc, chI) => {
          chapters[chI].percBM.forEach(({id, perc}) => {
            acc.push({
              id: id,
              chI: chI,
              perc: (perc * 100).toFixed(2),
              pos: chapters[chI].top + chapters[chI].height * perc
            })
          })
          return acc
        }, [])
      }

      return chapters[curChI.value].percBM.map(({id, perc}) => {
        return {
          id: id,
          chI: curChI.value,
          perc: (perc * 100).toFixed(2),
          pos: chapters[curChI.value].top + chapters[curChI.value].height * perc
        }
      })
      
    })

    const canBookmarkPerc = ref(false)
    const percBM = reactive({ y: 0, precise: 0, show: false, invalid: 0 }) 

    const togglePercBookmark = e => {
      canBookmarkPerc.value = !canBookmarkPerc.value

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
        percBM.chI = hoverCH
        percBM.precise = newPerc

        if (newPerc > 0 && newPerc < 1) {
          // if cursor is too close to one of the existing perc bm
          if (chapters[hoverCH].percBM.some(({perc}) => Math.abs(perc - newPerc) < 0.01)) {
            console.log('too close to existing bm')
            percBM.invalid = 1
          } else {
            percBM.invalid = 0
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
      addPercBookmark(chapters, percBM.chI, percBM.precise)
    }

    const onPercBMDoneClick = () => {
      canBookmarkPerc.value = false
      percBM.show = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('scroll', onMouseMove)
    }

    const percBookmarkIndicatorClass = invalidMode => {
      return {
        'outOfRange': invalidMode === 2,
        'tooCloseToBM': invalidMode === 1
      }
    }

    return {chapters, curChI, currentChBMPos, percBMElems, navBarClass, chapterProgressBarClass,
            removePercBookmark,
            togglePercBookmark, onPercBMAddClick, onPercBMDoneClick, percBookmarkIndicatorClass, percBM,
            clearLocalStorage}
  }
}
</script>

<style lang="scss">
$bm_color: #9cdddd;
$bm_darken_color: #22a5a5;
$bar_color: #999999;
$bar_darken_color: #444444;


.ao3-in-page-bookmark {
  font-family: sans-serif;
  font-size: 17px;

  .navbar {
    position: fixed;
    z-index: 99;
    top: 0;
    left: 0;
    width: 100%;
    // max-height: 0;
    // opacity: 0;
    // transition: max-height 0.2s, opacity 0.2s;

    // &.show {max-height: 100px; opacity: 1;}
    // &.show .nav-info {
    //   opacity: 1;
    //   pointer-events: all;
    // }

    &:not(.show) .chapter-progress .chapter-progress__bar.isCurrent {
      flex: 1;
      height: 4px;
    }

    .chapter-progress {
      display: flex;
      // overflow: hidden;
      background-color: #FFFFFF;
      height: 6px;

      .chapter-progress__bar {
        position: relative;
        bottom: 0;
        background-color: $bar_darken_color;
        border-right: 1px solid #FFFFFF;
        box-sizing: border-box;
        transition: height 0.2s, flex 0.2s;
        height: 4px;
        flex: 1;
        
        &.isCurrent {
          flex: 200px;
          height: 100%;
          background-color: $bar_color;

          .progress {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background-color: $bar_darken_color;
          }
        }

        &.hasBM { background-color: $bm_darken_color; }

        &.empty {
          background-color: $bar_color;

          &.hasBM {
            background-color: $bm_color;

            .progress { background-color: $bm_darken_color;}
          }
        }

        & > span {
          position: absolute;
          top: 0;
          width: 0px;
          border-left: 1px solid #000000;
          height: 100%;
          font-size: 10px;
        }

        &:hover .chapter-info { display: inline-block;}
        
        .chapter-info {
          position: absolute;
          left: 0;
          top: 6px;
          display: none;
          font-size: 12px;
          line-height: 1;
          padding: 4px 10px;
          box-sizing: border-box;
          background-color: rgba(#FFFFFF, 0.5);
          pointer-events: none;
        }
      } // chapter-progress__bar

      
    }
  } // navbar

  .toolbar {
    position: fixed;
    z-index: 99;
    right: 0;
    top: 50%;
    padding: 10px;
    transform: translateY(-50%);
    background-color: red;
    font-size: 10px;

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
    transform: translate(-50%, -50%);
    top: 200px;
    width: 100%;
    max-width: 1100px;
    padding: 20px;
    background-color: rgba(#444444, 0.3);
    box-sizing: border-box;
    transform: translate(-50%, -50%);
    color: white;
    
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
      }
    }
  }
} // ao3-in-page-bookmark

#workskin {
  .chapter {
    position: relative;
  }
} 

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
