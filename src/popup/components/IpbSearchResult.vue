<template>
  <div ref="buttonParent" class="ipb-search-result">
    <button
      ref="buttons"
      :id="`ipb-item-${item.i}`"
      v-for="(item, i) in options" :key="i"
      @mouseenter="$emit('update:hoverI', i)"
      @click="$emit('select', $event, item)" class="ipb-search-blur-ref" :class="{current: hoverI === i, [item.type]: true}" >
      <IpbIcon v-if="item.type === 'work'" fill="#888" />
      <IpbIcon v-else type="author" fill="#84b4e7" />
      {{ item.text }}
    </button>
    
    <template v-if="!options.length">
      No matched result.
    </template>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import { selection } from '../js/search'

import IpbIcon from '@/common/IpbIcon.vue'

export default {
  props: ['options', 'hoverI'],
  components: {IpbIcon},
  setup (p, {emit}) {
    const buttons = ref([])
    const buttonParent = ref(null)

    const correctScrollPos = targetElem => {
      if (!targetElem) return
      const {top, bottom} = targetElem.getBoundingClientRect()
      const {top: pTop, height: pHeight} = buttonParent.value.getBoundingClientRect()
      
      const btnTop = buttonParent.value.scrollTop + top
      const btnBottom = buttonParent.value.scrollTop + bottom
      const containerTop = buttonParent.value.scrollTop + pTop
      const containerBottom = containerTop + pHeight
      if (btnBottom > containerBottom) {
        console.log('exit bottom')
        const diff = btnBottom - containerBottom
        buttonParent.value.scrollTo(0, buttonParent.value.scrollTop + diff)
      } else if (btnTop < containerTop) {
        console.log('exit top')
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

    return { buttons, buttonParent }
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
      text-align: left;
      padding: 5px 10px 5px 4px;
      background-color: #FFF;
      white-space: nowrap;
      cursor: pointer;
      color: #555;

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
    }
  }
</style>