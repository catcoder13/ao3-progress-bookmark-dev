<template>
  <div ref="wrapper" class="ao3pb-scroll-wrapper" @scroll="onScroll">
    <!-- <template v-if="animate">
      <TransitionGroup name="fade-in">
        <div class="ao3pb-scroll-wrapper__item" :id="`ao3pb-item-${item.id}`" v-for="(item, i) in filteredOptions" :key="item.id">
          <slot name="item" v-bind="{item, index: anchor.min+i+1}"></slot>
        </div>
      </TransitionGroup>
    </template> -->
    <div class="ao3pb-scroll-wrapper__item" :id="`ao3pb-item-${item.id}`" v-for="(item, i) in filteredOptions" :key="item.id">
      <slot name="item" v-bind="{item, index: anchor.min+i+1}"></slot>
    </div>
    
    <slot></slot>
  </div>
</template>

<script>
import { onMounted, ref, reactive, computed, nextTick, watch } from 'vue'

const REACH_EDGE_THRESHOLD = 20

const APPEND_OFFSET = 4
export default {
  props: {
    options: Array,
    // animate: { type: Boolean, default: false },
    anchorMin: { type: Number, default: 0 },
    maxResultAllowed: { type: Number, default: 15 }
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
      anchor.min = 0
      anchor.max = p.maxResultAllowed
      wrapper.value.scrollTo(0, 0)
      // console.log('reset scroll anchor')
    })

    watch(() => p.anchorMin, 
    newAnchorMin => {
      const initMin = Math.min(p.options.length - 1 - p.maxResultAllowed, (newAnchorMin || 0))
      const initMax = initMin + p.maxResultAllowed
      anchor.min = initMin
      anchor.max = initMax
    })

    const onScroll = async e => {
      const scrollContainer = (e && e.target) || wrapper.value
      const {height} = scrollContainer.getBoundingClientRect()
      const {scrollTop, scrollHeight} = scrollContainer
      
      if (scrollTop <= REACH_EDGE_THRESHOLD && anchor.min > 0) { // reach scroll top
        const prevID = `#ao3pb-item-${filteredOptions.value[0].id}`
        const newMin = Math.max(0, anchor.min - APPEND_OFFSET)
        
        anchor.min = newMin
        anchor.max = Math.min(anchor.min + p.maxResultAllowed, p.options.length - 1)

        await nextTick()
        
        const prevFirstItem = scrollContainer.querySelector(prevID)
        if (prevFirstItem) {
          const diff = scrollContainer.getBoundingClientRect().top - prevFirstItem.getBoundingClientRect().top
          scrollContainer.scrollTo(0, scrollContainer.scrollTop - diff)
        }
        
        emit('top', anchor.min, anchor.max)
        
      } else if (Math.ceil(scrollTop) + height >= parseInt(scrollHeight) - REACH_EDGE_THRESHOLD && anchor.max < p.options.length - 1) { // reach scroll bottom
        const newMax = Math.min(p.options.length - 1, anchor.max + APPEND_OFFSET)
        
        anchor.max = newMax
        anchor.min = Math.max(0, anchor.max - p.maxResultAllowed)

        emit('bottom', anchor.min, anchor.max)
      }
    }

    onMounted(() => {
      emit('mounted', wrapper.value)
    })

    return {wrapper, filteredOptions, onScroll, anchor}
  }
}
</script>

<style lang="scss">
.ao3pb-scroll-wrapper {
  .ao3pb-scroll-wrapper__item {
    & > * {
      width: 100%;
    }
  }
}
</style>
