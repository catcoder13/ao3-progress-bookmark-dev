<template>
  <!-- <div class="ao3-in-page-bookmark-content"> -->
    <div v-if="chapters" class="navbar" :class="navBarClass()">
      
      <div class="chapter-progress">
        <div class="chapter-progress__bar" v-for="({progress, percBMCount}, chI) in chapters" :key="chI"
          :class="chapterProgressBarClass(chI)">
          <div v-if="chI == curChI" :style="{width: `${progress}%`}"></div>
          <template v-if="chI == curChI && percBMCount > 0 && progress > 0 && progress < 100">
            <span v-for="(pos, i) in currentChBMPos" :key="i" :style="{left: `${pos}%`}"></span>
          </template>
        </div>
      </div>

      <div class="nav-info">
        Chapter {{curChI + 1}}: {{chapters[curChI].title}}
      </div>
      
    </div>
    <div class="toolbar">
      <!-- <span class="bm-para" @click="toggleParaBookmark">Bookmark by paragraph <span class="bm-icon"></span></span> -->
      <span class="bm-pos" @click="togglePercBookmark">Bookmark by position <span class="bm-icon"></span></span>
      <button @click="clearLocalStorage">Clear local storage</button>
    </div>

    <div class="perc-bookmark-indicator" :style="{top: `${percBM.y}px`, display: percBM.show ? 'block' : 'none'}">
      <div class="perc-bookmark-indicator__button">
        <span class="add" @click="onPercBMAddClick">Add</span>
        <span class="done" @click="onPercBMDoneClick">Done</span>
      </div>
      <span class="perc-bookmark-indicator__info">Chapter {{parseInt(percBM.chI) + 1}} | progress: {{ (percBM.precise * 100).toFixed(2) }}%</span>
    </div>
  <!-- </div> -->
    
</template>

<script>
import {ref, computed, reactive} from 'vue'
import {addPercBookmark} from './bookmark'
import {clearLocalStorage} from './store'
import { chapters, curChI} from './page'

