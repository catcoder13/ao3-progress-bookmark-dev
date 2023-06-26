<template>
  <IpbScrollWrapper class="ipb-search-result" :options="options"
    @mounted="onWrapperMounted"
    @optionChange="newOpts => activeSearchResults = newOpts"
    @top="onTop" @bottom="onBottom"
    @scroll="onScroll">
      <template v-slot:item="{item}">
        <button
            @mouseenter="e => onNewItemHover(item)"
            @click="$emit('select', $event, item)"
            class="ipb-search-blur-ref" :class="{current: hoverredItem.i === item.i, [item.type]: true}" >
            <IpbIcon v-if="item.type === 'work'" fill="#888" />
            <IpbIcon v-else type="author" fill="#84b4e7" />
            <span>
              {{ item.text }}
              {{ item.i }}
            </span>
            <span class="ipb-author" v-if="item.type === 'work'">by {{ item.works[item.val].author }}</span>
          </button>
      </template>
      <template v-if="!options.length">
        No matched result.
      </template>
  </IpbScrollWrapper>
</template>

<script>
import { ref, watch, reactive } from 'vue'
import { hoverredItem, lastScrollPos, activeSearchResults } from '../js/search'

import IpbScrollWrapper from './IpbScrollWrapper.vue'
import IpbIcon from '@/common/IpbIcon.vue'

export default {
  props: ['options'],
  components: { IpbIcon, IpbScrollWrapper },
  setup (p) {
    const buttons = ref([])
    const scrollWrapper = ref(null)

    const anchorRef = reactive({min: 0, max: 20})

    const correctScrollPos = (targetElem, i) => {
      if (!targetElem || !scrollWrapper.value) return
      const {top, bottom} = targetElem.getBoundingClientRect()
      const {top: pTop, height: pHeight} = scrollWrapper.value.getBoundingClientRect()
      
      const btnTop = scrollWrapper.value.scrollTop + top
      const btnBottom = scrollWrapper.value.scrollTop + bottom
      const containerTop = scrollWrapper.value.scrollTop + pTop
      const containerBottom = containerTop + pHeight
      if (btnBottom + 2 >=containerBottom) {
        const diff = btnBottom - containerBottom
        scrollWrapper.value.scrollTo(0, scrollWrapper.value.scrollTop + diff) // -1 to prevent accidentally hover to the next item
        // console.log('exceed bottom')
      } else if (btnTop < containerTop) {
        const diff = containerTop - btnTop
        scrollWrapper.value.scrollTo(0, scrollWrapper.value.scrollTop - diff)
        // console.log('exceed top')
      }
    }

    watch(() => hoverredItem.i,
    async newI => {
      if (newI >= 0) {
        if (hoverredItem.viaNav) {
          console.log('newI', newI)
          const targetElem = activeSearchResults.value[newI - anchorRef.min]
          correctScrollPos(targetElem, newI)
          // await nextTick()
          if (newI === anchorRef.min) {
            scrollWrapper.value.scrollTo(0,0)
            console.log('nav reach top item')
          } else if (newI === anchorRef.max) {
            scrollWrapper.value.scrollTo(0, scrollWrapper.value.scrollHeight)
            console.log('nav reach last item')
          }
        }
      }
    })

    const onWrapperMounted = el => {
      scrollWrapper.value = el
      

      // const targetID = (selection.value && selection.value.id) || hoverredItem.id
      // const targetElem = document.querySelector(`#ipb-item-${targetID}`)
      
      // if (targetElem) {
      //   console.log('target elem exist???', targetID, targetElem)
      //   if (document.querySelector(`#ipb-item-${targetID}`)) {
      //     for (var i=0;i<activeSearchResults.value.length;i++) {
      //       if (activeSearchResults.value[i].getAttribute('id') === `ipb-item-${targetID}`) {
      //         hoverredItem.viaNav = true
      //         hoverredItem.i = i
      //         hoverredItem.id = targetID
      //         hoverredItem.elem = activeSearchResults.value[i]
      //         activeSearchResults.value[i].scrollIntoView()
      //         console.log('unless')
      //         break
      //       }
      //     }
      //   }
      // }
    }

    const onTop = (min, max) => {
      anchorRef.min = min
      anchorRef.max = max
    }

    const onBottom = (min, max) => {
      anchorRef.min = min
      anchorRef.max = max
    }

    const onNewItemHover = item => {
      hoverredItem.viaNav = false
      hoverredItem.id = item.id
      hoverredItem.i = item.i
    }

    const onScroll = e => {
      lastScrollPos.value = e.target.scrollTop
    }
 
    return {
      buttons,
      onScroll, onTop, onBottom,
      onWrapperMounted, onNewItemHover, hoverredItem, activeSearchResults }
  }
}
</script>

<style lang="scss">
.ipb-search-result {
    display: flex;
    flex-direction: column;
    background-color: #FFF;
    box-shadow: 0 2px 4px #888;

    & > *:nth-child(2n+1) button {
      background-color: #eee;
    }

    button {
      position: relative;
      text-align: left;
      padding: 5px 10px 5px 20px;
      background-color: #FFF;
      cursor: pointer;
      color: #555;

      & > * {
        line-height: 1;
        vertical-align: middle;
      }

      .ipb-icon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 5px;
      }

      // &:nth-child(2n+1) {
      //   background-color: #eee;
      // }

      &.current,
      &.author.current {
        background-color: #555;
        color: #FFF;
      }

      &.author {
        color: #166fce;
      }

      span {
        &:first-of-type {
          padding-right: 8px;
        }

        &.ipb-author {
          opacity: 0.7;
          font-size: 10px;
        }
      }

      
    }
  }
</style>