<template>
  <IpbScrollWrapper class="ipb-search-result" :options="options" :anchorMin="anchorMin"
    @mounted="onWrapperMounted"
    @optionChange="newOpts => activeSearchResults = newOpts"
    @top="onReachEdge" @bottom="onReachEdge">
      <template v-slot:item="{item}">
        <button
            @mousemove="() => onNewItemHover(item)"
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
import { ref, watch, reactive, onMounted, onUnmounted } from 'vue'
import { selection, hoverredItem, activeSearchResults } from '../js/search'

import IpbScrollWrapper from './IpbScrollWrapper.vue'
import IpbIcon from '@/common/IpbIcon.vue'

export default {
  props: ['options'],
  components: { IpbIcon, IpbScrollWrapper },
  setup (p) {
    const scrollWrapper = ref(null)
    const anchorMin = ref((selection.value && selection.value.id - 4) || 0)
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
        scrollWrapper.value.scrollTo(0, scrollWrapper.value.scrollTop + diff) // trigger scroll wrapper scroll event
        // console.log('exceed bottom')
      } else if (btnTop < containerTop) {
        const diff = containerTop - btnTop
        scrollWrapper.value.scrollTo(0, scrollWrapper.value.scrollTop - diff) // trigger scroll wrapper scroll event
        // console.log('exceed top')
      }
    }

    watch(() => hoverredItem.i,
    async newI => {
      if (newI >= 0) {
        // console.log('newI', newI, hoverredItem.viaNav)
        if (hoverredItem.viaNav) {
          const targetElem = activeSearchResults.value[newI - anchorRef.min]
          correctScrollPos(targetElem, newI)

          if (newI === anchorRef.min) {
            scrollWrapper.value.scrollTo(0,0) // trigger scroll wrapper scroll event
            // console.log('nav reach top item')
          } else if (newI === anchorRef.max) {
            scrollWrapper.value.scrollTo(0, scrollWrapper.value.scrollHeight) // trigger scroll wrapper scroll event
            // console.log('nav reach last item')
          }
        }
      } else {
        scrollWrapper.value.scrollTo(0, 0)
        anchorMin.value = 0
      }
    })

    const onWrapperMounted = el => {
      scrollWrapper.value = el
      if (selection.value) {
        onNewItemHover(selection.value)
        for (var i=0; i< activeSearchResults.value.length;i++) {
          const elem = activeSearchResults.value[i]
          if (elem.getAttribute('id') === `ipb-item-${selection.value.id}`) {
            hoverredItem.viaNav = false
            hoverredItem.id = selection.value.id
            hoverredItem.i = selection.value.id
            elem.scrollIntoView()
            break
          }
        }
      }

      
    }

    const onReachEdge = (min, max) => {
      anchorRef.min = min
      anchorRef.max = max
    }

    const onNewItemHover = item => {
      // using mousemove instead of mouseenter to prevent phantom cursor get wrongly recognize as mouseenter event
      if (hoverredItem.id === item.id) return

      hoverredItem.viaNav = false
      hoverredItem.id = item.id
      hoverredItem.i = item.i
    }
 
    return {
      anchorMin, onReachEdge,
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