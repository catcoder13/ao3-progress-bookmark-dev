<template>
  <IpbScrollWrapper class="ipb-search-result" @ready="onWrapperReady" @reachTop="onReachTop" @reachBottom="onReachBottom">
    <button
    ref="buttons"
      :id="`ipb-item-${item.i}`"
      v-for="(item, i) in options" :key="item.i"
      @mouseenter="() => onNewItemHover(i)"
      @click="$emit('select', $event, item)" class="ipb-search-blur-ref" :class="{current: curSelectedIndex.i === i, [item.type]: true}" >
      <IpbIcon v-if="item.type === 'work'" fill="#888" />
      <IpbIcon v-else type="author" fill="#84b4e7" />
      <span>
        {{ item.text }}
        {{ i }}
      </span>
      <span class="ipb-author" v-if="item.type === 'work'">by {{ item.works[item.val].author }}</span>
    </button>

    <template v-if="!options.length">
      No matched result.
    </template>
  </IpbScrollWrapper>
</template>

<script>
import { nextTick, onMounted, ref, watch } from 'vue'
import { selection, resultAppendDown, resultAppendUp, curSelectedIndex } from '../js/search'

import IpbScrollWrapper from './IpbScrollWrapper.vue'
import IpbIcon from '@/common/IpbIcon.vue'

export default {
  props: ['options'],
  components: { IpbIcon, IpbScrollWrapper },
  setup (p) {
    const buttons = ref([])
    const buttonParent = ref(null)

    const correctScrollPos = (targetElem, i) => {
      if (!targetElem || !buttonParent.value) return
      const {top, bottom} = targetElem.getBoundingClientRect()
      const {top: pTop, height: pHeight} = buttonParent.value.getBoundingClientRect()
      // console.log(i, targetElem.innerText, buttonParent.value.scrollTop, pTop, top)
      const btnTop = buttonParent.value.scrollTop + top
      // const btnBottom = buttonParent.value.scrollTop + bottom
      const btnBottom = buttonParent.value.scrollTop + bottom
      const containerTop = buttonParent.value.scrollTop + pTop
      const containerBottom = containerTop + pHeight
      if (btnBottom > containerBottom) {
        const diff = btnBottom - containerBottom
        buttonParent.value.scrollTo(0, buttonParent.value.scrollTop + diff - 1) // -1 to prevent accidentally hover to the next item
        // console.log('exceed bottom')
      } else if (btnTop < containerTop) {
        const diff = containerTop - btnTop
        buttonParent.value.scrollTo(0, buttonParent.value.scrollTop - diff)
        // console.log('exceed top')
      }
    }

    watch(() => curSelectedIndex.i,
    async newI => {
      if (newI != null && curSelectedIndex.viaNav) {
        await nextTick() // wait until buttons.value updated with new reference elements
        const targetElem = [...buttons.value].sort((a, b) => a.innerText.toLowerCase().localeCompare(b.innerText.toLowerCase()))[newI]
        correctScrollPos(targetElem, newI)
      }
      
    })

    onMounted(() => {
      if (selection.value) {
        const sortedButtons = [...buttons.value].sort((a, b) => a.innerText.toLowerCase().localeCompare(b.innerText.toLowerCase()))
        for (var i=0; i < sortedButtons.length;i++) {
          if (sortedButtons[i].getAttribute('id') === `ipb-item-${selection.value.i}`) {
            curSelectedIndex.viaNav = true
            curSelectedIndex.i = i
            break
          }
        }
      }
    })

    const onWrapperReady = el => buttonParent.value = el
    
    const onReachTop = async () => {
      if (!p.options.length) return
      const prevItemKey = p.options[0].i
      resultAppendUp()
      await nextTick()
      const prevItem = buttons.value.filter(btn => btn.getAttribute('id') === `ipb-item-${prevItemKey}`)[0]
      prevItem.scrollIntoView()

      // console.log('reach top')
    }

    const onReachBottom = () => {
      resultAppendDown()

      // console.log('reach bottom')
    }

    const onNewItemHover = i => {
      curSelectedIndex.viaNav = false
      curSelectedIndex.i = i
    }
 
    return {
      buttons,
      onWrapperReady, onReachTop, onReachBottom, onNewItemHover, curSelectedIndex }
  }
}
</script>

<style lang="scss">
.ipb-search-result {
    display: flex;
    flex-direction: column;
    background-color: #FFF;
    box-shadow: 0 2px 4px #888;

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

      &:nth-child(2n+1) {
        background-color: #eee;
      }

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