let onMouseMove = null
export default {
  name: 'App',
  setup () {
    const chapterProgressBarClass = chI => {
      return {
        'isCurrent': chI == curChI.value && chapters[chI].progress < 100,
        'hasBM': chapters[chI].percBMCount > 0,
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

    const currentChBMPos = computed(() => {
      return chapters[curChI.value].percBM.map(({id, perc}) => perc * 100)
    })
    // const currentChBMPos = computed(() => {
    //   const paras = chapters[curChI.value].dom.querySelectorAll(':scope > .userstuff > p')
    //   const {height: chHeight, top: chTop} = chapters[curChI.value].dom.getBoundingClientRect()
      
    //   return Object.keys(chapters[curChI.value].paraBM).map(i => {
    //     const {top: pTop, height: pHeight} = paras[i].getBoundingClientRect()
    //     // console.log('pTop', pTop, 'chTop', chTop)
    //     return (pTop - chTop + pHeight) / chHeight * 100
    //     // return (paras[i].offsetTop + paras[i].offsetHeight) / chHeight * 100
    //   })
    // })

    // const canBookmarkPara = ref(false)
    // const toggleParaBookmark = () => {
    //   canBookmarkPara.value = !canBookmarkPara.value
    //   setupParaBookmark(canBookmarkPara.value, chapters)
    // }

    const canBookmarkPerc = ref(false)
    const percBM = reactive({ y: 0, precise: 0, show: false })

    
    const togglePercBookmark = e => {
      canBookmarkPerc.value = !canBookmarkPerc.value

      if (!onMouseMove) onMouseMove = e => {
        // console.log('client y: ', e.clientY)
        const clickedY = window.scrollY + e.clientY

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
        
        if (newPerc > 0 && newPerc < 1) {
          // if cursor is too close to one of the existing perc bm
          if (chapters[hoverCH].percBM.some(({perc}) => Math.abs(perc - newPerc) < 0.01)) {
            percBM.show = false
            console.log('too close to existing bm')
          } else {
            percBM.y = e.clientY
            percBM.chI = hoverCH
            percBM.precise = newPerc
            percBM.show = true
            console.log('ch: ', parseInt(hoverCH) + 1, 'perc: ', newPerc)
          }
        } else {
          percBM.show = false
          console.log('exceed perc bookmark area')
        }
      }

      percBM.show = canBookmarkPerc.value
      if (canBookmarkPerc.value) document.addEventListener('mousemove', onMouseMove)
      else document.removeEventListener('mousemove', onMouseMove)
    } // togglePercBookmark

    const onPercBMAddClick = () => {
      addPercBookmark(chapters, percBM.chI, percBM.precise)
    }

    const onPercBMDoneClick = () => {
      canBookmarkPerc.value = false
      percBM.show = false
      document.removeEventListener('mousemove', onMouseMove)
      // setupPercBookmark(canBookmarkPerc.value, chapters)
    }

    return {chapters, curChI, currentChBMPos, navBarClass, chapterProgressBarClass,
            togglePercBookmark, onPercBMAddClick, onPercBMDoneClick, percBM,
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
    &.show .nav-info {
      opacity: 1;
      pointer-events: all;
    }

    &:not(.show) .chapter-progress .chapter-progress__bar.isCurrent {
      flex: 1;
      height: 4px;
    }

    .nav-info {
      position: absolute;
      top: 6px;
      right: 0;
      display: inline-block;
      font-size: 12px;
      line-height: 1;
      padding: 4px 10px;
      box-sizing: border-box;
      background-color: rgba(#FFFFFF, 0.5);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s;
    }

    .chapter-progress {
      display: flex;
      overflow: hidden;
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

          & > div {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background-color: $bar_darken_color;
          }
        }

        &.hasBM {
          background-color: $bm_darken_color;
        }

        &.empty {
          background-color: $bar_color;

          &.hasBM {
            background-color: $bm_color;

            & > div { background-color: $bm_darken_color;}
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
      }
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
    left: 50%;
    transform: translateX(-50%);
    top: 200px;
    width: 100%;
    max-width: 1100px;
    
    &::before {
      content: '';
      position: absolute;
      width: 100%;
      display: block;
      border-bottom: 2px dotted orange;
      pointer-events: none;
    }

    .perc-bookmark-indicator__button {
      position: absolute;
      transform: translateY(-50%);
      right: 100px;

      span {
        display: inline-block;
        cursor: pointer;
        pointer-events: all;
        margin-right: 2px;
        background-color: #dddddd;
        border-radius: 3px;
        transform: scale(0.9);
        transition: scale 0.2s;

        &:hover {
          transform: scale(1);
        }
      }
    }
  }
} // ao3-in-page-bookmark

// #workskin.canBookmarkPara .userstuff > p:hover {
//   background-color: #F5F5F5;
//   cursor: pointer;

//   &::before {
//     content: 'bookmark';
//     position: absolute;
//     bottom: 0;
//     right: 0;
//     transform: translateY(100%);
//     font-size: 10px;
//     background-color: rgb(193, 193, 193);
//   }
// }

#workskin {
  .chapter:nth-child(n+2) {
    overflow-y: auto;
  }

  .userstuff > *:last-child {
    margin-bottom: 0;
  }

  .chapter {
    position: relative;

    .perc-bm {
      position: absolute;
      left: 0;
      z-index: 0;
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
    }
  }

  // .userstuff > p {
  //   position: relative;

  //   &.bookmarked {
  //     background-color: whitesmoke;

  //     &::before {
  //       content: 'bookmarked';
  //       position: absolute;
  //       bottom: 0;
  //       right: 0;
  //       transform: translateY(100%);
  //       font-size: 10px;
  //       background-color: aqua;
  //     }

  //     &:hover {
  //       background-color: rgb(255, 203, 203);

  //       &::before {
  //         content: 'remove bookmark';
  //         background-color: rgb(253, 158, 158);
  //       }
  //     }
  //   }
  // }
}
</style>
