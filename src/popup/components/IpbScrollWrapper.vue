<template>
  <div ref="wrapper" class="ipb-scroll-wrapper" @scroll="onScroll">
    <div class="ipb-scroll-wrapper__item" :id="`ipb-item-${item.id}`" v-for="(item, i) in filteredOptions" :key="item.id">
      <slot name="item" v-bind="{item}"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { onMounted, ref, onUpdated, reactive, computed, nextTick } from 'vue'

const MAX_RESULT_DISPLAY = 20
const APPEND_OFFSET = 4

const anchor = reactive({min: 0, max: MAX_RESULT_DISPLAY})

export default {
  props: ['options'],
  setup (p, {emit}) {
    const wrapper = ref(null)
    const filteredOptions = computed(() => {
      return p.options.filter((opt, i) => i >= anchor.min && i <= anchor.max)
    })

    const onScroll = async e => {
      
      const scrollContainer = (e && e.target) || wrapper.value
      const {height} = scrollContainer.getBoundingClientRect()
      const {scrollTop, scrollHeight} = scrollContainer
      
      if (scrollTop <= 0 && anchor.min > 0) {
        const prevID = `#ipb-item-${filteredOptions.value[0].id}`
        const newMin = Math.max(0, anchor.min - APPEND_OFFSET)
        
        anchor.min = newMin
        anchor.max = Math.min(anchor.min + MAX_RESULT_DISPLAY, p.options.length - 1)
        await nextTick()

        const prevFirstItem = wrapper.value.querySelector(prevID)
        const diff = wrapper.value.getBoundingClientRect().top - prevFirstItem.getBoundingClientRect().top
        wrapper.value.scrollTo(0, wrapper.value.scrollTop - diff)
        
        emit('top', anchor.min, anchor.max)

      } else if (scrollTop + height >= parseInt(scrollHeight) && anchor.max < p.options.length - 1) {
        const newMax = Math.min(p.options.length - 1, anchor.max + APPEND_OFFSET)
        
        anchor.max = newMax
        anchor.min = Math.max(0, anchor.max - MAX_RESULT_DISPLAY)

        emit('bottom', anchor.min, anchor.max)
      }

      emit('scroll', e)
    }

    onMounted(() => {
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
