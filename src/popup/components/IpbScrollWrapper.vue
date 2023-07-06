<template>
  <div ref="wrapper" class="ipb-scroll-wrapper" @scroll="onScroll">
    <template v-if="animate">
      <TransitionGroup name="fade-in">
        <div class="ipb-scroll-wrapper__item" :id="`ipb-item-${item.id}`" v-for="item in filteredOptions" :key="item.id">
          <slot name="item" v-bind="{item}"></slot>
        </div>
      </TransitionGroup>
    </template>
    <div v-else class="ipb-scroll-wrapper__item" :id="`ipb-item-${item.id}`" v-for="item in filteredOptions" :key="item.id">
      <slot name="item" v-bind="{item}"></slot>
    </div>
    
    <slot></slot>
  </div>
</template>

<script>
import { onMounted, ref, onUpdated, reactive, computed, nextTick, watch } from 'vue'

export default {
  props: {
    options: Array,
    animate: {
      type: Boolean,
      default: false
    },
    anchorMin: { type: Number, default: 0 },
    maxResultAllowed: { type: Number, default: 20 },
    appendOffset: { type: Number, default: 4 }
  },
  setup (p, {emit}) {
    const initMin = Math.max(0, Math.min(p.options.length - 1 - p.maxResultAllowed, p.anchorMin))
    const initMax = initMin + p.maxResultAllowed
    const anchor = reactive({min: initMin, max: initMax})
    const wrapper = ref(null)

    const filteredOptions = computed(() => {
      return p.options.filter((opt, i) => i >= anchor.min && i <= anchor.max)
    })

    watch(() => p.options,
    () => {
      // console.log('list change, reset anchor')
      anchor.min = 0
      anchor.max = p.maxResultAllowed
    })

    watch(() => p.anchorMin, 
    newAnchorMin => {
      const initMin = Math.min(p.options.length - 1 - p.maxResultAllowed, (newAnchorMin || 0))
      const initMax = initMin + p.maxResultAllowed
      anchor.min = initMin
      anchor.max = initMax
      // console.log('update anchor', anchor)
    })

    const onScroll = async e => {
      const scrollContainer = (e && e.target) || wrapper.value
      const {height} = scrollContainer.getBoundingClientRect()
      const {scrollTop, scrollHeight} = scrollContainer
      
      if (scrollTop <= 0 && anchor.min > 0) { // reach scroll top
        const prevID = `#ipb-item-${filteredOptions.value[0].id}`
        const newMin = Math.max(0, anchor.min - p.appendOffset)
        
        anchor.min = newMin
        anchor.max = Math.min(anchor.min + p.maxResultAllowed, p.options.length - 1)

        await nextTick()
        // console.log('e', e.target, 'wrapper', wrapper.value)
        const prevFirstItem = scrollContainer.querySelector(prevID)
        if (prevFirstItem) {
          const diff = scrollContainer.getBoundingClientRect().top - prevFirstItem.getBoundingClientRect().top
          scrollContainer.scrollTo(0, scrollContainer.scrollTop - diff)
        }
        
        
        emit('top', anchor.min, anchor.max)

      } else if (scrollTop + height >= parseInt(scrollHeight) && anchor.max < p.options.length - 1) { // reach scroll bottom
        const newMax = Math.min(p.options.length - 1, anchor.max + p.appendOffset)
        
        anchor.max = newMax
        anchor.min = Math.max(0, anchor.max - p.maxResultAllowed)

        emit('bottom', anchor.min, anchor.max)
      }
    }

    onMounted(() => {
      // use conventional querySelector instead of direct access from ref to ensure items' order is the same as dom's render
      emit('optionChange', [...wrapper.value.querySelectorAll('.ipb-scroll-wrapper__item')])
      emit('mounted', wrapper.value)
    })

    onUpdated(() => {
      emit('optionChange', [...wrapper.value.querySelectorAll('.ipb-scroll-wrapper__item')])
    })


    return {wrapper, filteredOptions, onScroll}
  }
}
</script>

<style lang="scss">
.ipb-scroll-wrapper {
  .ipb-scroll-wrapper__item {
    & > * {
      width: 100%;
    }
  }
}
</style>
