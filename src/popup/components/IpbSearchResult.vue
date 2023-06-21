<template>
  <IpbScrollWrapper class="ipb-search-result" @ready="onWrapperReady">
    <button
      ref="buttons"
      :id="`ipb-item-${item.i}`"
      v-for="(item, i) in options" :key="i"
      @mouseenter="$emit('update:hoverI', i)"
      @click="$emit('select', $event, item)" class="ipb-search-blur-ref" :class="{current: hoverI === i, [item.type]: true}" >
      <IpbIcon v-if="item.type === 'work'" fill="#888" />
      <IpbIcon v-else type="author" fill="#84b4e7" />
      <span>
        {{ item.text }}
      </span>
      <span class="ipb-author" v-if="item.type === 'work'">by {{ item.works[item.val].author }}</span>
    </button>

    <template v-if="!options.length">
      No matched result.
    </template>
  </IpbScrollWrapper>
  <!-- <div ref="buttonParent" class="ipb-search-result">
    
     
  </div> -->
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import { selection } from '../js/search'

import IpbScrollWrapper from './IpbScrollWrapper.vue'
import IpbIcon from '@/common/IpbIcon.vue'

export default {
  props: ['options', 'hoverI'],
  components: { IpbIcon, IpbScrollWrapper },
  setup (p, {emit}) {
    const buttons = ref([])
    const buttonParent = ref(null)

    const correctScrollPos = targetElem => {
      if (!targetElem || !buttonParent.value) return
      const {top, bottom} = targetElem.getBoundingClientRect()
      const {top: pTop, height: pHeight} = buttonParent.value.getBoundingClientRect()
      
      const btnTop = buttonParent.value.scrollTop + top
      const btnBottom = buttonParent.value.scrollTop + bottom
      const containerTop = buttonParent.value.scrollTop + pTop
      const containerBottom = containerTop + pHeight
      if (btnBottom > containerBottom) {
        const diff = btnBottom - containerBottom
        buttonParent.value.scrollTo(0, buttonParent.value.scrollTop + diff - 1) // -1 to prevent accidentally hover to the next item
      } else if (btnTop < containerTop) {
        const diff = containerTop - btnTop
        buttonParent.value.scrollTo(0, buttonParent.value.scrollTop - diff)
      }
    }

    watch(() => p.hoverI, newI => correctScrollPos(buttons.value[newI]))

    onMounted(() => {
      if (selection.value) {
        for (var i=0; i < buttons.value.length;i++) {
          if (buttons.value[i].getAttribute('id') === `ipb-item-${selection.value.i}`) {
            emit('update:hoverI', i)
            break
          }
        }
      }
    })

    const onWrapperReady = el => {
      buttonParent.value = el
      console.log('ready', buttonParent.value)
    }
 
    return { buttons, onWrapperReady}
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