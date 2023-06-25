<template>
  <div ref="wrapper" class="ipb-scroll-wrapper" @scroll="onScroll">
    <slot></slot>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
export default {
  setup (p, {emit}) {
    const wrapper = ref(null)

    // const slots = useSlots()
    const onScroll = e => {
      const {height} = e.target.getBoundingClientRect()
      const {scrollTop, scrollHeight} = e.target
      if (scrollTop <= 0) emit('reachTop')
      else if (scrollTop + height >= parseInt(scrollHeight)) emit('reachBottom')
    }

    onMounted(() => {
      emit('ready', wrapper.value)
    })

    // onUpdated(() => {
    //   console.log('on content change', slots.default()[0].children)
    // })

    return {wrapper, onScroll}
  }
}
</script>

<style lang="scss">
.ipb-scroll-wrapper {

}
</style>
